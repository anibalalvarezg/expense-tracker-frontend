import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { MainLayout } from './shared/components/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login')
      .then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register')
      .then(m => m.Register)
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard')
          .then(m => m.Dashboard)
      },
      {
        path: 'expenses',
        loadComponent: () => import('./features/expenses/expenses')
          .then(m => m.Expenses)
      },
      {
        path: 'budget',
        loadComponent: () => import('./features/budget/budget')
          .then(m => m.Budget)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
