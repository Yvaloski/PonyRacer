import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { bufferToggle, catchError, EMPTY, filter, groupBy, interval, mergeMap, Subject, switchMap, tap, throttleTime } from 'rxjs';
import { RaceService } from '../race.service';
import { RaceModel } from '../models/race.model';
import { PonyWithPositionModel } from '../models/pony.model';
import { PonyComponent } from '../pony/pony.component';
import { FromNowPipe } from '../from-now.pipe';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  imports: [PonyComponent, FromNowPipe, NgbAlert],
  templateUrl: './live.component.html',
  styleUrl: './live.component.css'
})
export class LiveComponent {
  raceModel: RaceModel | null = null;
  poniesWithPosition: Array<PonyWithPositionModel> = [];
  clickSubject = new Subject<PonyWithPositionModel>();

  error = false;
  winners: Array<PonyWithPositionModel> = [];
  betWon: boolean | null = null;

  constructor(
    private raceService: RaceService,
    private route: ActivatedRoute
  ) {
    const id = parseInt(this.route.snapshot.paramMap.get('raceId')!);
    this.raceService
      .get(id)
      .pipe(
        tap((race: RaceModel) => (this.raceModel = race)),
        filter(race => race.status !== 'FINISHED'),
        switchMap(race => this.raceService.live(race.id)),
        takeUntilDestroyed()
      )
      .subscribe({
        next: positions => {
          this.poniesWithPosition = positions;
          this.raceModel!.status = 'RUNNING';
        },
        error: () => (this.error = true),
        complete: () => {
          this.raceModel!.status = 'FINISHED';
          this.winners = this.poniesWithPosition.filter(pony => pony.position >= 100);
          this.betWon = this.winners.some(pony => pony.id === this.raceModel!.betPonyId);
        }
      });
    this.clickSubject
      .pipe(
        groupBy(pony => pony.id, { element: pony => pony }),
        mergeMap(obs => obs.pipe(bufferToggle(obs, () => interval(1000)))),
        filter(clicks => clicks.length >= 5),
        throttleTime(1000),
        switchMap(clicks => this.raceService.boost(this.raceModel!.id, clicks[0].id).pipe(catchError(() => EMPTY)))
      )
      .subscribe(() => {});
  }

  onClick(pony: PonyWithPositionModel): void {
    this.clickSubject.next(pony);
  }
}
