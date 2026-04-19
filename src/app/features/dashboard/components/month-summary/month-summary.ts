import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { BudgetStatusResponse } from '../../../../core/services/budget';
import { CategorySummary } from '../../dashboard.types';
import { RowComponent } from '../../../../shared/components/row/row';

@Component({
  selector: 'app-month-summary',
  standalone: true,
  imports: [RouterLink, DecimalPipe, RowComponent],
  templateUrl: './month-summary.html'
})
export class MonthSummaryComponent {
  totalMonth = input.required<number>();
  budgetStatus = input.required<BudgetStatusResponse | null>();
  categorySummary = input.required<CategorySummary[]>();
  Math = Math;
}
