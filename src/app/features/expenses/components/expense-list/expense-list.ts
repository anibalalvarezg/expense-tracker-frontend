import { Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ExpenseResponse } from '../../../../core/services/expense';
import { ExpenseGroup } from '../../expenses.types';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './expense-list.html'
})
export class ExpenseListComponent {
  groups = input.required<ExpenseGroup[]>();
  loading = input.required<boolean>();
  hasFilters = input.required<boolean>();

  editClicked = output<ExpenseResponse>();
  deleteClicked = output<number>();
}
