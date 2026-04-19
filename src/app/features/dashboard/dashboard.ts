import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExpenseService, ExpenseResponse } from '../../core/services/expense';
import { BudgetService, BudgetStatusResponse } from '../../core/services/budget';
import { AuthService } from '../../core/services/auth';
import { BtnPrimaryDirective } from '../../shared/directives/btn-primary.directive';
import { BtnGhostDirective } from '../../shared/directives/btn-ghost.directive';
import { MonthExpensesComponent } from './components/month-expenses/month-expenses';
import { RecentMovementsComponent } from './components/recent-movements/recent-movements';
import { MonthSummaryComponent } from './components/month-summary/month-summary';
import { CategorySummary } from './dashboard.types';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, BtnPrimaryDirective, BtnGhostDirective, MonthExpensesComponent, RecentMovementsComponent, MonthSummaryComponent],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  private authService = inject(AuthService);
  private expenseService = inject(ExpenseService);
  private budgetService = inject(BudgetService);

  userName = signal(this.authService.getUserName());
  expenses = signal<ExpenseResponse[]>([]);
  budgetStatus = signal<BudgetStatusResponse | null>(null);
  loading = signal(true);

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1;

  private readonly MONTHS = [
    'enero','febrero','marzo','abril','mayo','junio',
    'julio','agosto','septiembre','octubre','noviembre','diciembre'
  ];

  totalMonth = computed(() => this.expenses().reduce((s, e) => s + e.amount, 0));

  monthLabel = computed(() => {
    const count = this.expenses().length;
    const now = new Date();
    const moves = count === 1 ? 'movimiento' : 'movimientos';
    return `${this.MONTHS[now.getMonth()]} ${now.getFullYear()} · ${count} ${moves}`;
  });

  categorySummary = computed<CategorySummary[]>(() => {
    const map = new Map<string, CategorySummary>();
    for (const e of this.expenses()) {
      if (!map.has(e.categoryName)) {
        map.set(e.categoryName, { name: e.categoryName, icon: e.categoryIcon, color: e.categoryColor, total: 0 });
      }
      map.get(e.categoryName)!.total += e.amount;
    }
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);

    this.expenseService.getByMonth(this.currentYear, this.currentMonth).subscribe({
      next: (data) => this.expenses.set(data),
      error: () => {}
    });

    this.budgetService.getStatus(this.currentYear, this.currentMonth).subscribe({
      next: (data) => {
        this.budgetStatus.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

}
