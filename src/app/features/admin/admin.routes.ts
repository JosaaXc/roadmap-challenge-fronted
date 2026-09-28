import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('../../layouts/admin-layout/admin-layout').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home-page/home-page').then(m => m.HomePage),
      },
      {
        path: 'catalog',
        loadComponent: () => import('./pages/catalog-page/catalog-page').then(m => m.CatalogPage),
      },
      {
        path: 'questions',
        loadComponent: () => import('./pages/questions-page/questions-page').then(m => m.QuestionsPage),
      },
      {
        path: 'public-paths',
        loadComponent: () => import('./pages/public-paths-page/public-paths-page').then(m => m.PublicPaths),
      }
    ]
  },
];
