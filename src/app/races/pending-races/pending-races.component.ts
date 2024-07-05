import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RaceComponent } from '../../race/race.component';
import { RaceModel } from '../../models/race.model';
import { RaceService } from '../../race.service';

@Component({
  standalone: true,
  imports: [RouterLink, RaceComponent],
  templateUrl: './pending-races.component.html',
  styleUrl: './pending-races.component.css'
})
export class PendingRacesComponent {
  races: Array<RaceModel> = [];

  constructor(private raceService: RaceService) {
    this.raceService.list('PENDING').subscribe(races => (this.races = races));
  }
}
