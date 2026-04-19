import { Component, input } from '@angular/core';

@Component({
  selector: 'app-field',
  standalone: true,
  template: `
    <div>
      <label class="block text-xs font-medium text-mute mb-1.5">{{ label() }}</label>
      <ng-content />
    </div>
  `,
})
export class FieldComponent {
  label = input.required<string>();
}
