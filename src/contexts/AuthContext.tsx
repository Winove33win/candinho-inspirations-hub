import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  // Carrega sessão + ouve mudanças (resolve "parece logado" após sair)
  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, sess) => {
      if (!mounted) return;
      setSession(sess);
      setUser(sess?.user ?? null);
    });

    // Sincronia multi-aba
    const onStorage = (e: StorageEvent) => {
      if (e.key?.startsWith('sb-')) {
        supabase.auth.getSession().then(({ data }) => {
          if (!mounted) return;
          setSession(data.session ?? null);
          setUser(data.session?.user ?? null);
        });
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      sub.subscription.unsubscribe();
      window.removeEventListener('storage', onStorage);
      mounted = false;
    };
  }, []);

  // Quando o user.id muda, zera TUDO que é cache (corrige "dados do último login")
  useEffect(() => {
    queryClient.clear();
  }, [user?.id, queryClient]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl }
    });
    return { error };
  };

  const signOut = async () => {
    // 1) Encerra sessão no Supabase
    await supabase.auth.signOut();

    // 2) Limpa caches do app
    try {
      // React Query
      queryClient.clear();

      // Storages
      Object.keys(localStorage)
        .filter(k => k.startsWith('smartx') || k.startsWith('sb-'))
        .forEach(k => localStorage.removeItem(k));
      sessionStorage.clear();

      // Service Worker cache (se houver)
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }

      // IndexedDB (se usar persist do React Query)
      if ('indexedDB' in window && (window as any).indexedDB?.databases) {
        const dbs = await (window as any).indexedDB.databases();
        await Promise.all(
          (dbs || [])
            .filter((d: any) => /smartx|react-query|tanstack/i.test(d?.name || ''))
            .map((d: any) => new Promise(res => {
              const req = window.indexedDB.deleteDatabase(d.name);
              req.onsuccess = req.onerror = req.onblocked = () => res(null);
            }))
        );
      }
    } finally {
      // 3) Força recarregar a página de login (evita UI com estado antigo)
      window.location.replace(`/auth?ts=${Date.now()}`);
    }
  };

  const value = useMemo(
    () => ({ user, session, loading, signIn, signUp, signOut }),
    [user, session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
