import { Component, OnInit } from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ProductService} from "../../../shared/services/product.service";
import {ProductType} from "../../../../types/product.type";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {CartType} from "../../../../types/cart.type";
import {CartService} from "../../../shared/services/cart.service";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  /**
   * Счётчик количества данного товара
   */
  public count: number = 5;

  /**
   * Рекомендованные товары, получаемые с бэкенда
   */
  public recommendedProducts: ProductType[] = [];

  /**
   * Текущий продукт
   */
  public product!: ProductType;

  /**
   * Настройки для owl-карусели с товарами
   */
  public customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    margin: 24,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
  }

  /**
   * Статичный путь до папки assets с картинками
   */
  public serverStaticPath = environment.serverStaticPath;

  constructor(private productService: ProductService,
              private activatedRoute: ActivatedRoute,
              private cartService: CartService,) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.productService.getProduct(params['url']).subscribe(
        (data: ProductType) => {

          this.cartService.getCart().subscribe((cartData: CartType) => {

            if (cartData) {
              const productInCart = cartData.items.find((item) => item.product.id === data.id);

              if (productInCart) {
                data.countInCart = productInCart.quantity;
                this.count = data.countInCart;
              }
            }

            this.product = data;
          })
        })
    })

    this.productService.getBestProducts().subscribe(
      (data: ProductType[]) => {
        this.recommendedProducts = data;
      })
  }

  /**
   * Обновление счётчика количества данного товара
   * @param value счётчик количества
   */
  public updateCount(value: number) {
    this.count = value;

    if (this.product.countInCart) {
      this.cartService.updateCart(this.product.id, this.count)
        .subscribe((data: CartType) => {
          this.product.countInCart = this.count;
        });
    }
  }

  /**
   * Добавление в корзину установленного количества данного товара
   */
  public addToCart(): void {
    this.cartService.updateCart(this.product.id, this.count)
      .subscribe((data: CartType) => {
        this.product.countInCart = this.count;
      });
  }

  /**
   * Удаление товара из корзины
   */
  public removeFromCart(): void {
    this.cartService.updateCart(this.product.id, 0)
      .subscribe((data: CartType) => {
        this.product.countInCart = 0;
        this.count = 1;
      });
  }
}
