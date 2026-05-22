import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { LoginRequest, RegisterRequest, SafeUser } from '@gymrpg/shared';
import { fetchCurrentUser, login, register } from '../lib/api';
import { localStorageTokenStorage, type TokenStorage } from './token-storage';

type AuthState = {
  token: string | null;
  user: SafeUser | null;
  isLoading: boolean;
  authStatus: 'checking' | 'authenticated' | 'guest';
  loginUser: (input: LoginRequest) => Promise<void>;
  registerUser: (input: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({
  children,
  storage = localStorageTokenStorage
}: {
  children: React.ReactNode;
  storage?: TokenStorage;
}) {
  const [token, setToken] = useState<string | null>(() => storage.getToken());
  const [user, setUser] = useState<SafeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    storage.clearToken();
    setToken(null);
    setUser(null);
  }, [storage]);

  const refreshUser = useCallback(async () => {
    const storedToken = storage.getToken();

    if (!storedToken) {
      setIsLoading(false);
      setUser(null);
      return;
    }

    setIsLoading(true);

    try {
      const currentUser = await fetchCurrentUser(storedToken);
      setToken(storedToken);
      setUser(currentUser);
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout, storage]);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const loginUser = useCallback(
    async (input: LoginRequest) => {
      const response = await login(input);
      storage.setToken(response.token);
      setToken(response.token);
      setUser(response.user);
    },
    [storage]
  );

  const registerUser = useCallback(
    async (input: RegisterRequest) => {
      const response = await register(input);
      storage.setToken(response.token);
      setToken(response.token);
      setUser(response.user);
    },
    [storage]
  );

  const value = useMemo<AuthState>(
    () => ({
      token,
      user,
      isLoading,
      authStatus: isLoading ? 'checking' : user ? 'authenticated' : 'guest',
      loginUser,
      registerUser,
      logout,
      refreshUser
    }),
    [isLoading, loginUser, logout, refreshUser, registerUser, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};
