import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BudgetStatusResponse } from '../../../../core/services/budget';
import { RowComponent } from '../../../../shared/components/row/row';

@Component({
  selector: 'app-budget-status',
  standalone: true,
  imports: [DecimalPipe, RowComponent],
  templateUrl: './budget-status.html'
})
export class BudgetStatusComponent {
  status = input.required<BudgetStatusResponse>();

  Math = Math;
}
