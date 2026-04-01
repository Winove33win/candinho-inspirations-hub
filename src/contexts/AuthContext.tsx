import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api, setToken, clearToken, ApiError } from '@/lib/apiClient';
import type { AuthUser } from '@/types/api';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: Error }>;
  signUp: (email: string, password: string) => Promise<{ error?: Error }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

function loadStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem('smartx_user');
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(loadStoredUser);
  const [loading, setLoading] = useState(true);
  const queryClient           = useQueryClient();

  // Verify stored token on mount
  useEffect(() => {
    const token = localStorage.getItem('smartx_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    api
      .get<{ user: AuthUser }>('/api/auth/me')
      .then(({ user: u }) => {
        setUser(u);
        localStorage.setItem('smartx_user', JSON.stringify(u));
      })
      .catch(() => {
        clearToken();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Clear query cache when user changes
  useEffect(() => {
    queryClient.clear();
  }, [user?.id, queryClient]);

  const signIn = async (email: string, password: string) => {
    try {
      const { token, user: u } = await api.post<{ token: string; user: AuthUser }>(
        '/api/auth/login',
        { email, password }
      );
      setToken(token);
      localStorage.setItem('smartx_user', JSON.stringify(u));
      setUser(u);
      return {};
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Erro ao fazer login') };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { token, user: u } = await api.post<{ token: string; user: AuthUser }>(
        '/api/auth/register',
        { email, password }
      );
      setToken(token);
      localStorage.setItem('smartx_user', JSON.stringify(u));
      setUser(u);
      return {};
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Erro ao criar conta') };
    }
  };

  const signOut = () => {
    clearToken();
    setUser(null);
    queryClient.clear();
    window.location.replace(`/auth?ts=${Date.now()}`);
  };

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, signOut }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
