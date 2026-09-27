import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionStore } from '../auth/session-store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(SessionStore).token();

  // A request that brings its own token, like the callback checking Discord's, keeps it
  if (req.url.includes('/auth/refresh') || req.headers.has('Authorization')){
    return next(req);
  }

  return next(
    token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req,
  );
};
