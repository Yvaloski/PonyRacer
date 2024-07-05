import {booleanAttribute, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'pr-alert',
  standalone: true,
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {
  @Input() type: 'success' | 'danger' | 'warning' = 'warning';
  @Input({ transform: booleanAttribute }) dismissible = true;
  @Output() closed = new EventEmitter<void>();

  get alertClasses(): string {
    let classes = 'alert alert-' + this.type;
    if (this.dismissible) {
      classes += ' alert-dismissible';
    }
    return classes;
  }

  closeHandler(): void {
    this.closed.emit();
  }
}
