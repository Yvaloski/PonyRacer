import { Component } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { NgIf } from '@angular/common';
import { BirthYearInputComponent } from '../birth-year-input/birth-year-input.component';
import { FormControlValidationDirective } from '../form-control-validation.directive';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, BirthYearInputComponent, FormControlValidationDirective, NgbAlert],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registrationFailed = false;
  loginCtrl = this.fb.control('', [Validators.required, Validators.minLength(3)]);
  passwordCtrl = this.fb.control('', Validators.required);
  confirmPasswordCtrl = this.fb.control('', Validators.required);
  birthYearCtrl = this.fb.control<number | null>(null, [
    Validators.required,
    Validators.min(1900),
    Validators.max(new Date().getFullYear())
  ]);
  passwordGroup = this.fb.group(
    {
      password: this.passwordCtrl,
      confirmPassword: this.confirmPasswordCtrl
    },
    {
      validators: RegisterComponent.passwordMatch
    }
  );
  userForm = this.fb.group({
    login: this.loginCtrl,
    passwordForm: this.passwordGroup,
    birthYear: this.birthYearCtrl
  });

  constructor(
    private fb: NonNullableFormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  static passwordMatch(
    control: AbstractControl<{
      password: string;
      confirmPassword: string;
    }>
  ): ValidationErrors | null {
    const password = control.value.password;
    const confirmPassword = control.value.confirmPassword;
    return password !== confirmPassword ? { matchingError: true } : null;
  }

  register(): void {
    this.registrationFailed = false;
    const formValue = this.userForm.value;
    this.userService.register(formValue.login!, formValue.passwordForm!.password!, formValue.birthYear!).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: () => (this.registrationFailed = true)
    });
  }
}
