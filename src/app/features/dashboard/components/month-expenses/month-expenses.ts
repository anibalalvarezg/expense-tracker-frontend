import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { CategorySummary } from '../../dashboard.types';
import { SectionComponent } from '../../../../shared/components/section/section';
import { CellComponent } from '../../../../shared/components/cell/cell';

@Component({
  selector: 'app-month-expenses',
  standalone: true,
  imports: [RouterLink, DecimalPipe, SectionComponent, CellComponent],
  templateUrl: './month-expenses.html'
})
export class MonthExpensesComponent {
  categorySummary = input.required<CategorySummary[]>();
  totalMonth = input.required<number>();
}
