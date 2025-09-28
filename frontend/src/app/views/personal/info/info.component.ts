import {Component, OnInit} from '@angular/core';
import {DeliveryType} from "../../../../types/delivery.type";
import {PaymentType} from "../../../../types/payment.type";
import {FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../../shared/services/user.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {UserInfoType} from "../../../../types/user-info.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  /**
   * Способ доставки по умолчанию
   */
  public deliveryType: DeliveryType = DeliveryType.delivery;

  /**
   * Енам типов доставок
   */
  public deliveryTypes = DeliveryType;

  /**
   * Енам типов оплаты
   */
  public paymentTypes = PaymentType;

  /**
   * Форма с данными Личного кабинета
   */
  public userInfoForm = this.fb.group({
    lastName: [''],
    firstName: [''],
    fatherName: [''],
    phone: [''],
    paymentType: [PaymentType.cashToCourier],
    email: ['', Validators.required],
    street: [''],
    house: [''],
    entrance: [''],
    apartment: [''],
  })

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private _snackBar: MatSnackBar,) { }

  ngOnInit(): void {
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
        };

        this.userInfoForm.setValue(paramsToUpdate);

        if (userInfo.deliveryType) {
          this.deliveryType = userInfo.deliveryType;
        }
    })
  }

  /**
   * Геттер для поля Фамилия
   */
  get lastName() {
    return this.userInfoForm.get('lastName');
  }

  /**
   * Геттер для поля Имя
   */
  get firstName() {
    return this.userInfoForm.get('firstName');
  }

  /**
   * Геттер для поля Отчество
   */
  get fatherName() {
    return this.userInfoForm.get('fatherName');
  }

  /**
   * Геттер для поля Номер телефона
   */
  get phone() {
    return this.userInfoForm.get('phone');
  }

  /**
   * Геттер для поля Способ оплаты
   */
  get paymentType() {
    return this.userInfoForm.get('paymentType');
  }

  /**
   * Геттер для поля Email
   */
  get email() {
    return this.userInfoForm.get('email');
  }

  /**
   * Геттер для поля Улица
   */
  get street() {
    return this.userInfoForm.get('street');
  }

  /**
   * Геттер для поля Номер дома
   */
  get house() {
    return this.userInfoForm.get('house');
  }

  /**
   * Геттер для поля Подъезд
   */
  get entrance() {
    return this.userInfoForm.get('entrance');
  }

  /**
   * Геттер для поля Квартира
   */
  get apartment() {
    return this.userInfoForm.get('apartment');
  }

  /**
   * Переключатель способа доставки
   * @param type способ доставки
   */
  public changeDeliveryType(type: DeliveryType): void {
    this.deliveryType = type;
    this.userInfoForm.markAsDirty();
  }

  /**
   * Обновление данных пользователя в форме
   */
  public updateUserInfo() {
    if (this.userInfoForm.valid) {

      const paramObject: UserInfoType = {
        email: this.email?.value ? this.email?.value : '',
        deliveryType: this.deliveryType,
        paymentType: this.paymentType?.value ? this.paymentType.value : PaymentType.cashToCourier,
      }

      if (this.firstName?.value) {
        paramObject.firstName = this.firstName?.value;
      }

      if (this.lastName?.value) {
        paramObject.lastName = this.lastName?.value;
      }

      if (this.fatherName?.value) {
        paramObject.fatherName = this.fatherName?.value;
      }

      if (this.phone?.value) {
        paramObject.phone = this.phone?.value;
      }

      if (this.street?.value) {
        paramObject.street = this.street?.value;
      }

      if (this.house?.value) {
        paramObject.house = this.house?.value;
      }

      if (this.entrance?.value) {
        paramObject.entrance = this.entrance?.value;
      }

      if (this.apartment?.value) {
        paramObject.apartment = this.apartment?.value;
      }

      this.userService.updateUserInfo(paramObject)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if (data.error) {
              this._snackBar.open(data.message);
              throw new Error(data.message);
            }

            this._snackBar.open('Данные успешно сохранены');
            this.userInfoForm.markAsPristine();
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка сохранения данных пользователя');
            }
          },
        })
    }
  }
}
