import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PonyModel } from '../models/pony.model';

@Component({
  selector: 'pr-pony',
  standalone: true,
  templateUrl: './pony.component.html',
  styleUrl: './pony.component.css'
})
export class PonyComponent {
  @Input({ required: true }) ponyModel!: PonyModel;
  @Input() isRunning = false;
  @Output() readonly ponyClicked = new EventEmitter<PonyModel>();
  @Input() isBoosted: boolean = false;

  getPonyImageUrl(): string {
    return `images/pony-${this.ponyModel.color.toLowerCase()}${this.isBoosted ? '-rainbow' : this.isRunning ? '-running' : ''}.gif`;
  }
  clicked(): void {
    this.ponyClicked.emit(this.ponyModel);
  }
}
