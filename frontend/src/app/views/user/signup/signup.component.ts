import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {LoginResponseType} from "../../../../types/login-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  /**
   * Форма с данными для входа
   */
  public signupForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-zа-я])(?=.*[A-ZА-Я])[0-9a-zA-Zа-яА-Я]{8,}$/)]],
    passwordRepeat: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-zа-я])(?=.*[A-ZА-Я])[0-9a-zA-Zа-яА-Я]{8,}$/)]],
    agree: [false, [Validators.requiredTrue]],
  });

  /**
   * Геттер для поля Почта
   */
  public get email() {
    return this.signupForm.get('email');
  }

  /**
   * Геттер для поля Пароль
   */
  public get password() {
    return this.signupForm.get('password');
  }

  /**
   * Геттер для поля Пароль
   */
  public get passwordRepeat() {
    return this.signupForm.get('passwordRepeat');
  }

  /**
   * Геттер для поля Согласен с правилами
   */
  public get agree() {
    return this.signupForm.get('agree');
  }

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router,) { }

  ngOnInit(): void {
  }

  /**
   * Регистрация в системе
   */
  public signup() {
    if (this.signupForm.valid && this.email?.value && this.password?.value && this.passwordRepeat?.value && this.agree?.value) {
      this.authService.signup(this.email.value, this.password.value, this.passwordRepeat.value).subscribe({
        next: (data: LoginResponseType | DefaultResponseType) => {
          let error = null;
          if ((data as DefaultResponseType).error !== undefined) {
            error = (data as DefaultResponseType).message;
          }

          const loginResponse = data as LoginResponseType;
          if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
            error = 'Ошибка авторизации';
          }

          if (error) {
            this._snackBar.open(error);
            throw new Error(error);
          }

          this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
          this.authService.userId = loginResponse.userId;
          this._snackBar.open('Вы успешно зарегистрировались');
          this.router.navigate(['/'])
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          } else {
            this._snackBar.open('Ошибка регистрации');
          }
        }
      });
    }
  }

}
