import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest, map } from 'rxjs';
import { RaceModel } from '../../models/race.model';
import { RaceComponent } from '../../race/race.component';
import { RaceService } from '../../race.service';

/**
 * The data needed by the view
 */
interface ViewModel {
  /**
   * The current page number starting at 1
   */
  page: number;

  /**
   * The total number of races
   */
  total: number;

  /**
   * The races to display for the current page
   */
  races: Array<RaceModel>;
}

@Component({
  standalone: true,
  imports: [NgbPagination, RaceComponent],
  templateUrl: './finished-races.component.html',
  styleUrl: './finished-races.component.css'
})
export class FinishedRacesComponent {
  vm: ViewModel | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    raceService: RaceService
  ) {
    const allRaces$ = raceService.list('FINISHED');
    const page$ = route.queryParamMap.pipe(map(paramMap => parseInt(paramMap.get('page') ?? '1')));

    combineLatest([allRaces$, page$])
      .pipe(
        map(([allRaces, page]) => ({
          total: allRaces.length,
          page,
          races: allRaces.slice((page - 1) * 10, page * 10)
        }))
      )
      .subscribe(vm => (this.vm = vm));
  }

  changePage(page: number) {
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { page } });
  }
}
