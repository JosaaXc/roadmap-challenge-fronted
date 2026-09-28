import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft } from '@ng-icons/lucide';
import { HlmAlert } from '@spartan-ng/helm/alert';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { ResetPasswordNavigationState } from '../../models/auth-models';
import { AuthApi } from '../../services/auth-api';

// First step of a forgotten password: the email the code goes to
@Component({
  selector: 'app-forgot-password-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIcon,
    HlmAlert,
    HlmButton,
    HlmFieldImports,
    HlmInput,
    HlmSpinner,
  ],
  templateUrl: './forgot-password-page.html',
  viewProviders: [provideIcons({ lucideChevronLeft })],
})
export class ForgotPasswordPage {
  private readonly authApi = inject(AuthApi);
  private readonly router = inject(Router);

  protected readonly isSending = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  // Starts with the email already typed on the login form, when there was one
  protected readonly form = inject(FormBuilder).nonNullable.group({
    email: [
      inject(ActivatedRoute).snapshot.queryParamMap.get('email') ?? '',
      [Validators.required, Validators.email],
    ],
  });

  protected onSubmit(): void {
    if (this.form.invalid) {
      // Spartan shows field errors on touched controls only
      this.form.markAllAsTouched();
      return;
    }

    const email = this.form.getRawValue().email.trim();
    this.isSending.set(true);
    this.errorMessage.set(null);

    this.authApi.requestPasswordReset(email).subscribe({
      next: () => this.goToReset(email, 'sent'),
      error: (err: HttpErrorResponse) => {
        this.isSending.set(false);
        // A code went out a moment ago and is still good, so the next step can use that one
        if (err.status === 429) {
          this.goToReset(email, 'recent');
          return;
        }
        this.errorMessage.set('No pudimos enviar el código. Intenta de nuevo en unos minutos.');
      },
    });
  }

  private goToReset(email: string, code: ResetPasswordNavigationState['code']): void {
    const state: ResetPasswordNavigationState = { code };
    void this.router.navigate(['/auth/reset-password'], { queryParams: { email }, state });
  }
}
