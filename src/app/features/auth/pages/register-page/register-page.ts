import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideEye, lucideEyeOff } from '@ng-icons/lucide';
import { HlmAlert } from '@spartan-ng/helm/alert';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { AuthApi } from '../../services/auth-api';
import { AuthRedirect } from '../../../../core/auth/auth-redirect';
import { SessionStore } from '../../../../core/auth/session-store';
import { GeolocationService } from '../../../../core/services/geolocation.service';
import { injectOAuthError } from '../../../../core/auth/utils/oauth-error.utils';
import { DiscordButton } from '../../../../shared/ui/discord-button/discord-button';
import { NEW_PASSWORD_VALIDATORS } from '../../constants/auth-constants';

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
  viewProviders: [provideIcons({ lucideChevronLeft, lucideEye, lucideEyeOff })],
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private authApi = inject(AuthApi);
  private sessionStore = inject(SessionStore);
  private router = inject(Router);
  private geolocationService = inject(GeolocationService);
  private authRedirect = inject(AuthRedirect);

  // Carried over from the login when the auth guard sent the visitor there
  readonly redirectTo = inject(ActivatedRoute).snapshot.queryParamMap.get('redirectTo');

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
    password: ['', NEW_PASSWORD_VALIDATORS],
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
        // A new account has no path yet, so without a target it starts with the questionnaire
        this.router.navigateByUrl(this.authRedirect.consume(this.redirectTo, '/cuestionario'));
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.error?.message || 'Ocurrió un error al crear la cuenta.');
      },
    });
  }
}
