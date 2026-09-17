import { Component, inject, signal} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthApi } from '../../services/auth-api';
import { SessionStore, SessionUser } from '../../../../core/auth/session-store';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { HlmCard, HlmCardHeader, HlmCardContent } from '@spartan-ng/helm/card';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmButton } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, HlmCard, HlmCardHeader, HlmInput, HlmLabel, HlmCardContent, HlmButton],
  templateUrl: './login-page.html',
})
export class LoginPage {

  private fb = inject(FormBuilder);
  private authApi = inject(AuthApi);
  private sessionStorage = inject(SessionStore);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.nonNullable.group({
    identifier: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    await this.captureAndStoreLocation();

    const credentials = this.loginForm.getRawValue();

    this.authApi.login(credentials).subscribe({
      next: (response) => {
        const backendUser = response.data.user;

        const mappedUser: SessionUser = {
          id: backendUser.id,
          email: backendUser.email,
          name: backendUser.displayName,
          roles: [backendUser.roleName.toLowerCase()],
        }

        this.sessionStorage.setSession(mappedUser, response.data.accessToken);
        this.isLoading.set(false);
        this.router.navigate(['/cuestionario']);
      }, error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        const serverMessage = err.error?.error?.message;
        this.errorMessage.set(serverMessage || 'Credenciales inválidas.');
      }
    });
  }

  private captureAndStoreLocation(): Promise<void> {
    return new Promise((resolve) => {
      if (!navigator.geolocation){
        resolve();
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          localStorage.setItem('geo-lat', position.coords.latitude.toString());
          localStorage.setItem('geo-lng', position.coords.longitude.toString());
          resolve();
        },
        () => resolve(),
        {timeout: 3000}
      );
    });
  }
}
