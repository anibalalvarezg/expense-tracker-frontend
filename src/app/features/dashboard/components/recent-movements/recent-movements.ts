import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ExpenseResponse } from '../../../../core/services/expense';
import { SectionComponent } from '../../../../shared/components/section/section';

@Component({
  selector: 'app-recent-movements',
  standalone: true,
  imports: [RouterLink, DecimalPipe, SectionComponent],
  templateUrl: './recent-movements.html'
})
export class RecentMovementsComponent {
  expenses = input.required<ExpenseResponse[]>();
}
