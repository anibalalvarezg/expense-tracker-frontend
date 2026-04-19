import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RowComponent } from '../../../../shared/components/row/row';

@Component({
  selector: 'app-expense-summary',
  standalone: true,
  imports: [DecimalPipe, RowComponent],
  templateUrl: './expense-summary.html'
})
export class ExpenseSummaryComponent {
  count = input.required<number>();
  total = input.required<number>();
  average = input.required<number>();
}
