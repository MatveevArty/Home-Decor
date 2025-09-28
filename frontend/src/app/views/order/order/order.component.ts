import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CartService} from "../../../shared/services/cart.service";
import {CartType} from "../../../../types/cart.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {DeliveryType} from "../../../../types/delivery.type";
import {FormBuilder, Validators} from "@angular/forms";
import {PaymentType} from "../../../../types/payment.type";
import {MatDialog} from "@angular/material/dialog";
import {MatDialogRef} from "@angular/material/dialog/dialog-ref";
import {OrderService} from "../../../shared/services/order.service";
import {OrderType} from "../../../../types/order.type";
import {HttpErrorResponse} from "@angular/common/http";
import {UserService} from "../../../shared/services/user.service";
import {UserInfoType} from "../../../../types/user-info.type";
import {AuthService} from "../../../core/auth/auth.service";

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
  public paymentTypes = PaymentType;

  /**
   * Форма с данными заказа
   */
  public orderForm = this.fb.group({
    lastName: ['', Validators.required],
    firstName: ['', Validators.required],
    fatherName: [''],
    phone: ['', Validators.required],
    paymentType: [PaymentType.cashToCourier, Validators.required],
    email: ['', [Validators.required, Validators.email]],
    street: [''],
    house: [''],
    entrance: [''],
    apartment: [''],
    comment: [''],
  })

  @ViewChild('popup') popup!: TemplateRef<ElementRef>;

  /**
   * Попап
   */
  public dialogRef: MatDialogRef<any, any> | null = null;

  constructor(private cartService: CartService,
              private _snackBar: MatSnackBar,
              private router: Router,
              private fb: FormBuilder,
              private matDialog: MatDialog,
              private orderService: OrderService,
              private userService: UserService,
              private authService: AuthService) {
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

    if (this.authService.getIsLoggedIn()) {
      this.userService.getUserInfo()
        .subscribe((data: UserInfoType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }

          const userInfo = data as UserInfoType;

          const paramsToUpdate = {
            lastName: userInfo.lastName ? userInfo.lastName : '',
            firstName: userInfo.firstName ? userInfo.firstName : '',
            fatherName: userInfo.fatherName ? userInfo.fatherName : '',
            phone: userInfo.phone ? userInfo.phone : '',
            paymentType: userInfo.paymentType ? userInfo.paymentType : PaymentType.cashToCourier,
            email: userInfo.email ? userInfo.email : '',
            street: userInfo.street ? userInfo.street : '',
            house: userInfo.house ? userInfo.house : '',
            entrance: userInfo.entrance ? userInfo.entrance : '',
            apartment: userInfo.apartment ? userInfo.apartment : '',
            comment: '',
          };

          this.orderForm.setValue(paramsToUpdate);

          if (userInfo.deliveryType) {
            this.deliveryType = userInfo.deliveryType;
          }
        })
    }
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


  /**
   * Соаздние заказа
   */
  public createOrder(): void {
    if (this.orderForm.valid && this.firstName?.value && this.lastName?.value
      && this.phone?.value && this.paymentType?.value && this.email?.value) {

      const paramsObject: OrderType = {
        deliveryType: this.deliveryType,
        firstName: this.firstName?.value,
        lastName: this.lastName?.value,
        phone: this.phone?.value,
        paymentType: this.paymentType?.value,
        email: this.email?.value,
      }

      if (this.deliveryType === DeliveryType.delivery) {
        if (this.street?.value) {
          paramsObject.street = this.street?.value;
        }
        if (this.house?.value) {
          paramsObject.house = this.house?.value;
        }
        if (this.entrance?.value) {
          paramsObject.entrance = this.entrance?.value;
        }
        if (this.apartment?.value) {
          paramsObject.apartment = this.apartment?.value;
        }
      }

      if (this.comment?.value) {
        paramsObject.comment = this.comment?.value;
      }

      this.orderService.createOrder(paramsObject)
        .subscribe({
          next: (data: OrderType | DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              throw new Error((data as DefaultResponseType).message);
            }

            this.dialogRef = this.matDialog.open(this.popup);
            this.dialogRef.backdropClick()
              .subscribe(() => {
                this.router.navigate(['/']);
              })

            this.cartService.setCount(0);
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка создания заказа');
            }
          },
        });
    } else {
      this.orderForm.markAllAsTouched();
      this._snackBar.open('Заполните необходимые поля');
    }
  }

  /**
   * Закрытие попапа по крестику
   */
  public closePopup(): void {
    this.dialogRef?.close();
    this.router.navigate(['/']);
  }
}
