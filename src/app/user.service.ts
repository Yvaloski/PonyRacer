import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { effect, Injectable, signal } from '@angular/core';
import { UserModel } from './models/user.model';
import { environment } from '../environments/environment';
import { WsService } from './ws.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.baseUrl;
  private readonly _currentUser = signal<UserModel | null>(null);
  readonly currentUser = this._currentUser.asReadonly();

  constructor(
    private http: HttpClient,
    private wsService: WsService
  ) {
    this.retrieveUser();
    effect(() => {
      const user = this._currentUser();
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    });
  }

  storeLoggedInUser(user: UserModel) {
    const userString = JSON.stringify(user);
    window.localStorage.setItem('rememberMe', userString);
    this._currentUser.set(user);
  }

  retrieveUser(): void {
    const userString = window.localStorage.getItem('rememberMe');
    if (userString) {
      const user = JSON.parse(userString) as UserModel;
      this._currentUser.set(user);
    }
  }

  authenticate(login: string, password: string): Observable<UserModel> {
    const url = `${this.apiUrl}/api/users/authentication`;
    const body = { login, password };
    return this.http.post<UserModel>(url, body).pipe(
      tap((user: UserModel) => {
        this.storeLoggedInUser(user);
      })
    );
  }

  register(login: string, password: string, birthYear: number): Observable<UserModel> {
    const body = { login, password, birthYear };
    return this.http.post<UserModel>(`${this.apiUrl}/api/users`, body);
  }

  logout() {
    this._currentUser.set(null);
    localStorage.removeItem('rememberMe');
  }

  scoreUpdates(userId: number): Observable<UserModel> {
    return this.wsService.connect<UserModel>(`/player/${userId}`);
  }
}
