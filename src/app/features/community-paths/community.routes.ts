import { Routes } from "@angular/router";

export const communityRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/community-paths').then((m) => m.CommunityPathsPageComponent),
  },
  // {
  //   path: ':id',
  // }
]
