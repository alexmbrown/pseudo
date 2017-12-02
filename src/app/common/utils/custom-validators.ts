import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {

  public static regex(c: AbstractControl): ValidationErrors | null {
    try {
      const regex = new RegExp(c.value);
      return null;
    } catch (e) {
      return {regex: true};
    }
  }

}
