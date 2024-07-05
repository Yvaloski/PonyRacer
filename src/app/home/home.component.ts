import { Component, signal, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserModel } from '../models/user.model';
import { UserService } from '../user.service';
import {NgIf, NgStyle} from '@angular/common';

@Component({
  selector: 'pr-home',
  standalone: true,
  imports: [RouterLink, NgIf, NgStyle],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  user: Signal<UserModel | null> = signal(null);

  constructor(userService: UserService) {
    this.user = userService.currentUser;
  }
}
