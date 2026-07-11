export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type AuthSession = {
  user: AuthUser;
  token: string;
};

export type AuthResponse = {
  success: boolean;
  data: AuthSession;
  message: string;
};

export type CurrentUserResponse = {
  success: boolean;
  data: {
    user: AuthUser;
  };
  message: string;
};
