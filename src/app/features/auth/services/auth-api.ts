import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AuthResponse, RegisterPayload } from '../models/auth-models';

@Service()
export class AuthApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  login(credentials: { identifier: string; password: string}){
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, credentials);
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
}
