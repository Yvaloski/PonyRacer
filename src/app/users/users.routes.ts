import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { Routes } from '@angular/router';
import { MoneyHistoryComponent } from '../money-history/money-history.component';

export const usersRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'register',
    component: RegisterComponent
  },
  { path: 'money/history', component: MoneyHistoryComponent }
];
