import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../../shared/services/product.service";
import {ProductType} from "../../../../types/product.type";
import {CategoryService} from "../../../shared/services/category.service";
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsUtil} from "../../../shared/utils/active-params.util";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {AppliedFilterType} from "../../../../types/applied-filter.type";
import {debounceTime} from "rxjs";
import {CartService} from "../../../shared/services/cart.service";
import {CartType} from "../../../../types/cart.type";
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {AuthService} from "../../../core/auth/auth.service";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  /**
   * Продукты
   */
  public products: ProductType[] = [];

  /**
   * Категории с наполняющими их типами
   */
  public categoriesWithTypes: CategoryWithTypeType[] = [];

  /**
   * Массив урлов для выбранных типов фильтра
   */
  public activeParams: ActiveParamsType = { types: [] };

  /**
   * Массив применённых фильтров
   */
  public appliedFilters: AppliedFilterType[] = [];

  /**
   * Флаг открытости кнопки Сортировка
   */
  public sortingOpen: boolean = false;

  /**
   * Список параметров сортировки для кнопки Сортировка
   */
  public sortingOptions: { name: string, value: string }[] = [
    { name: 'От А до Я', value: 'az-asc' },
    { name: 'От Я до А', value: 'az-desc' },
    { name: 'По возрастанию цены', value: 'price-asc' },
    { name: 'По убыванию цены', value: 'price-desc' },
  ];

  /**
   * Массив страниц
   */
  public pages: number[] = [];

  /**
   * Корзина товаров
   */
  public cart: CartType | null = null;

  /**
   * Массив товаров из Избранного для авторизованного пользователя
   */
  public favoriteProducts: FavoriteType[] | null = null;

  constructor(private productService: ProductService,
              private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
              private cartService: CartService,
              private router: Router,
              private favoriteService: FavoriteService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.cartService.getCart().subscribe((data: CartType) => {
      this.cart = data;

      if (this.authService.getIsLoggedIn()) {
        this.favoriteService.getFavorites()
          .subscribe(
            {
              next: (data: FavoriteType[] | DefaultResponseType) => {
                if ((data as DefaultResponseType).error !== undefined) {
                  const errorMessage = (data as DefaultResponseType).message;
                  this.processCatalog();
                  throw new Error(errorMessage);
                }

                this.favoriteProducts = data as FavoriteType[];
                this.processCatalog();
              },
              error: (error) => {
                this.processCatalog();
              }
            });
      } else {
        this.processCatalog();
      }
    });
  }

  /**
   * Обработка запросов на получение товаров каталога с учётом данных пользователя
   */
  public processCatalog() {
    this.categoryService.getCategoriesWithTypes().subscribe((data) => {
      this.categoriesWithTypes = data;

      this.activatedRoute.queryParams
        .pipe(
          debounceTime(1000)
        )
        .subscribe((params) => {
          this.activeParams = ActiveParamsUtil.processParams(params);

          this.appliedFilters = [];
          this.activeParams.types.forEach((url) => {

            for (let i = 0; i < this.categoriesWithTypes.length; i++) {
              const foundType = this.categoriesWithTypes[i].types.find((type) => type.url === url);

              if (foundType) {
                this.appliedFilters.push({
                  name: foundType.name,
                  urlParam: foundType.url,
                })
              }
            }
          });

          if (this.activeParams.heightFrom) {
            this.appliedFilters.push({
              name: 'Высота от ' + this.activeParams.heightFrom + ' см',
              urlParam: 'heightFrom',
            });
          }

          if (this.activeParams.heightTo) {
            this.appliedFilters.push({
              name: 'Высота до ' + this.activeParams.heightTo + ' см',
              urlParam: 'heightTo',
            });
          }

          if (this.activeParams.diameterFrom) {
            this.appliedFilters.push({
              name: 'Диаметр от ' + this.activeParams.diameterFrom + ' см',
              urlParam: 'diameterFrom',
            });
          }

          if (this.activeParams.diameterTo) {
            this.appliedFilters.push({
              name: 'Диаметр до ' + this.activeParams.diameterTo + ' см',
              urlParam: 'diameterTo',
            });
          }

          this.productService.getProducts(this.activeParams).subscribe(
            data => {
              this.pages = [];
              for (let i = 1; i <= data.pages; i++) {
                this.pages.push(i);
              }

              if (this.cart && this.cart.items.length > 0) {
                this.products = data.items.map((product) => {
                  if (this.cart) {
                    const productInCart = this.cart?.items.find((item) => item.product.id === product.id);
                    if (productInCart) {
                      product.countInCart = productInCart.quantity
                    }
                  }
                  return product;
                });
              } else {
                this.products = data.items;
              }

              if (this.favoriteProducts) {
                this.products = this.products.map((product) => {
                  const productInFavorites = this.favoriteProducts?.find((item) => item.id === product.id);

                  if (productInFavorites) {
                    product.isInFavorite = true;
                  }

                  return product;
                })
              }
            }
          );
        })
    });
  }

  /**
   * Удаление фильтра из списка фильтров
   * @param appliedFilter удаляемый фильтр
   */
  public removeAppliedFilter(appliedFilter: AppliedFilterType) {
    if (appliedFilter.urlParam === 'heightFrom' || appliedFilter.urlParam === 'heightTo'
      || appliedFilter.urlParam === 'diameterFrom' || appliedFilter.urlParam === 'diameterTo') {
      delete this.activeParams[appliedFilter.urlParam];
    } else {
      this.activeParams.types = this.activeParams.types.filter((type) => type !== appliedFilter.urlParam);
    }

    this.activeParams.page = 1;

    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams,
    });
  }

  /**
   * Обработка клика по кнопке Сортировка
   */
  public toggleSorting() {
    this.sortingOpen = !this.sortingOpen;
  }

  /**
   * Сортировка при клике на вариант сортировки
   * @param value вариант сортировки
   */
  public sort(value: string) {
    this.activeParams.sort = value;

    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams,
    });
  }

  /**
   * Переход на предыдущую страницу в пагинации
   */
  public openPrevPage(): void {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;

      this.router.navigate(['/catalog'], {
        queryParams: this.activeParams,
      });
    }
  }

  /**
   * Переход на указанную страницу в пагинации
   * @param page
   */
  public openPage(page: number): void {
    this.activeParams.page = page;

    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams,
    });
  }

  /**
   * Переход на следующую страницу в пагинации
   */
  public openNextPage(): void {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;

      this.router.navigate(['/catalog'], {
        queryParams: this.activeParams,
      });
    }
  }

}
