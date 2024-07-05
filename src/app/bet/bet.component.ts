import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { startWith, Subject, switchMap } from 'rxjs';
import { PonyComponent } from '../pony/pony.component';
import { RaceService } from '../race.service';
import { RaceModel } from '../models/race.model';
import { PonyModel } from '../models/pony.model';
import { FromNowPipe } from '../from-now.pipe';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  imports: [RouterLink, PonyComponent, FromNowPipe, NgbAlert],
  templateUrl: './bet.component.html',
  styleUrl: './bet.component.css'
})
export class BetComponent {
  raceModel: RaceModel | null = null;
  betFailed = false;
  private refreshSubject = new Subject<void>();

  constructor(
    private raceService: RaceService,
    private route: ActivatedRoute
  ) {
    const raceId = parseInt(this.route.snapshot.paramMap.get('raceId')!);
    this.refreshSubject
      .pipe(
        startWith(undefined),
        switchMap(() => this.raceService.get(raceId)),
        takeUntilDestroyed()
      )
      .subscribe(race => (this.raceModel = race));
  }

  betOnPony(pony: PonyModel): void {
    this.betFailed = false;
    const result$ = this.isPonySelected(pony)
      ? this.raceService.cancelBet(this.raceModel!.id)
      : this.raceService.bet(this.raceModel!.id, pony.id);
    result$.subscribe({
      next: () => this.refreshSubject.next(),
      error: () => (this.betFailed = true)
    });
  }

  isPonySelected(pony: PonyModel): boolean {
    return pony.id === this.raceModel!.betPonyId;
  }
}
