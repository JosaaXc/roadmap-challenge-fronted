import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStore } from './session-store';

export const authGuard: CanActivateFn = (_route, state) => {
  const session = inject(SessionStore);
  const router = inject(Router);

  return (
    session.isAuthenticated() ||
    router.createUrlTree(['/auth/login'], { queryParams: { redirectTo: state.url } })
  );
};
