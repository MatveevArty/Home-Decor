import {Component, Input, OnInit} from '@angular/core';
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {Router} from "@angular/router";

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

  constructor(private router: Router) {

  }

  ngOnInit(): void {
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
        this.activeParams.types.push(url);
      }
    } else if (checked) {
      this.activeParams.types = [url];
    }


    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams,
    });
  }
}
