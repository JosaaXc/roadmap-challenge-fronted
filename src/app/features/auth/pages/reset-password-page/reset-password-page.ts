import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft } from '@ng-icons/lucide';
import { BrnInputOtp } from '@spartan-ng/brain/input-otp';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmAlert } from '@spartan-ng/helm/alert';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmInputOtpImports } from '@spartan-ng/helm/input-otp';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { PasswordField } from '../../components/password-field/password-field';
import {
  NEW_PASSWORD_VALIDATORS,
  RESET_CODE_LENGTH,
  RESET_CODE_PATTERN,
  RESET_CODE_RESEND_SECONDS,
} from '../../constants/auth-constants';
import { ResetPasswordNavigationState } from '../../models/auth-models';
import { AuthApi } from '../../services/auth-api';

// Second step of a forgotten password: the emailed code and the new password. The email comes
// in the URL, from the first step or from the link in the email itself
@Component({
  selector: 'app-reset-password-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIcon,
    BrnInputOtp,
    HlmAlert,
    HlmButton,
    HlmFieldImports,
    HlmInput,
    HlmInputOtpImports,
    HlmSpinner,
    PasswordField,
  ],
  templateUrl: './reset-password-page.html',
  viewProviders: [provideIcons({ lucideChevronLeft })],
})
export class ResetPasswordPage {
  private readonly authApi = inject(AuthApi);
  private readonly router = inject(Router);

  // Set by the first step, so the page can say whether a code just went out
  protected readonly arrival =
    (this.router.currentNavigation()?.extras.state as ResetPasswordNavigationState | undefined)
      ?.code ?? null;

  protected readonly codeSlots = Array.from({ length: RESET_CODE_LENGTH }, (_, slot) => slot);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    email: [
      inject(ActivatedRoute).snapshot.queryParamMap.get('email') ?? '',
      [Validators.required, Validators.email],
    ],
    otp: ['', [Validators.required, Validators.pattern(RESET_CODE_PATTERN)]],
    newPassword: ['', NEW_PASSWORD_VALIDATORS],
  });

  protected readonly isSaving = signal(false);
  protected readonly isResending = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  // Seconds before another code can be asked for, mirroring the backend's cooldown
  protected readonly resendIn = signal(0);
  protected readonly resendClock = computed(() => {
    const seconds = this.resendIn();
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  });
  private countdown?: ReturnType<typeof setInterval>;

  // A pasted code often carries spaces or dashes, and only its digits count
  protected readonly digitsOnly = (pasted: string, length: number) =>
    pasted.replace(/\D/g, '').slice(0, length);

  constructor() {
    inject(DestroyRef).onDestroy(() => clearInterval(this.countdown));
    // Coming from the first step, a code has just gone out, so the backend would refuse another
    if (this.arrival) this.startCountdown();
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      // Spartan shows field errors on touched controls only
      this.form.markAllAsTouched();
      return;
    }

    const { email, otp, newPassword } = this.form.getRawValue();
    this.isSaving.set(true);
    this.errorMessage.set(null);

    this.authApi.resetPassword({ email: email.trim(), otp, newPassword }).subscribe({
      next: () => {
        toast.success('Listo, tu contraseña cambió. Inicia sesión con la nueva.');
        void this.router.navigate(['/auth/login'], { replaceUrl: true });
      },
      error: (err: HttpErrorResponse) => {
        this.isSaving.set(false);
        if (err.status === 401) {
          // Wrong or expired alike, on purpose: the backend never says which
          this.form.controls.otp.reset();
          this.errorMessage.set('El código no es correcto o ya venció. Revísalo o pide uno nuevo.');
          return;
        }
        this.errorMessage.set('No pudimos cambiar tu contraseña. Intenta de nuevo.');
      },
    });
  }

  protected resend(): void {
    const email = this.form.controls.email;
    if (email.invalid) {
      email.markAsTouched();
      return;
    }

    this.isResending.set(true);
    this.errorMessage.set(null);

    this.authApi.requestPasswordReset(email.value.trim()).subscribe({
      next: () => {
        this.isResending.set(false);
        toast.success('Te enviamos un código nuevo.');
        this.startCountdown();
      },
      error: (err: HttpErrorResponse) => {
        this.isResending.set(false);
        if (err.status === 429) {
          toast.info('Ya te enviamos un código hace poco. Usa ese o espera para pedir otro.');
          this.startCountdown();
          return;
        }
        this.errorMessage.set('No pudimos enviar el código. Intenta de nuevo en unos minutos.');
      },
    });
  }

  private startCountdown(): void {
    clearInterval(this.countdown);
    this.resendIn.set(RESET_CODE_RESEND_SECONDS);
    this.countdown = setInterval(() => {
      this.resendIn.update((seconds) => seconds - 1);
      if (this.resendIn() <= 0) clearInterval(this.countdown);
    }, 1000);
  }
}
