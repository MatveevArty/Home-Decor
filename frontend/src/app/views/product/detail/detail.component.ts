import { Component, OnInit } from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ProductService} from "../../../shared/services/product.service";
import {ProductType} from "../../../../types/product.type";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  /**
   * Рекомендованные товары, получаемые с бэкенда
   */
  public recommendedProducts: ProductType[] = [];

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

  constructor(private productService: ProductService,) { }

  ngOnInit(): void {
    this.productService.getBestProducts().subscribe(
      (data: ProductType[]) => {
        this.recommendedProducts = data;
      })
  }



}
