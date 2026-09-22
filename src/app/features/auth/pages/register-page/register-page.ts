import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEye, lucideEyeOff } from '@ng-icons/lucide';
import { HlmAlert } from '@spartan-ng/helm/alert';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { AuthApi } from '../../services/auth-api';
import { SessionStore } from '../../../../core/auth/session-store';
import { GeolocationService } from '../../../../core/services/geolocation.service';
import { injectOAuthError } from '../../../../core/auth/utils/oauth-error.utils';
import { DiscordButton } from '../../../../shared/ui/discord-button/discord-button';

@Component({
  selector: 'app-register-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIcon,
    HlmAlert,
    HlmButton,
    HlmFieldImports,
    HlmInput,
    HlmInputGroupImports,
    HlmSpinner,
    DiscordButton,
  ],
  templateUrl: './register-page.html',
  viewProviders: [provideIcons({ lucideEye, lucideEyeOff })],
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private authApi = inject(AuthApi);
  private sessionStore = inject(SessionStore);
  private router = inject(Router);
  private geolocationService = inject(GeolocationService);

  isLoading = signal(false);
  errorMessage = injectOAuthError();
  passwordVisible = signal(false);

  // Mirrors the backend RegisterDto, upper bounds included
  registerForm = this.fb.nonNullable.group({
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(32),
        Validators.pattern(/^[a-zA-Z0-9_]+$/),
      ],
    ],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(128),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/),
      ],
    ],
  });

  togglePassword() {
    this.passwordVisible.update((visible) => !visible);
  }

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
}
