import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService, ExpenseResponse, ExpenseRequest } from '../../core/services/expense';
import { CategoryService, Category } from '../../core/services/category';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
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

  // Formulario
  amount = signal(0);
  categoryId = signal(0);
  description = signal('');
  date = signal(new Date().toISOString().split('T')[0]);

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1;

  ngOnInit() {
    this.loadExpenses();
    this.loadCategories();
  }

  loadExpenses() {
    this.loading.set(true);
    this.expenseService.getByMonth(this.currentYear, this.currentMonth)
      .subscribe({
        next: (data) => {
          this.expenses.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  loadCategories() {
    this.categoryService.getAll()
      .subscribe({
        next: (data) => this.categories.set(data)
      });
  }

  openForm() {
    this.editingId.set(null);
    this.amount.set(0);
    this.categoryId.set(0);
    this.description.set('');
    this.date.set(new Date().toISOString().split('T')[0]);
    this.showForm.set(true);
  }

  editExpense(expense: ExpenseResponse) {
    this.editingId.set(expense.id);
    this.amount.set(expense.amount);
    this.description.set(expense.description || '');
    this.date.set(expense.date);
    // buscar el id de la categoría
    const cat = this.categories().find(c => c.name === expense.categoryName);
    this.categoryId.set(cat?.id || 0);
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
}
