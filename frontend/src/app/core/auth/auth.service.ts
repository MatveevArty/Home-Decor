import { Injectable } from '@angular/core';
import {Observable, Subject, throwError} from "rxjs";
import {LoginResponseType} from "../../../types/login-response.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
   * Строка-ключ для accessToken
   */
  public accessTokenKey: string = 'accessToken';

  /**
   * Строка-ключ для refreshToken
   */
  public refreshTokenKey: string = 'refreshToken';

  /**
   * Строка-ключ для userId
   */
  public userIdKey: string = 'userId';

  /**
   * Сабджект состояния залогинен ли пользователь
   */
  public isLoggedSubject: Subject<boolean> = new Subject<boolean>();

  /**
   * Флаг факта логина пользователем
   */
  public isLogged: boolean = false;

  constructor(private http: HttpClient) {
    this.isLogged = Boolean(localStorage.getItem(this.accessTokenKey));
  }

  /**
   * Запрос на вход в систему
   * @param email Почта
   * @param password Пароль
   * @param rememberMe Флаг Запомнить меня
   */
  public login(email: string, password: string, rememberMe: boolean):Observable<LoginResponseType | DefaultResponseType> {
    return this.http.post<LoginResponseType | DefaultResponseType>(environment.api + 'login', {
      email, password, rememberMe
    });
  }

  /**
   * Запрос на выход из системы
   */
  public logout():Observable<DefaultResponseType> {
    const tokens = this.getTokens();

    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'logout', {
        refreshToken: tokens.refreshToken
      });
    }
    throw throwError(() => 'Cannot find tokens');
  }

  /**
   * Получить флаг факта логина пользователем
   */
  public getIsLoggedIn() {
    return this.isLogged;
  }

  /**
   * Установить токены в localStorage
   * @param accessToken accessToken
   * @param refreshToken refreshToken
   */
  public setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged = true;
    this.isLoggedSubject.next(true);
  }

  /**
   * Удалить токены из localStorage
   */
  public removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLogged = false;
    this.isLoggedSubject.next(false);
  }

  /**
   * Получить токены из localStorage
   */
  public getTokens(): {accessToken: string | null, refreshToken: string | null} {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey),
    }
  }

  /**
   * Геттер для userId из localStorage
   */
  get userId(): null | string {
    return localStorage.getItem(this.userIdKey);
  }

  /**
   * Сеттер для userId в localStorage
   * @param id
   */
  set userId(id: string | null) {
    if (id) {
      localStorage.setItem(this.userIdKey, id);
    } else {
      localStorage.removeItem(this.userIdKey);
    }
  }
}
