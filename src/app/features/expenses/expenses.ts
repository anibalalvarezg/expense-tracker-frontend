import { Component, inject, signal, OnInit, computed, viewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ExpenseService, ExpenseResponse, ExpenseRequest } from '../../core/services/expense';
import { CategoryService, Category } from '../../core/services/category';
import { BtnPrimaryDirective } from '../../shared/directives/btn-primary.directive';
import { BtnGhostDirective } from '../../shared/directives/btn-ghost.directive';
import { ChipComponent } from '../../shared/components/chip/chip';
import { ExpenseFormComponent } from './components/expense-form/expense-form';
import { DateRangeFilterComponent } from './components/date-range-filter/date-range-filter';
import { ExpenseListComponent } from './components/expense-list/expense-list';
import { ExpenseSummaryComponent } from './components/expense-summary/expense-summary';
import { ExpenseGroup } from './expenses.types';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [
    DecimalPipe, BtnPrimaryDirective, BtnGhostDirective, ChipComponent,
    ExpenseFormComponent, DateRangeFilterComponent,
    ExpenseListComponent, ExpenseSummaryComponent
  ],
  templateUrl: './expenses.html'
})
export class Expenses implements OnInit {
  private expenseService = inject(ExpenseService);
  private categoryService = inject(CategoryService);

  private expenseForm = viewChild(ExpenseFormComponent);

  expenses = signal<ExpenseResponse[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(true);
  showForm = signal(false);
  editingExpense = signal<ExpenseResponse | null>(null);

  filterCategoryId = signal(0);
  filterFrom = signal('');
  filterTo = signal('');

  exporting = signal(false);

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1;

  private readonly MONTHS = [
    'enero','febrero','marzo','abril','mayo','junio',
    'julio','agosto','septiembre','octubre','noviembre','diciembre'
  ];

  filteredExpenses = computed(() => {
    const catId = this.filterCategoryId();
    const cat = catId ? this.categories().find(c => c.id === catId) : null;
    return this.expenses().filter(e => {
      if (cat && e.categoryName !== cat.name) return false;
      if (this.filterFrom() && e.date < this.filterFrom()) return false;
      if (this.filterTo() && e.date > this.filterTo()) return false;
      return true;
    });
  });

  expenseGroups = computed<ExpenseGroup[]>(() => {
    const sorted = [...this.filteredExpenses()].sort((a, b) => b.date.localeCompare(a.date));
    const map = new Map<string, ExpenseResponse[]>();
    for (const e of sorted) {
      if (!map.has(e.date)) map.set(e.date, []);
      map.get(e.date)!.push(e);
    }
    return Array.from(map.entries()).map(([date, items]) => ({
      date,
      label: this.formatDay(date),
      total: items.reduce((s, e) => s + e.amount, 0),
      items
    }));
  });

  filteredTotal = computed(() => this.filteredExpenses().reduce((s, e) => s + e.amount, 0));
  filteredAverage = computed(() => {
    const count = this.filteredExpenses().length;
    return count ? this.filteredTotal() / count : 0;
  });
  hasFilters = computed(() => this.filterCategoryId() !== 0 || this.filterFrom() !== '' || this.filterTo() !== '');

  ngOnInit() {
    this.initMtdFilter();
    this.loadExpenses();
    this.loadCategories();
  }

  private initMtdFilter() {
    const today = new Date();
    const fmt = (d: Date) => d.toISOString().split('T')[0];
    const first = new Date(today.getFullYear(), today.getMonth(), 1);
    this.filterFrom.set(fmt(first));
    this.filterTo.set(fmt(today));
  }

  loadExpenses() {
    this.loading.set(true);
    this.expenseService.getByMonth(this.currentYear, this.currentMonth).subscribe({
      next: (data) => {
        this.expenses.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (data) => this.categories.set(data)
    });
  }

  openForm() {
    this.editingExpense.set(null);
    this.showForm.set(true);
  }

  editExpense(expense: ExpenseResponse) {
    this.editingExpense.set(expense);
    this.showForm.set(true);
  }

  saveExpense(request: ExpenseRequest) {
    const editing = this.editingExpense();
    const operation = editing
      ? this.expenseService.update(editing.id, request)
      : this.expenseService.create(request);

    operation.subscribe({
      next: () => {
        this.showForm.set(false);
        this.editingExpense.set(null);
        this.loadExpenses();
      },
      error: (err: any) => {
        this.expenseForm()?.setError(err.error?.message || 'Error al guardar');
      }
    });
  }

  deleteExpense(id: number) {
    if (!confirm('¿Eliminar este gasto?')) return;
    this.expenseService.delete(id).subscribe({
      next: () => this.loadExpenses()
    });
  }

  closeForm() {
    this.showForm.set(false);
    this.editingExpense.set(null);
  }

  clearFilters() {
    this.filterCategoryId.set(0);
    this.filterFrom.set('');
    this.filterTo.set('');
  }

  exportExcel() {
    const pad = (n: number) => String(n).padStart(2, '0');
    const startDate = this.filterFrom() ||
      `${this.currentYear}-${pad(this.currentMonth)}-01`;
    const lastDay = new Date(this.currentYear, this.currentMonth, 0).getDate();
    const endDate = this.filterTo() ||
      `${this.currentYear}-${pad(this.currentMonth)}-${lastDay}`;

    this.exporting.set(true);
    this.expenseService.export(startDate, endDate).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gastos_${startDate}_${endDate}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
        this.exporting.set(false);
      },
      error: () => this.exporting.set(false)
    });
  }

  private formatDay(dateStr: string): string {
    const [, m, d] = dateStr.split('-').map(Number);
    return `${d} ${this.MONTHS[m - 1]}`;
  }
}
