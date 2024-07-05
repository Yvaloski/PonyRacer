import { Component } from '@angular/core';
import { RaceComponent } from '../../race/race.component';
import { RaceModel } from '../../models/race.model';
import { RaceService } from '../../race.service';

@Component({
  standalone: true,
  imports: [RaceComponent],
  templateUrl: './finished-races.component.html',
  styleUrl: './finished-races.component.css'
})
export class FinishedRacesComponent {
  races: Array<RaceModel> = [];

  constructor(private raceService: RaceService) {
    this.raceService.list('FINISHED').subscribe(races => (this.races = races));
  }
}
