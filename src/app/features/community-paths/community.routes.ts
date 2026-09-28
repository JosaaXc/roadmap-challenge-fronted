import { Routes } from "@angular/router";

export const communityRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/community-paths/community-paths').then((m) => m.CommunityPathsPageComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/community-paths-detail/community-paths-detail').then((m) => m.CommunityPathDetailPage),
  }
]
