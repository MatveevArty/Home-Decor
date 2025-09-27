import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CartType} from "../../../types/cart.type";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient) { }

  /**
   * Запрос на получение конкретного продукта
   */
  public getCart(): Observable<CartType> {
    return this.http.get<CartType>(environment.api + 'cart', { withCredentials: true })
  }

  /**
   * Запрос на добавление конкретного продукта в корзину
   * @param productId айди продукта
   * @param quantity количество данного продукта
   */
  public updateCart(productId: string, quantity: number): Observable<CartType> {
    return this.http.post<CartType>(environment.api + 'cart', { productId, quantity }, { withCredentials: true })
  }
}
