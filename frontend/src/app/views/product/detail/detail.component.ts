import { Component, OnInit } from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ProductService} from "../../../shared/services/product.service";
import {ProductType} from "../../../../types/product.type";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  /**
   * Счётчик количества данного товара
   */
  public count: number = 5;

  /**
   * Рекомендованные товары, получаемые с бэкенда
   */
  public recommendedProducts: ProductType[] = [];

  /**
   * Текущий продукт
   */
  public product!: ProductType;

  /**
   * Настройки для owl-карусели с товарами
   */
  public customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    margin: 24,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
  }

  /**
   * Статичный путь до папки assets с картинками
   */
  public serverStaticPath = environment.serverStaticPath;

  constructor(private productService: ProductService,
              private activatedRoute: ActivatedRoute,) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.productService.getProduct(params['url']).subscribe(
        (data: ProductType) => {
          this.product = data;
        })
    })

    this.productService.getBestProducts().subscribe(
      (data: ProductType[]) => {
        this.recommendedProducts = data;
      })
  }

  /**
   * Обновление счётчика количества данного товара
   * @param value счётчик количества
   */
  public updateCount(value: number) {
    this.count = value;
  }

  /**
   * Добавление в корзину установленного количества данного товара
   */
  public addToCart(): void {
    alert('Добавлено в корзину следующее количество тданного товара: ' + this.count);
  }

}
