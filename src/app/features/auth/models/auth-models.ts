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

