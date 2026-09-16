import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStore } from './session-store';

export const adminGuard: CanActivateFn = () => {
  const session = inject(SessionStore);
  const router = inject(Router);

  return session.isAdmin() || router.createUrlTree(['/mis-rutas']);
};
