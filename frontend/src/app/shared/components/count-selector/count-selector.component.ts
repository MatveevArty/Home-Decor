import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-count-selector',
  templateUrl: './count-selector.component.html',
  styleUrls: ['./count-selector.component.scss']
})
export class CountSelectorComponent implements OnInit {

  /**
   * Значение счётчика количества товара
   */
  @Input() public count: number = 1;

  @Output() onCountChange: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Эмиттинг значения количества товара род компонентам
   */
  public countChange(): void {
    this.onCountChange.emit(this.count);
  }

  /**
   * Уменьшение количества товара в счётчике на 1
   */
  public decreaseCount(): void {
    if (this.count > 1) {
      this.count--;
      this.countChange();
    }
  }

  /**
   * Увеличение количества товара в счётчике на 1
   */
  public increaseCount(): void {
    this.count++;
    this.countChange();
  }
}
