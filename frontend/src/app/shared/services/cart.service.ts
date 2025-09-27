import { Injectable } from '@angular/core';
import {Observable, Subject, tap} from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CartType} from "../../../types/cart.type";

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
  public getCart(): Observable<CartType> {
    return this.http.get<CartType>(environment.api + 'cart', { withCredentials: true })
  }

  /**
   * Запрос на получение конкретного продукта
   */
  public getCartCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(environment.api + 'cart/count', { withCredentials: true })
      .pipe(
        tap((data => {
          this.count = data.count;
          this.count$.next(this.count);
        }))
      )
  }

  /**
   * Запрос на добавление конкретного продукта в корзину
   * @param productId айди продукта
   * @param quantity количество данного продукта
   */
  public updateCart(productId: string, quantity: number): Observable<CartType> {
    return this.http.post<CartType>(environment.api + 'cart', { productId, quantity }, { withCredentials: true })
      .pipe(
        tap((data => {
          this.count = 0;
          data.items.forEach(item => {
            this.count = this.count + item.quantity;
          });

          this.count$.next(this.count);
        }))
      )
  }
}
