import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService, ExpenseResponse, ExpenseRequest } from '../../core/services/expense';
import { CategoryService, Category } from '../../core/services/category';
import { HeaderComponent } from '../../shared/components/header/header';
import { BtnPrimaryDirective } from '../../shared/directives/btn-primary.directive';
import { BtnGhostDirective } from '../../shared/directives/btn-ghost.directive';
import { InputDirective } from '../../shared/directives/input.directive';
import { FieldComponent } from '../../shared/components/field/field';
import { ChipComponent } from '../../shared/components/chip/chip';
import { RowComponent } from '../../shared/components/row/row';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, BtnPrimaryDirective, BtnGhostDirective, InputDirective, FieldComponent, ChipComponent, RowComponent],
  templateUrl: './expenses.html'
})
export class Expenses implements OnInit {
  private expenseService = inject(ExpenseService);
  private categoryService = inject(CategoryService);

  expenses = signal<ExpenseResponse[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(true);
  showForm = signal(false);
  editingId = signal<number | null>(null);
  error = signal('');

  // Form fields
  amount = signal(0);
  categoryId = signal(0);
  description = signal('');
  date = signal(new Date().toISOString().split('T')[0]);

  // Filters
  filterCategoryId = signal(0);
  filterFrom = signal('');
  filterTo = signal('');

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

  expenseGroups = computed(() => {
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
  hasFilters = computed(() => this.filterCategoryId() !== 0 || this.filterFrom() !== '' || this.filterTo() !== '');

  ngOnInit() {
    this.loadExpenses();
    this.loadCategories();
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
    this.editingId.set(null);
    this.amount.set(0);
    this.categoryId.set(0);
    this.description.set('');
    this.date.set(new Date().toISOString().split('T')[0]);
    this.error.set('');
    this.showForm.set(true);
  }

  editExpense(expense: ExpenseResponse) {
    this.editingId.set(expense.id);
    this.amount.set(expense.amount);
    this.description.set(expense.description || '');
    this.date.set(expense.date);
    const cat = this.categories().find(c => c.name === expense.categoryName);
    this.categoryId.set(cat?.id || 0);
    this.error.set('');
    this.showForm.set(true);
  }

  saveExpense() {
    this.error.set('');
    const request: ExpenseRequest = {
      amount: this.amount(),
      categoryId: this.categoryId(),
      description: this.description(),
      date: this.date()
    };

    const operation = this.editingId()
      ? this.expenseService.update(this.editingId()!, request)
      : this.expenseService.create(request);

    operation.subscribe({
      next: () => {
        this.showForm.set(false);
        this.loadExpenses();
      },
      error: (err: any) => this.error.set(err.error?.message || 'Error al guardar')
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
    this.error.set('');
  }

  clearFilters() {
    this.filterCategoryId.set(0);
    this.filterFrom.set('');
    this.filterTo.set('');
  }

  formatDay(dateStr: string): string {
    const [, m, d] = dateStr.split('-').map(Number);
    return `${d} ${this.MONTHS[m - 1]}`;
  }
}
