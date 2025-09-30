import {Component, HostListener, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {CartService} from "../../services/cart.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {ProductService} from "../../services/product.service";
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment";
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  /**
   * Форма ввода для поиска
   */
  public searchField = new FormControl();

  /**
   * Флаг состояния поиска
   */
  public showSearch: boolean = false;

  /**
   * Статичный путь до папки assets с картинками
   */
  public serverStaticPath = environment.serverStaticPath;

  /**
   * Массив продуктов
   */
  public products: ProductType[] = [];

  /**
   * Счётчик количества товаров в корзине
   */
  public count: number = 0;

  /**
   * Флаг факта логина пользователем
   */
  public isLoggedIn: boolean = false;

  @Input() categories: CategoryWithTypeType[] = [];

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if (this.showSearch && (event.target as HTMLElement).className.indexOf('search-product') === -1) {
      this.showSearch = false;
    }
  }

  constructor(private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router,
              private cartService: CartService,
              private productService: ProductService,) {
    this.isLoggedIn = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.searchField.valueChanges
      .pipe(
        debounceTime(1000)
      )
      .subscribe((value) => {
        if (value && value.length > 2) {
          this.productService.searchProducts(value)
            .subscribe((data: ProductType[]) => {
              this.products = data;
              this.showSearch = true;
            })
        } else {
          this.products = [];
        }
      })

    this.authService.isLoggedSubject.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
    })

    this.cartService.getCartCount()
      .subscribe((data: { count: number } | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        this.count = (data as { count: number }).count;
      });

    this.cartService.count$
      .subscribe((count: number) => {
        this.count = count;
      })
  }

  /**
   * Выход из системы
   */
  public logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.doLogout();
      },
      error: () => {
        this.doLogout();
      }
    });
  }

  /**
   * Удаление токенов из localStorage и отображение попапа об успешном выходе
   */
  public doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы успешно вышли из системы');
    this.router.navigate(['/']);
  }

  /**
   * Переход на страницу кликнутого товара в поиске
   * @param url урл товара
   */
  public selectProduct(url: string): void {
    this.router.navigate(['/product' + url]);
    this.searchField.setValue('');
    this.products = [];
  }
}
