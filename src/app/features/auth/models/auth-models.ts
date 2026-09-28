export interface AuthResponse{
  success: boolean;
  data: {
    accessToken: string;
    user: {
      id: string;
      email: string;
      username: string;
      displayName: string;
      avatarUrl: string;
      isActive: boolean;
      roleId: string;
      roleName: string;
    };
  };
}

// GET /users/me: the account behind a token, used to check the one Discord hands back
export interface UserProfileResponse {
  success: boolean;
  data: {
    id: string;
    email: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    isActive: boolean;
    roleId: string;
    roleName: string;
  };
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

// POST /auth/password/reset: the code emailed by /auth/password/forgot, and the new password
export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

// POST /auth/password/change, for someone signed in who remembers the current one
export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

// The answer of /auth/password/forgot is always a success, known email or not, so
// nobody can use it to find out who has an account
export interface ForgotPasswordResponse {
  success: boolean;
  data: { success: true };
}

// Reset and change answer the same way, and both close every session of the account
export interface PasswordUpdatedResponse {
  success: boolean;
  data: { message: string };
}

// What the forgot step hands the reset step: a code just went out, or one had gone out a
// moment before (the backend's 429). Opening the emailed link carries neither
export interface ResetPasswordNavigationState {
  readonly code?: 'sent' | 'recent';
}

// The body of every failed request: the code is what the pages branch on
export interface ApiErrorBody {
  error?: { code?: string; message?: string };
}

