import React, { createContext, useContext, useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { AdminUser } from '../types/property';

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  isSupabaseReady: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_AUTH_KEY = 'marcela_cardoso_demo_admin';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (!isSupabaseConfigured) {
        try {
          const saved = sessionStorage.getItem(DEMO_AUTH_KEY);
          if (saved && mounted) {
            setUser(JSON.parse(saved));
          }
        } catch {
          // ignore
        } finally {
          if (mounted) setLoading(false);
        }
        return;
      }

      try {
        const { data } = await supabase.auth.getSession();
        if (mounted && data.session?.user) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email || '',
            role: 'admin',
            created_at: data.session.user.created_at,
          });
        }
      } catch (err) {
        console.error('Erro ao verificar sessão Supabase:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    if (isSupabaseConfigured) {
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            role: 'admin',
            created_at: session.user.created_at,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => {
        mounted = false;
        listener.subscription.unsubscribe();
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    if (!email.trim() || !password.trim()) {
      return { error: 'Informe seu e-mail e sua senha.' };
    }

    if (!isSupabaseConfigured) {
      if (password.length < 4) {
        return { error: 'A senha deve possuir pelo menos 4 caracteres.' };
      }
      const demoUser: AdminUser = {
        id: 'demo-admin-id',
        email: email.trim(),
        role: 'admin',
        created_at: new Date().toISOString(),
      };
      sessionStorage.setItem(DEMO_AUTH_KEY, JSON.stringify(demoUser));
      setUser(demoUser);
      return {};
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return {
        error:
          error.message === 'Invalid login credentials'
            ? 'E-mail ou senha inválidos. Verifique suas credenciais no Supabase Auth.'
            : error.message,
      };
    }

    if (data.user) {
      setUser({
        id: data.user.id,
        email: data.user.email || email,
        role: 'admin',
        created_at: data.user.created_at,
      });
    }

    return {};
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      sessionStorage.removeItem(DEMO_AUTH_KEY);
      setUser(null);
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isSupabaseReady: isSupabaseConfigured,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return ctx;
}
