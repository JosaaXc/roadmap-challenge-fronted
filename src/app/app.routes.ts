import { Routes } from '@angular/router';
import { adminGuard } from './core/auth/admin-guard';
import { authGuard } from './core/auth/auth-guard';

export const routes: Routes = [
  // Pública, sin layout
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/landing/pages/landing-page/landing-page').then((m) => m.LandingPage),
  },

  // Shell público de autenticación
  {
    path: 'auth',
    loadComponent: () => import('./layouts/auth-layout/auth-layout').then((m) => m.AuthLayout),
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
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
        path: 'cuestionario',
        loadComponent: () =>
          import('./features/assessment/pages/assessment-page/assessment-page').then(
            (m) => m.AssessmentPage,
          ),
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
