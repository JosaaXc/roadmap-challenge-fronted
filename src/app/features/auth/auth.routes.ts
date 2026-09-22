import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    data: { authAside: 'sign-in' },
    loadComponent: () => import('./pages/login-page/login-page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    data: { authAside: 'sign-up' },
    loadComponent: () => import('./pages/register-page/register-page').then((m) => m.RegisterPage),
  },
  {
    path: 'callback',
    loadComponent: () => import('./pages/callback-page/callback-page').then((m) => m.CallbackPage),
  }
];
