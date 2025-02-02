import { Component, Input } from '@angular/core';
import { RaceModel } from '../models/race.model';
import { PonyComponent } from '../pony/pony.component';
import { DatePipe } from '@angular/common';
import { FromNowPipe } from '../from-now.pipe';

@Component({
  selector: 'pr-race',
  standalone: true,
  templateUrl: './race.component.html',
  imports: [PonyComponent, DatePipe, FromNowPipe],
  styleUrl: './race.component.css'
})
export class RaceComponent {
  @Input({ required: true }) raceModel!: RaceModel;
}
