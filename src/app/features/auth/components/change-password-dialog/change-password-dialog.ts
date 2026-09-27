import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmAlert } from '@spartan-ng/helm/alert';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDialog, HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { SessionStore } from '../../../../core/auth/session-store';
import { NEW_PASSWORD_VALIDATORS } from '../../constants/auth-constants';
import { ApiErrorBody } from '../../models/auth-models';
import { AuthApi } from '../../services/auth-api';
import { PasswordField } from '../password-field/password-field';

// Changes the password of whoever is signed in. The backend closes every session on success,
// so the dialog ends by sending them to sign in with the new one. Opened by reference
@Component({
  selector: 'app-change-password-dialog',
  imports: [
    ReactiveFormsModule,
    HlmAlert,
    HlmButton,
    HlmDialogImports,
    HlmFieldImports,
    HlmSpinner,
    PasswordField,
  ],
  templateUrl: './change-password-dialog.html',
  host: { class: 'contents' },
})
export class ChangePasswordDialog {
  private readonly authApi = inject(AuthApi);
  private readonly session = inject(SessionStore);
  private readonly router = inject(Router);
  private readonly dialog = viewChild.required(HlmDialog);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', NEW_PASSWORD_VALIDATORS],
  });

  protected readonly isSaving = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  open(): void {
    this.dialog().open();
  }

  // Reopening starts clean
  protected onClosed(): void {
    this.form.reset();
    this.errorMessage.set(null);
  }

  protected submit(dialog: { close: () => void }): void {
    if (this.form.invalid) {
      // Spartan shows field errors on touched controls only
      this.form.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword } = this.form.getRawValue();
    if (currentPassword === newPassword) {
      this.errorMessage.set('La nueva contraseña tiene que ser distinta de la actual.');
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);

    this.authApi.changePassword({ currentPassword, newPassword }).subscribe({
      next: () => {
        dialog.close();
        this.session.clear();
        toast.success('Tu contraseña cambió. Inicia sesión con la nueva.');
        void this.router.navigate(['/auth/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.isSaving.set(false);
        this.errorMessage.set(changeErrorMessage(err));
      },
    });
  }
}

function changeErrorMessage(err: HttpErrorResponse): string {
  const body = err.error as ApiErrorBody | null;
  if (err.status === 401 && body?.error?.code === 'INVALID_CREDENTIALS') {
    return 'Tu contraseña actual no es correcta.';
  }
  // A Discord account has no password to change; the backend tells it apart by its message only
  if (err.status === 400 && body?.error?.message?.includes('external login')) {
    return 'Tu cuenta entra con Discord, así que no tiene una contraseña que cambiar.';
  }
  return 'No pudimos cambiar tu contraseña. Intenta de nuevo.';
}
