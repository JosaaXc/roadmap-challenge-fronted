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

