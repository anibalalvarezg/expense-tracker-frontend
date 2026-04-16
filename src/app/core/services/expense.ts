import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface ExpenseRequest {
  amount: number;
  categoryId: number;
  description: string;
  date: string;
}

export interface ExpenseResponse {
  id: number;
  amount: number;
  description: string;
  date: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
}

export interface ExpenseSummaryResponse {
  totalMonth: number;
  byCategory: { [key: string]: number };
}

@Injectable({ providedIn: 'root' })
export class ExpenseService {

  private url = `${environment.apiUrl}/expenses`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ExpenseResponse[]> {
    return this.http.get<ExpenseResponse[]>(this.url);
  }

  getByMonth(year: number, month: number): Observable<ExpenseResponse[]> {
    const params = new HttpParams()
      .set('year', year)
      .set('month', month);
    return this.http.get<ExpenseResponse[]>(`${this.url}/month`, { params });
  }

  getSummary(year: number, month: number): Observable<ExpenseSummaryResponse> {
    const params = new HttpParams()
      .set('year', year)
      .set('month', month);
    return this.http.get<ExpenseSummaryResponse>(`${this.url}/summary`, { params });
  }

  create(request: ExpenseRequest): Observable<ExpenseResponse> {
    return this.http.post<ExpenseResponse>(this.url, request);
  }

  update(id: number, request: ExpenseRequest): Observable<ExpenseResponse> {
    return this.http.put<ExpenseResponse>(`${this.url}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
