import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-cell',
  standalone: true,
  template: `<div [class]="cls()"><ng-content /></div>`,
})
export class CellComponent {
  clickable = input(false);
  cls = computed(() =>
    'bg-white border border-line rounded-xl px-5 py-4' +
    (this.clickable() ? ' hover:border-slate-300 transition-colors cursor-pointer' : '')
  );
}
