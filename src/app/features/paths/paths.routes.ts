import { Routes } from '@angular/router';

export const pathsRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/my-paths-page/my-paths-page').then((m) => m.MyPathsPage),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/path-detail-page/path-detail-page').then((m) => m.PathDetailPage),
  },
];
