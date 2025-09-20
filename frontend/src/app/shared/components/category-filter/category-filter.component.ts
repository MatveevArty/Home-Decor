import {Component, Input, OnInit} from '@angular/core';
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsUtil} from "../../utils/active-params.util";

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss']
})
export class CategoryFilterComponent implements OnInit {

  @Input() categoryWithTypes: CategoryWithTypeType | null = null;
  @Input() type: string | null = null;

  /**
   * Состояние раскрытия кнопки фильтра
   */
  public open: boolean = false;

  /**
   * Массив урлов для выбранных типов фильтра
   */
  public activeParams: ActiveParamsType = { types: [] };

  /**
   * Значение инпута От
   */
  public from: number | null = null;

  /**
   * Значение инпута До
   */
  public to: number | null = null;

  /**
   * Геттер для тайтла фильтра
   */
  public get title(): string {
    if (this.categoryWithTypes) {
      return this.categoryWithTypes.name;
    } else if (this.type) {
      if (this.type === 'height') {
        return 'Высота';
      } else if (this.type === 'diameter') {
        return 'Диаметр';
      }
    }

    return '';
  }

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.activeParams = ActiveParamsUtil.processParams(params);

      if (this.type) {
        if (this.type === 'height') {
          this.open = Boolean(this.activeParams.heightFrom || this.activeParams.heightTo);
          this.from = this.activeParams.heightFrom ? Number(this.activeParams.heightFrom) : null;
          this.to = this.activeParams.heightTo ? Number(this.activeParams.heightTo) : null;
        } else if (this.type === 'diameter') {
          this.open = Boolean(this.activeParams.diameterFrom || this.activeParams.diameterTo);
          this.from = this.activeParams.diameterFrom ? Number(this.activeParams.diameterFrom) : null;
          this.to = this.activeParams.diameterTo ? Number(this.activeParams.diameterTo) : null;
        }
      } else {
        if (params['types']) {
          this.activeParams.types = Array.isArray(params['types']) ? params['types'] : [params['types']];
        }

        if (this.categoryWithTypes && this.categoryWithTypes.types && this.categoryWithTypes.types.length > 0) {
          const condition = this.categoryWithTypes.types.some(type => this.activeParams.types.find(item => type.url === item));
          if (condition) {
            this.open = true;
          }
        }
      }
    })
  }

  /**
   * Обработка раскрытия фильтра
   */
  public toggle(): void {
    this.open = !this.open;
  }

  /**
   * Обработка массива activeParams при нажатии на чекбоксы фильтров
   * @param url урл данного типа фильтра
   * @param checked состояние чекбокса
   * @private
   */
  public updateFilterParam(url: string, checked: boolean) {
    if (this.activeParams.types && this.activeParams.types.length > 0) {
      const existingTypeInParams = this.activeParams.types.find(item => item === url);

      if (existingTypeInParams && !checked) {
        this.activeParams.types = this.activeParams.types.filter(item => item !== url);
      } else if (!existingTypeInParams && checked) {
        // this.activeParams.types.push(url);
        this.activeParams.types = [...this.activeParams.types, url]
      }
    } else if (checked) {
      this.activeParams.types = [url];
    }


    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams,
    });
  }

  /**
   * Обработка инпутов с высотой и диаметром
   * @param param тип инпута из четырёх
   * @param value введённое числовое значение
   */
  public updateFilterParamFromTo(param: string, value: string) {
    if (param === 'heightFrom' || param === 'heightTo' || param === 'diameterFrom' || param === 'diameterTo') {
      if (this.activeParams[param] && !value) {
        delete this.activeParams[param];
      } else {
        this.activeParams[param] = Number(value);
      }

      this.router.navigate(['/catalog'], {
        queryParams: this.activeParams,
      });
    }
  }
}
