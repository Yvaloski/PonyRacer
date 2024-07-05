import { effect, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { UserModel } from './models/user.model';
import { WsService } from './ws.service';
import { MoneyHistoryModel } from './models/MoneyHistory.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private user = signal<UserModel | null>(null);
  readonly currentUser = this.user.asReadonly();

  constructor(
    private http: HttpClient,
    private wsService: WsService
  ) {
    this.retrieveUser();
    effect(() => {
      // every time the user signal changes, we store it in local storage
      if (this.user()) {
        window.localStorage.setItem('rememberMe', JSON.stringify(this.user()));
      } else {
        window.localStorage.removeItem('rememberMe');
      }
    });
  }

  register(login: string, password: string, birthYear: number): Observable<UserModel> {
    const body = { login, password, birthYear };
    return this.http.post<UserModel>(`${environment.baseUrl}/api/users`, body);
  }

  authenticate(login: string, password: string): Observable<UserModel> {
    return this.http
      .post<UserModel>(`${environment.baseUrl}/api/users/authentication`, { login, password })
      .pipe(tap(user => this.user.set(user)));
  }

  retrieveUser(): void {
    const value = window.localStorage.getItem('rememberMe');
    if (value) {
      const user = JSON.parse(value) as UserModel;
      this.user.set(user);
    }
  }

  logout(): void {
    this.user.set(null);
  }

  scoreUpdates(userId: number): Observable<UserModel> {
    return this.wsService.connect<UserModel>(`/player/${userId}`);
  }

  getMoneyHistory(): Observable<Array<MoneyHistoryModel>> {
    return this.http.get<Array<MoneyHistoryModel>>(`${environment.baseUrl}/api/money/history`);
  }
}
