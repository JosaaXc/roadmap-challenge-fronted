import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthApi } from '../../services/auth-api';
import { SessionStore } from '../../../../core/auth/session-store';
import { Router, RouterLink } from '@angular/router';
import { HlmCard, HlmCardHeader, HlmCardContent } from '@spartan-ng/helm/card';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmButton } from '@spartan-ng/helm/button';
import { environment } from '../../../../../environments/environment';
import { GeolocationService } from '../../../../core/services/geolocation.service';

@Component({
  imports: [
    ReactiveFormsModule,
    HlmCard,
    HlmCardHeader,
    HlmInput,
    HlmLabel,
    HlmCardContent,
    HlmButton,
    RouterLink,
  ],
  standalone: true,
  selector: 'app-register-page',
  templateUrl: './register-page.html',
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private authApi = inject(AuthApi);
  private sessionStore = inject(SessionStore);
  private router = inject(Router);
  private geolocationService = inject(GeolocationService);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  registerForm = this.fb.nonNullable.group({
    username: [
      '',
      [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_]+$/)],
    ],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/),
      ],
    ],
  });

  async onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    await this.geolocationService.captureAndStoreLocation();

    this.authApi.register(this.registerForm.getRawValue()).subscribe({
      next: (response) => {
        this.sessionStore.handleAuthResponse(response);
        this.isLoading.set(false);
        this.router.navigate(['/cuestionario']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.error?.message || 'Ocurrió un error al crear la cuenta.');
      },
    });
  }

  loginWithDiscord() {
    window.location.href = `${environment.apiUrl}/auth/discord`;
  }
}
