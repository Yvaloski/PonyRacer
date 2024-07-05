import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { FormControlValidationDirective } from '../form-control-validation.directive';

@Component({
  selector: 'pr-birth-year-input',
  standalone: true,
  templateUrl: './birth-year-input.component.html',
  styleUrl: './birth-year-input.component.css',
  imports: [FormControlValidationDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BirthYearInputComponent),
      multi: true
    },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => BirthYearInputComponent), multi: true }
  ]
})
export class BirthYearInputComponent implements ControlValueAccessor, Validator {
  @Input({ required: true }) inputId!: string;
  value: number | null = null;
  year: number | null = null;
  onChange: (value: number | null) => void = () => {};
  onTouched: () => void = () => {};
  disabled = false;

  writeValue(value: number | null): void {
    this.value = value;
    this.year = this.computeYear(value);
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onBirthYearChange(event: Event) {
    const value = (<HTMLInputElement>event.target).valueAsNumber;
    if (isNaN(value)) {
      this.year = null;
      this.onChange(null);
    } else {
      this.year = this.computeYear(value);
      this.onChange(this.year);
    }
  }

  private computeYear(value: number | null): number | null {
    const lastTwoDigitsOfTheCurrentYear = new Date().getFullYear() % 100;
    const firstTwoDigitsOfTheCurrentYear = Math.floor(new Date().getFullYear() / 100);

    if (value === null) {
      return null;
    } else if (value < 0 || value > 100) {
      return value;
    } else if (value > lastTwoDigitsOfTheCurrentYear) {
      return (firstTwoDigitsOfTheCurrentYear - 1) * 100 + value;
    } else {
      return firstTwoDigitsOfTheCurrentYear * 100 + value;
    }
  }

  validate(): ValidationErrors | null {
    if (this.year === null) {
      return null;
    } else if (this.year < 1900 || this.year > new Date().getFullYear()) {
      return { invalidYear: true };
    }
    return null;
  }
}
