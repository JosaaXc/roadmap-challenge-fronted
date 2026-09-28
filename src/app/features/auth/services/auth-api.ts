import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { SKIP_SESSION_RECOVERY } from '../../../core/http/http-context-tokens';
import {
  AuthResponse,
  ChangePasswordPayload,
  ForgotPasswordResponse,
  PasswordUpdatedResponse,
  RegisterPayload,
  ResetPasswordPayload,
  UserProfileResponse,
} from '../models/auth-models';

@Service()
export class AuthApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  login(credentials: { identifier: string; password: string}){
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, credentials,
      {withCredentials: true}
    );
  }

  register(payload: RegisterPayload){
    const idempotencyKey = crypto.randomUUID();
    return this.http.post<AuthResponse>(
      `${this.baseUrl}/auth/register`,
      payload,
      {
        headers: new HttpHeaders({
          'Idempotency-Key': idempotencyKey
        }),
        withCredentials: true
      }
    );
  }

  logout() {
    return this.http.post(
      `${this.baseUrl}/auth/logout`,
      {},
      { withCredentials: true }
    );
  }

  refreshToken() {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/refresh`,
      {},
      {withCredentials: true}
    );
  }

  // The signed-in account, through the usual session: its token, and a refresh if it expired
  getCurrentProfile() {
    return this.http.get<UserProfileResponse>(`${this.baseUrl}/users/me`, {
      withCredentials: true,
    });
  }

  // Checks a token this app did not issue itself, so a 401 is the answer, not a session to refresh
  getProfile(accessToken: string) {
    return this.http.get<UserProfileResponse>(`${this.baseUrl}/users/me`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${accessToken}` }),
      context: new HttpContext().set(SKIP_SESSION_RECOVERY, true),
      withCredentials: true,
    });
  }

  // Emails a one-time code. Public, and answers a 429 while the last code is still recent
  requestPasswordReset(email: string) {
    return this.http.post<ForgotPasswordResponse>(`${this.baseUrl}/auth/password/forgot`, {
      email,
    });
  }

  resetPassword(payload: ResetPasswordPayload) {
    return this.http.post<PasswordUpdatedResponse>(`${this.baseUrl}/auth/password/reset`, payload);
  }

  // Needs the session. The backend then revokes every refresh token of the account
  changePassword(payload: ChangePasswordPayload) {
    return this.http.post<PasswordUpdatedResponse>(
      `${this.baseUrl}/auth/password/change`,
      payload,
    );
  }
}
