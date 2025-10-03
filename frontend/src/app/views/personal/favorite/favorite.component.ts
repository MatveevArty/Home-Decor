import { Component, OnInit } from '@angular/core';
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";
import {CartType} from "../../../../types/cart.type";
import {CartService} from "../../../shared/services/cart.service";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {

  /**
   * Счётчик количества данного товара
   */
  public count: number = 1;

  /**
   * Массив товаров из Избранное для даного пользователя
   */
  public favoriteProducts: FavoriteType[] = [];

  /**
   * Статичный путь до папки assets с картинками
   */
  public serverStaticPath = environment.serverStaticPath;

  /**
   * Корзина товаров
   */
  public cart: CartType | null = null;

  constructor(private favoriteService: FavoriteService,
              private cartService: CartService,) { }

  ngOnInit(): void {
    this.favoriteService.getFavorites()
      .subscribe((data: FavoriteType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const errorMessage = (data as DefaultResponseType).message;
          throw new Error(errorMessage);
        }

        this.favoriteProducts = data as FavoriteType[];

        // Загружаем информацию о корзине для каждого товара
        if (this.favoriteProducts.length > 0) {
          this.loadCartInfo();
        }
      });
  }

  /**
   * Загрузка информации о корзине для товаров в избранном
   */
  private loadCartInfo(): void {
    this.cartService.getCart()
      .subscribe((cartData: CartType | DefaultResponseType) => {
        if ((cartData as DefaultResponseType).error !== undefined) {
          throw new Error((cartData as DefaultResponseType).message);
        }

        const cartDataResponse = cartData as CartType;

        if (cartDataResponse) {
          this.favoriteProducts.forEach(product => {
            const productInCart = cartDataResponse.items.find(item => item.product.id === product.id);
            if (productInCart) {
              product.countInCart = productInCart.quantity;
            } else {
              product.countInCart = 0;
            }
          });
        }
      });
  }

  /**
   * Удаление товара из Избранное
   * @param id айди товара
   */
  public removeFromFavorites(id: string): void {
    this.favoriteService.removeFavorite(id)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) {
          // some processing
          throw new Error(data.message);
        }

        this.favoriteProducts = this.favoriteProducts.filter((item) => item.id !== id);
      })
  }

  /**
   * Обновление счётчика количества данного товара
   * @param value счётчик количества
   * @param product товар
   */
  public updateCount(value: number, product: FavoriteType) {
    if (product.countInCart) {
      this.cartService.updateCart(product.id, value)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }

          product.countInCart = value;
        });
    }
  }

  /**
   * Добавление товара в корзину
   * @param product товар
   */
  public addToCart(product: FavoriteType): void {
    this.cartService.updateCart(product.id, this.count)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        product.countInCart = this.count;
      });
  }

  /**
   * Удаление товара из корзины
   * @param product товар
   */
  public removeFromCart(product: FavoriteType): void {
    this.cartService.updateCart(product.id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        product.countInCart = 0;
        this.count = 1;
      });
  }
}
