import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {


  public isShown$ = new Subject<boolean>();

  constructor() { }


  public show(): void {
    this.isShown$.next(true);
  }


  public hide(): void {
    this.isShown$.next(false);
  }
}
