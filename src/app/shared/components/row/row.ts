import { Component, input } from '@angular/core';

@Component({
  selector: 'app-row',
  standalone: true,
  template: `
    <div class="flex items-center justify-between">
      <span class="text-sm text-ink-soft">{{ label() }}</span>
      <span class="text-sm font-medium money" [class]="valueClass()">{{ value() }}</span>
    </div>
  `,
})
export class RowComponent {
  label = input.required<string>();
  value = input.required<string>();
  valueClass = input('text-ink');
}
