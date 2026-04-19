import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-chip',
  standalone: true,
  template: `
    <button type="button" (click)="clicked.emit()"
      class="inline-flex items-center gap-1.5 text-xs rounded-full border px-3 py-1.5 transition-all"
      [class]="active() ? 'bg-ink text-white border-ink' : 'bg-white text-ink-soft border-line hover:border-slate-300'">
      @if (!active() && dotColor()) {
        <span class="w-1.5 h-1.5 rounded-full" [style.background]="dotColor()"></span>
      }
      <ng-content />
    </button>
  `,
})
export class ChipComponent {
  active = input(false);
  dotColor = input('');
  clicked = output<void>();
}
