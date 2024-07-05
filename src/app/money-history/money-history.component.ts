import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, Filler, Legend, LinearScale, LineController, LineElement, PointElement, TimeScale, Tooltip } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { UserService } from '../user.service';

Chart.register(LineController, LinearScale, TimeScale, PointElement, LineElement, Legend, Filler, Tooltip);

@Component({
  standalone: true,
  templateUrl: './money-history.component.html',
  styleUrl: './money-history.component.css'
})
export class MoneyHistoryComponent implements AfterViewInit {
  @ViewChild('chart') canvas!: ElementRef<HTMLCanvasElement>;

  moneyChart: Chart | null = null;

  constructor(private userService: UserService) {}

  ngAfterViewInit(): void {
    const ctx = this.canvas.nativeElement;
    this.userService.getMoneyHistory().subscribe(history => {
      this.moneyChart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'Money history',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              fill: 'origin',
              tension: 0.5,
              data: history.map(event => event.money)
            }
          ],
          labels: history.map(event => event.instant)
        },
        options: {
          scales: {
            x: {
              type: 'time'
            }
          }
        }
      });
    });
  }
}
