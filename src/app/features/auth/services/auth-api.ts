import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AuthResponse } from '../models/auth-models';

@Service()
export class AuthApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  login(credentials: { identifier: string; password: string}){
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, credentials);
  }
}
