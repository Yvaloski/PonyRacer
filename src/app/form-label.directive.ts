import { Directive } from '@angular/core';

@Directive({
  selector: 'label[prFormLabel]',
  standalone: true,
  host: {
    '[class.text-danger]': 'isInvalid'
  }
})
export class FormLabelDirective {
  isInvalid: boolean | null = false;

  setValidity(validity: boolean | null) {
    this.isInvalid = validity;
  }
}
