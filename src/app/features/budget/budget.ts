import { Component, inject, signal, OnInit } from '@angular/core';
import { BudgetService, BudgetStatusResponse } from '../../core/services/budget';
import { BudgetFormComponent } from './components/budget-form/budget-form';
import { BudgetStatusComponent } from './components/budget-status/budget-status';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [BudgetFormComponent, BudgetStatusComponent],
  templateUrl: './budget.html'
})
export class Budget implements OnInit {
  private budgetService = inject(BudgetService);

  status = signal<BudgetStatusResponse | null>(null);
  loading = signal(true);
  saving = signal(false);
  success = signal('');
  error = signal('');
  budgetAmount = signal(0);

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1;
  monthName = new Date().toLocaleString('es-CL', { month: 'long', year: 'numeric' });

  ngOnInit() {
    this.loadStatus();
  }

  loadStatus() {
    this.loading.set(true);
    this.budgetService.getStatus(this.currentYear, this.currentMonth).subscribe({
      next: (data) => {
        this.status.set(data);
        this.budgetAmount.set(data.budget);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  saveBudget(amount: number) {
    this.saving.set(true);
    this.error.set('');
    this.success.set('');

    this.budgetService.save({
      amount,
      month: this.currentMonth,
      year: this.currentYear
    }).subscribe({
      next: () => {
        this.success.set('Presupuesto guardado correctamente');
        this.saving.set(false);
        this.loadStatus();
      },
      error: (err: any) => {
        this.error.set(err.error?.message || 'Error al guardar');
        this.saving.set(false);
      }
    });
  }
}
