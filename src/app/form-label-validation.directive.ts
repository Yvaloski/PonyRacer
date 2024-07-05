import { AfterContentInit, ContentChild, Directive } from '@angular/core';
import { NgControl } from '@angular/forms';
import { startWith } from 'rxjs';
import { FormLabelDirective } from './form-label.directive';

@Directive({
  selector: '[prFormLabelValidation]',
  standalone: true
})
export class FormLabelValidationDirective implements AfterContentInit {
  @ContentChild(NgControl) ngControl!: NgControl;

  @ContentChild(FormLabelDirective) label!: FormLabelDirective;

  ngAfterContentInit(): void {
    if (this.ngControl && this.label) {
      this.ngControl
        .statusChanges!.pipe(startWith(undefined))
        .subscribe(() => this.label.setValidity(this.ngControl.invalid && this.ngControl.dirty));
    }
  }
}
