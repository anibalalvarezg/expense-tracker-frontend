import { Directive } from '@angular/core';

@Directive({
  selector: 'input[appInput], select[appInput], textarea[appInput]',
  standalone: true,
  host: {
    'class': 'w-full bg-white border border-line rounded-lg px-4 py-2.5 text-sm text-ink placeholder:text-mute-soft focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition'
  }
})
export class InputDirective {}
