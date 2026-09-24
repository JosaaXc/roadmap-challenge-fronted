import { Routes } from '@angular/router';
import { adminGuard } from './core/auth/admin-guard';
import { authGuard, guestGuard } from './core/auth/auth-guard';

export const routes: Routes = [
  // Pública, sin layout
  {
    path: '',
    pathMatch: 'full',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/landing/pages/landing-page/landing-page').then((m) => m.LandingPage),
  },

  // Shell público de autenticación
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadComponent: () => import('./layouts/auth-layout/auth-layout').then((m) => m.AuthLayout),
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },

  // Cuestionario: sin layout, porque es un flujo enfocado con su propia barra de salida
  {
    path: 'cuestionario',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/assessment/pages/assessment-page/assessment-page').then(
        (m) => m.AssessmentPage,
      ),
  },

  // Shell autenticado
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      {
        path: 'mis-rutas',
        loadChildren: () => import('./features/paths/paths.routes').then((m) => m.pathsRoutes),
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        loadChildren: () => import('./features/admin/admin.routes').then((m) => m.adminRoutes),
      },
    ],
  },

  {
    path: '**',
    loadComponent: () =>
      import('./shared/pages/not-found-page/not-found-page').then((m) => m.NotFoundPage),
  },
];
