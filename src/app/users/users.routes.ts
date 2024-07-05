import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { Routes } from '@angular/router';

export const usersRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'register',
    component: RegisterComponent
  }
];
