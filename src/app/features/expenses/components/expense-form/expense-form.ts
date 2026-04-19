import { Component, input, output, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../../core/services/category';
import { ExpenseResponse, ExpenseRequest } from '../../../../core/services/expense';
import { FieldComponent } from '../../../../shared/components/field/field';
import { BtnPrimaryDirective } from '../../../../shared/directives/btn-primary.directive';
import { BtnGhostDirective } from '../../../../shared/directives/btn-ghost.directive';
import { InputDirective } from '../../../../shared/directives/input.directive';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [FormsModule, FieldComponent, BtnPrimaryDirective, BtnGhostDirective, InputDirective],
  templateUrl: './expense-form.html'
})
export class ExpenseFormComponent {
  categories = input.required<Category[]>();
  editingExpense = input<ExpenseResponse | null>(null);

  saved = output<ExpenseRequest>();
  cancelled = output<void>();

  amount = signal(0);
  categoryId = signal(0);
  description = signal('');
  date = signal(new Date().toISOString().split('T')[0]);
  error = signal('');

  constructor() {
    effect(() => {
      const expense = this.editingExpense();
      const cats = this.categories();
      if (expense) {
        this.amount.set(expense.amount);
        this.description.set(expense.description || '');
        this.date.set(expense.date);
        const cat = cats.find(c => c.name === expense.categoryName);
        this.categoryId.set(cat?.id || 0);
      } else {
        this.amount.set(0);
        this.categoryId.set(0);
        this.description.set('');
        this.date.set(new Date().toISOString().split('T')[0]);
      }
      this.error.set('');
    });
  }

  setError(msg: string) {
    this.error.set(msg);
  }

  submit() {
    this.error.set('');
    this.saved.emit({
      amount: this.amount(),
      categoryId: this.categoryId(),
      description: this.description(),
      date: this.date()
    });
  }
}
