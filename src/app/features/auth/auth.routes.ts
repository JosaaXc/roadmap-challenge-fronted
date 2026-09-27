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
  },
  // A forgotten password, in two steps: the email the code goes to, then the code and the new one
  {
    path: 'forgot-password',
    data: { authAside: 'sign-in' },
    loadComponent: () =>
      import('./pages/forgot-password-page/forgot-password-page').then((m) => m.ForgotPasswordPage),
  },
  {
    path: 'reset-password',
    data: { authAside: 'sign-in' },
    loadComponent: () =>
      import('./pages/reset-password-page/reset-password-page').then((m) => m.ResetPasswordPage),
  },
];
