import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';
import { ExpenseService, ExpenseResponse, ExpenseSummaryResponse } from '../../core/services/expense';
import { BudgetService, BudgetStatusResponse } from '../../core/services/budget';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  private authService = inject(AuthService);
  private expenseService = inject(ExpenseService);
  private budgetService = inject(BudgetService);
  private router = inject(Router);
  Math = Math;

  userName = signal(this.authService.getUserName());
  expenses = signal<ExpenseResponse[]>([]);
  summary = signal<ExpenseSummaryResponse | null>(null);
  budgetStatus = signal<BudgetStatusResponse | null>(null);
  loading = signal(true);

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);

    // Cargar gastos del mes
    this.expenseService.getByMonth(this.currentYear, this.currentMonth)
      .subscribe({
        next: (data) => this.expenses.set(data),
        error: () => {}
      });

    // Cargar resumen
    this.expenseService.getSummary(this.currentYear, this.currentMonth)
      .subscribe({
        next: (data) => this.summary.set(data),
        error: () => {}
      });

    // Cargar estado del presupuesto
    this.budgetService.getStatus(this.currentYear, this.currentMonth)
      .subscribe({
        next: (data) => {
          this.budgetStatus.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getCategoryEntries() {
    const byCategory = this.summary()?.byCategory;
    if (!byCategory) return [];
    return Object.entries(byCategory);
  }
}
