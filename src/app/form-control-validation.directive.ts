import { Directive } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '.form-contol',
  standalone: true
})
export class FormControlValidationDirective {
  constructor(private ngControl: NgControl) {}
}
