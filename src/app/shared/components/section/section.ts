import { Component, input } from '@angular/core';

@Component({
  selector: 'app-section',
  standalone: true,
  template: `
    <section>
      <div class="flex items-center justify-between mb-3 px-1">
        <h2 class="text-xs font-medium text-mute uppercase tracking-wide">{{ label() }}</h2>
        <ng-content select="[action]" />
      </div>
      <ng-content />
    </section>
  `,
})
export class SectionComponent {
  label = input.required<string>();
}
