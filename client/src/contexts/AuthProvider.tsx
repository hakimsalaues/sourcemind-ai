import { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import { AuthContext } from "./AuthContext";
import { authService } from "../services/authService";
import type {
  AuthSession,
  AuthUser,
  LoginInput,
  RegisterInput,
} from "../types/auth";

const TOKEN_KEY = "sourcemind_token";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  );
  const [isLoading, setIsLoading] = useState(true);

  const saveSession = (session: AuthSession) => {
    localStorage.setItem(TOKEN_KEY, session.token);
    setToken(session.token);
    setUser(session.user);
  };

  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await authService.getCurrentUser();

        setToken(storedToken);
        setUser(currentUser);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void restoreSession();
  }, []);

  const login = async (input: LoginInput) => {
    const session = await authService.login(input);
    saveSession(session);
  };

  const register = async (input: RegisterInput) => {
    const session = await authService.register(input);
    saveSession(session);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
