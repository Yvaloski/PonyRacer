import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, takeWhile } from 'rxjs';
import { environment } from '../environments/environment';
import { WsService } from './ws.service';
import { LiveRaceModel, RaceModel } from './models/race.model';
import { PonyWithPositionModel } from './models/pony.model';

@Injectable({ providedIn: 'root' })
export class RaceService {
  constructor(
    private http: HttpClient,
    private wsService: WsService
  ) {}

  list(status: 'PENDING' | 'RUNNING' | 'FINISHED'): Observable<Array<RaceModel>> {
    const params = { status };
    return this.http.get<Array<RaceModel>>(`${environment.baseUrl}/api/races`, { params });
  }

  get(raceId: number): Observable<RaceModel> {
    return this.http.get<RaceModel>(`${environment.baseUrl}/api/races/${raceId}`);
  }

  bet(raceId: number, ponyId: number): Observable<void> {
    return this.http.post<void>(`${environment.baseUrl}/api/races/${raceId}/bets`, { ponyId });
  }

  cancelBet(raceId: number): Observable<void> {
    return this.http.delete<void>(`${environment.baseUrl}/api/races/${raceId}/bets`);
  }

  live(raceId: number): Observable<Array<PonyWithPositionModel>> {
    return this.wsService.connect<LiveRaceModel>(`/race/${raceId}`).pipe(
      takeWhile(liveRace => liveRace.status !== 'FINISHED'),
      map(liveRace => liveRace.ponies)
    );
  }

  boost(raceId: number, ponyId: number): Observable<void> {
    return this.http.post<void>(`${environment.baseUrl}/api/races/${raceId}/boosts`, { ponyId });
  }
}
