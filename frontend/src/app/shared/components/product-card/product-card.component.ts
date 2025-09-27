import {Component, Input, OnInit} from '@angular/core';
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment";
import {CartService} from "../../services/cart.service";
import {CartType} from "../../../../types/cart.type";

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() product!: ProductType;

  /**
   * Путь до папки с картинками на бэкенде
   */
  public serverStaticPath = environment.serverStaticPath;

  /**
   * Счётчик количества данного товара
   */
  public count: number = 1;

  @Input() isLight: boolean = false;

  @Input() countInCart: number | undefined = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    if (this.countInCart && this.countInCart > 1) {
      this.count = this.countInCart;
    }
  }

  /**
   * Добавление товара в корзину определённого количества
   */
  public addToCart(): void {
    this.cartService.updateCart(this.product.id, this.count)
      .subscribe((data: CartType) => {
        this.countInCart = this.count;
      });
  }

  /**
   * Обновление счётчика количества данного товара
   * @param value счётчик количества
   */
  public updateCount(value: number) {
    this.count = value;
    if (this.countInCart) {
      this.cartService.updateCart(this.product.id, this.count)
        .subscribe((data: CartType) => {
          this.countInCart = this.count;
        });
    }
  }

  /**
   * Удаление товара из корзины
   */
  public removeFromCart(): void {
    this.cartService.updateCart(this.product.id, 0)
      .subscribe((data: CartType) => {
        this.countInCart = 0;
        this.count = 1;
      });
  }
}
