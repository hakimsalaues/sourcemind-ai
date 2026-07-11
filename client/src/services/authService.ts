import { api } from "./api";
import type {
  AuthResponse,
  AuthSession,
  AuthUser,
  CurrentUserResponse,
  LoginInput,
  RegisterInput,
} from "../types/auth";

export const authService = {
  async register(input: RegisterInput): Promise<AuthSession> {
    const response = await api.post<AuthResponse>("/auth/register", input);

    return response.data.data;
  },

  async login(input: LoginInput): Promise<AuthSession> {
    const response = await api.post<AuthResponse>("/auth/login", input);

    return response.data.data;
  },

  async getCurrentUser(): Promise<AuthUser> {
    const response = await api.get<CurrentUserResponse>("/auth/me");

    return response.data.data.user;
  },
};
