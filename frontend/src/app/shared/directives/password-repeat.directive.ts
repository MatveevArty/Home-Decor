import { Directive } from '@angular/core';
import {AbstractControl, FormControl, NG_VALIDATORS, ValidationErrors, Validator} from "@angular/forms";

@Directive({
  selector: '[appPasswordRepeat]',
  providers: [
    {provide: NG_VALIDATORS,
    useExisting: PasswordRepeatDirective,
    multi: true}
  ]
})
export class PasswordRepeatDirective implements Validator {

  /**
   * Валидация полей Пароль и Повторение пароля
   * @param control Контрол формы
   */
  public validate(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const passwordRepeat = control.get('passwordRepeat');

    if (password?.value !== passwordRepeat?.value) {
      passwordRepeat?.setErrors({passwordRepeat: true});
      return {passwordRepeat: true};
    }
    return null;
  }
}
