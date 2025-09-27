import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {FavoriteType} from "../../../types/favorite.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(private http: HttpClient) { }

  /**
   * Запрос на получение товаров в Избранное данного пользователя
   */
  public getFavorites(): Observable<FavoriteType[] | DefaultResponseType> {
    return this.http.get<FavoriteType[] | DefaultResponseType>(environment.api + 'favorites')
  }

  /**
   * Запрос на удаление данного товара из Избранное данного пользователя
   * @param productId айди данного товара
   */
  public removeFavorite(productId: string): Observable<DefaultResponseType> {
    return this.http.delete<DefaultResponseType>(environment.api + 'favorites', { body: { productId } })
  }

  /**
   * Запрос на добавление данного товара из Избранное данного пользователя
   * @param productId айди данного товара
   */
  public addFavorite(productId: string): Observable<FavoriteType | DefaultResponseType> {
    return this.http.post<FavoriteType | DefaultResponseType>(environment.api + 'favorites', { productId })
  }
}
