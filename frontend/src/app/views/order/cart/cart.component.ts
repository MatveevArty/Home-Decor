import { Component, OnInit } from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ProductType} from "../../../../types/product.type";
import {ProductService} from "../../../shared/services/product.service";
import {CartService} from "../../../shared/services/cart.service";
import {CartType} from "../../../../types/cart.type";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  /**
   * Статичный путь до папки assets с картинками
   */
  public serverStaticPath = environment.serverStaticPath;

  /**
   * Корзина товаров
   */
  public cart: CartType | null = null;

  /**
   * Общая стоимость всехх товаров
   */
  public totalAmount: number = 0;

  /**
   * Общее количество всех товаров
   */
  public totalCount: number = 0;

  /**
   * Продукты
   */
  public extraProducts: ProductType[] = [];

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

  constructor(
    private productService: ProductService,
    private cartService: CartService,) { }

  ngOnInit(): void {
    this.productService.getBestProducts().subscribe(
      (data: ProductType[]) => {
        this.extraProducts = data;
      });

    this.cartService.getCart().subscribe(
      (data: CartType) => {
        this.cart = data;
        this.calculateTotal();
      });
  }

  /**
   * Пересчёт общей суммы заказа
   */
  public calculateTotal() {
    this.totalAmount = 0;
    this.totalCount = 0;

    if (this.cart) {
      this.cart.items.forEach(item => {
        this.totalAmount = this.totalCount + item.quantity * item.product.price;
        this.totalCount = this.totalCount + item.quantity;
      })
    }
  }

  /**
   * Обновление счётчика количества данного товара
   * @param id айди товара
   * @param count счётчик количества
   */
  public updateCount(id: string, count: number) {
    if (this.cart) {
      this.cartService.updateCart(id, count)
        .subscribe((data: CartType) => {
        this.cart = data;
        this.calculateTotal();
      })
    }
  }

}
