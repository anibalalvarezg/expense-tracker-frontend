import { ExpenseResponse } from '../../core/services/expense';

export interface ExpenseGroup {
  date: string;
  label: string;
  total: number;
  items: ExpenseResponse[];
}
