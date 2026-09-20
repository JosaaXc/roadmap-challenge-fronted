import { inject, Service } from '@angular/core';
import { AuthApi } from './auth-api';
import { SessionStore } from '../../../core/auth/session-store';
import { Router } from '@angular/router';

@Service()
export class AuthStore {
  private readonly authApi = inject(AuthApi);
  private readonly sessionStore = inject(SessionStore);
  private readonly router = inject(Router);

  executeLogout() {
    this.authApi.logout().subscribe({
      next: () => {
        this.sessionStore.clear();
        console.log('Logout successful');
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.sessionStore.clear();
        console.error('Error during logout');
        this.router.navigate(['/auth/login']);
      }
    })
  }
}
