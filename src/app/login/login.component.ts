import { Component } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import {AlertComponent} from "../alert/alert.component";

@Component({
  selector: 'pr-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, AlertComponent],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = this.fb.group({
    login: ['', Validators.required],
    password: ['', Validators.required]
  });
  authenticationFailed = false;

  constructor(
    private fb: NonNullableFormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  authenticate(): void {
    this.authenticationFailed = false;
    const { login, password } = this.credentials.value;
    this.userService.authenticate(login!, password!).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: () => (this.authenticationFailed = true)
    });
  }
}
