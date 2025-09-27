import { Injectable } from '@angular/core';
import {Observable, Subject, tap} from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CartType} from "../../../types/cart.type";
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  /**
   * Счётчик количества всех товаров корзины
   */
  public count: number = 0;

  /**
   * Сабджект счётчика количества всех товаров корзины
   */
  public count$: Subject<number> = new Subject<number>();

  constructor(private http: HttpClient) { }

  /**
   * Запрос на получение конкретного продукта
   */
  public getCart(): Observable<CartType | DefaultResponseType> {
    return this.http.get<CartType | DefaultResponseType>(environment.api + 'cart', { withCredentials: true })
  }

  /**
   * Запрос на получение конкретного продукта
   */
  public getCartCount(): Observable<{ count: number } | DefaultResponseType> {
    return this.http.get<{ count: number } | DefaultResponseType>(environment.api + 'cart/count', { withCredentials: true })
      .pipe(
        tap((data => {
          if (!data.hasOwnProperty('error')) {
            this.count = (data as { count: number }).count;
            this.count$.next(this.count);
          }
        }))
      )
  }

  /**
   * Запрос на добавление конкретного продукта в корзину
   * @param productId айди продукта
   * @param quantity количество данного продукта
   */
  public updateCart(productId: string, quantity: number): Observable<CartType | DefaultResponseType> {
    return this.http.post<CartType | DefaultResponseType>(environment.api + 'cart', { productId, quantity }, { withCredentials: true })
      .pipe(
        tap((data => {
          if (!data.hasOwnProperty('error')) {
            this.count = 0;
            (data as CartType).items.forEach(item => {
              this.count = this.count + item.quantity;
            });
            this.count$.next(this.count);
          }
        }))
      )
  }
}
