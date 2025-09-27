import { Component, OnInit } from '@angular/core';
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {

  /**
   * Массив товаров из Избранное для даного пользователя
   */
  public favoriteProducts: FavoriteType[] = [];

  /**
   * Статичный путь до папки assets с картинками
   */
  public serverStaticPath = environment.serverStaticPath;

  constructor(private favoriteService: FavoriteService,) { }

  ngOnInit(): void {
    this.favoriteService.getFavorites()
      .subscribe((data: FavoriteType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const errorMessage = (data as DefaultResponseType).message;
          throw new Error(errorMessage);
        }

        this.favoriteProducts = data as FavoriteType[];
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
}
