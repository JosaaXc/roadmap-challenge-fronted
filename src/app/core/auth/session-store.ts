import { computed, Service, signal } from '@angular/core';
import { AuthResponse } from '../../features/auth/models/auth-models';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  roles: readonly string[];
}

@Service()
export class SessionStore {
  private readonly _user = signal<SessionUser | null>(this.lodadUser());
  private readonly _token = signal<string | null>(this.loadToken());

  readonly user = this._user.asReadonly();
  readonly token = this._token.asReadonly();

  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly isAdmin = computed(() => this._user()?.roles.includes('admin') ?? false);

  setSession(user: SessionUser, token: string): void {
    this._user.set(user);
    this._token.set(token);

    localStorage.setItem('session_user', JSON.stringify(user));
    localStorage.setItem('access_token', token);
  }

  handleAuthResponse(response: AuthResponse) {
    const backendUser = response.data.user;

    const mappedUser: SessionUser = {
      id: backendUser.id,
      email: backendUser.email,
      name: backendUser.username ,
      roles: [backendUser.roleName.toLowerCase()],
    }
    this.setSession(mappedUser, response.data.accessToken);
  }

  clear(): void {
    this._user.set(null);
    this._token.set(null);
    localStorage.removeItem('session_user');
    localStorage.removeItem('access_token');
  }

  private lodadUser(): SessionUser | null {
    const userStr = localStorage.getItem('session_user');
    return userStr ? JSON.parse(userStr) : null;
  }
  private loadToken(): string | null {
    return localStorage.getItem('access_token');
  }
}
