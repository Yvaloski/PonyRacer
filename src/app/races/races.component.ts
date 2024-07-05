import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { RaceModel } from '../models/race.model';
import { RaceComponent } from '../race/race.component';
import { AsyncPipe, NgForOf } from '@angular/common';

@Component({
  selector: 'pr-races',
  standalone: true,
  imports: [RouterLink, RaceComponent, NgForOf, AsyncPipe, RouterLinkActive, RouterOutlet],
  templateUrl: './races.component.html',
  styleUrl: './races.component.css'
})
export class RacesComponent {
  races: Array<RaceModel> = [];

  constructor() {}
}
