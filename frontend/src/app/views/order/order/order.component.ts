import { Component, OnInit } from '@angular/core';
import {CartService} from "../../../shared/services/cart.service";
import {CartType} from "../../../../types/cart.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {DeliveryType} from "../../../../types/delivery.type";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  /**
   * Способ доставки по умолчанию
   */
  public deliveryType: DeliveryType = DeliveryType.delivery;

  /**
   * Типы доставок
   */
  public deliveryTypes = DeliveryType;

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

  constructor(private cartService: CartService,
              private _snackBar: MatSnackBar,
              private router: Router,) { }

  ngOnInit(): void {
    this.cartService.getCart().subscribe(
      (data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        this.cart = data as CartType;

        if (!this.cart || (this.cart && this.cart.items.length === 0)) {
          this._snackBar.open('Корзина пустая, невозможно создать заказ');
          this.router.navigate(['/']);
          return;
        }

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
   * Переключатель способа доставки
   * @param type способ доставки
   */
  public changeDeliveryType(type: DeliveryType): void {
    this.deliveryType = type;
  }
}
