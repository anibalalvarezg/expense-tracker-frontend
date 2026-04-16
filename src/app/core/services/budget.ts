import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface BudgetRequest {
  amount: number;
  month: number;
  year: number;
}

export interface BudgetResponse {
  id: number;
  amount: number;
  month: number;
  year: number;
}

export interface BudgetStatusResponse {
  budget: number;
  spent: number;
  available: number;
  percentageUsed: number;
  overBudget: boolean;
  month: number;
  year: number;
}

@Injectable({ providedIn: 'root' })
export class BudgetService {

  private url = `${environment.apiUrl}/budgets`;

  constructor(private http: HttpClient) {}

  save(request: BudgetRequest): Observable<BudgetResponse> {
    return this.http.post<BudgetResponse>(this.url, request);
  }

  getByMonth(year: number, month: number): Observable<BudgetResponse> {
    const params = new HttpParams()
      .set('year', year)
      .set('month', month);
    return this.http.get<BudgetResponse>(this.url, { params });
  }

  getStatus(year: number, month: number): Observable<BudgetStatusResponse> {
    const params = new HttpParams()
      .set('year', year)
      .set('month', month);
    return this.http.get<BudgetStatusResponse>(`${this.url}/status`, { params });
  }
}
