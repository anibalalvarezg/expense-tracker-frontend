import { Directive } from '@angular/core';

@Directive({
  selector: '[appBtnGhost]',
  standalone: true,
  host: {
    'class': 'inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-line text-ink text-sm font-medium rounded-full px-5 py-2 transition-all duration-200 active:scale-[0.98]'
  }
})
export class BtnGhostDirective {}
