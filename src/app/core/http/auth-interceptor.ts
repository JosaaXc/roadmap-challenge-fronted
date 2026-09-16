import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionStore } from '../auth/session-store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(SessionStore).token();

  return next(
    token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req,
  );
};
