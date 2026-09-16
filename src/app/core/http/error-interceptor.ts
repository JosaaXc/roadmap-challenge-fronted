import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SessionStore } from '../auth/session-store';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(SessionStore);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        session.clear();
        void router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    }),
  );
};
