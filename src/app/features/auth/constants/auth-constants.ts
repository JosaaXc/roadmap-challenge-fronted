import { Validators } from '@angular/forms';

// The backend's password rules (its auth/dto/password-rules.ts), shared by every form that
// sets a password, so register, reset and change can never ask for different things
export const NEW_PASSWORD_VALIDATORS = [
  Validators.required,
  Validators.minLength(8),
  Validators.maxLength(128),
  Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/),
];

// The emailed reset code: the backend's OTP_LENGTH, 6 unless configured otherwise
export const RESET_CODE_LENGTH = 6;
export const RESET_CODE_PATTERN = new RegExp(`^\\d{${RESET_CODE_LENGTH}}$`);

// Wait before another code can be asked for: the backend's OTP_COOLDOWN_SECONDS default
export const RESET_CODE_RESEND_SECONDS = 120;
