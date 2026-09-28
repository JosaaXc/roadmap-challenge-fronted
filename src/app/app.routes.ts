import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
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

  // The whole catalog, open to anyone: the landing links to it before any sign in
  {
    path: 'cursos',
    loadComponent: () =>
      import('./features/landing/pages/catalog-page/catalog-page').then((m) => m.CatalogPage),
  },

  // Shell público de autenticación
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadComponent: () => import('./layouts/auth-layout/auth-layout').then((m) => m.AuthLayout),
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },

  // The reset email links to /reset-password (the backend builds it from FRONTEND_URL), so it
  // goes on to the auth shell with its query, the email included
  {
    path: 'reset-password',
    redirectTo: ({ queryParams }) =>
      inject(Router).createUrlTree(['/auth/reset-password'], { queryParams }),
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
        path: 'community',
        loadChildren: () => import('./features/community-paths/community.routes').then((m) => m.communityRoutes),
      }
    ],
  },

  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.adminRoutes),
  },

  {
    path: '**',
    loadComponent: () =>
      import('./shared/pages/not-found-page/not-found-page').then((m) => m.NotFoundPage),
  },
];
