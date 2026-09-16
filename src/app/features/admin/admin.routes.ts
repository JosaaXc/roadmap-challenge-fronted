import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/catalog-page/catalog-page').then((m) => m.CatalogPage),
  },
];
