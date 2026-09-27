import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { SessionStore } from '../auth/session-store';
import { AuthApi } from '../../features/auth/services/auth-api';
import { SKIP_SESSION_RECOVERY } from './http-context-tokens';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(SessionStore);
  const authApi = inject(AuthApi);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.context.get(SKIP_SESSION_RECOVERY)) {
        if (req.url.includes('/auth/refresh')) {
          session.clear();
          void router.navigate(['/auth/login']);
          return throwError(() => error);
        }

        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return authApi.refreshToken().pipe(
            switchMap((response) => {
              isRefreshing = false;
              session.handleAuthResponse(response);
              const newToken = response.data.accessToken;
              refreshTokenSubject.next(newToken);

              const clonedReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
              });
              return next(clonedReq);
            }),
            catchError((refreshError) => {
              isRefreshing = false;
              session.clear();
              void router.navigate(['/auth/login']);
              return throwError(() => refreshError);
            }),
          );
        } else {
          return refreshTokenSubject.pipe(
            filter((token) => token !== null),
            take(1),
            switchMap((token) => {
              const clonedReq = req.clone({
                setHeaders: { Authorization: `Bearer ${token}` },
              });
              return next(clonedReq);
            }),
          );
        }
      }
      return throwError(() => error);
    }),
  );
};
