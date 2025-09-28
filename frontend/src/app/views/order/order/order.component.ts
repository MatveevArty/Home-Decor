import {Component, OnInit} from '@angular/core';
import {CartService} from "../../../shared/services/cart.service";
import {CartType} from "../../../../types/cart.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {DeliveryType} from "../../../../types/delivery.type";
import {FormBuilder, Validators} from "@angular/forms";
import {PaymentTypes} from "../../../../types/payment.type";

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

  /**
   * Енам типов оплаты
   */
  public paymentTypes = PaymentTypes;

  /**
   * Форма с данными заказа
   */
  public orderForm = this.fb.group({
    lastName: ['', Validators.required],
    firstName: ['', Validators.required],
    fatherName: [''],
    phone: ['', Validators.required],
    paymentType: [PaymentTypes.cashToCourier, Validators.required],
    email: ['', [Validators.required, Validators.email]],
    street: [''],
    house: [''],
    entrance: [''],
    apartment: [''],
    comment: [''],
  })

  constructor(private cartService: CartService,
              private _snackBar: MatSnackBar,
              private router: Router,
              private fb: FormBuilder,) {
    this.updateDeliveryTypeValidation();
  }

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
   * Геттер для поля Фамилия
   */
  get lastName() {
    return this.orderForm.get('lastName');
  }

  /**
   * Геттер для поля Имя
   */
  get firstName() {
    return this.orderForm.get('firstName');
  }

  /**
   * Геттер для поля Отчество
   */
  get fatherName() {
    return this.orderForm.get('fatherName');
  }

  /**
   * Геттер для поля Номер телефона
   */
  get phone() {
    return this.orderForm.get('phone');
  }

  /**
   * Геттер для поля Способ оплаты
   */
  get paymentType() {
    return this.orderForm.get('paymentType');
  }

  /**
   * Геттер для поля Email
   */
  get email() {
    return this.orderForm.get('email');
  }

  /**
   * Геттер для поля Улица
   */
  get street() {
    return this.orderForm.get('street');
  }

  /**
   * Геттер для поля Номер дома
   */
  get house() {
    return this.orderForm.get('house');
  }

  /**
   * Геттер для поля Подъезд
   */
  get entrance() {
    return this.orderForm.get('entrance');
  }

  /**
   * Геттер для поля Квартира
   */
  get apartment() {
    return this.orderForm.get('apartment');
  }

  /**
   * Геттер для поля Комментарий
   */
  get comment() {
    return this.orderForm.get('comment');
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
    this.updateDeliveryTypeValidation();
  }

  /**
   * Обновление валидации для полей адреса доставки
   */
  public updateDeliveryTypeValidation() {
    if (this.deliveryType === DeliveryType.delivery) {
      this.street?.setValidators(Validators.required);
      this.house?.setValidators(Validators.required);
    } else {
      this.street?.removeValidators(Validators.required);
      this.house?.removeValidators(Validators.required);

      this.street?.setValue('');
      this.house?.setValue('');
      this.entrance?.setValue('');
      this.apartment?.setValue('');
    }

    this.street?.updateValueAndValidity();
    this.house?.updateValueAndValidity();
  }


  public createOrder(): void {
    if (this.orderForm.valid) {
      console.log(this.orderForm.value);
    }
  }
}
