import { Component, signal, Signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserModel } from '../models/user.model';
import { UserService } from '../user.service';
import { DecimalPipe, NgIf } from '@angular/common';
import { concat, of, switchMap, catchError, EMPTY } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'pr-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  imports: [RouterLink, DecimalPipe, NgIf],
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  navbarCollapsed = true;
  user: Signal<UserModel | null> = signal(null);

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    const user$ = toObservable(this.userService.currentUser).pipe(
      switchMap(user => (user ? concat(of(user), this.userService.scoreUpdates(user.id).pipe(catchError(() => EMPTY))) : of(null)))
    );
    this.user = toSignal(user$, { initialValue: null });
  }

  logout() {
    this.userService.logout();
    this.router.navigateByUrl('/');
  }

  toggleNavbar(): void {
    this.navbarCollapsed = !this.navbarCollapsed;
  }
}
