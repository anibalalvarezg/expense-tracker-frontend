import { Component, input, output, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FieldComponent } from '../../../../shared/components/field/field';
import { BtnPrimaryDirective } from '../../../../shared/directives/btn-primary.directive';
import { InputDirective } from '../../../../shared/directives/input.directive';

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [FormsModule, FieldComponent, BtnPrimaryDirective, InputDirective],
  templateUrl: './budget-form.html'
})
export class BudgetFormComponent {
  initialAmount = input<number>(0);
  saving = input<boolean>(false);
  success = input<string>('');
  error = input<string>('');

  saved = output<number>();

  amount = signal(0);

  constructor() {
    effect(() => {
      this.amount.set(this.initialAmount());
    });
  }

  submit() {
    this.saved.emit(this.amount());
  }
}
