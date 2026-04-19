import { Directive } from '@angular/core';

@Directive({
  selector: '[appBtnPrimary]',
  standalone: true,
  host: {
    'class': 'inline-flex items-center gap-2 bg-brand hover:bg-blue-700 text-white text-sm font-medium rounded-full px-5 py-2 transition-all duration-200 active:scale-[0.98]'
  }
})
export class BtnPrimaryDirective {}
