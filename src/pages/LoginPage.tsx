import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { SITE_CONFIG } from '../config/siteConfig';
import { useSEO } from '../hooks/useSEO';

export const LoginPage: React.FC = () => {
  useSEO({
    title: 'Login Administrativo',
    description: 'Acesso restrito ao painel administrativo de Marcela Cardoso Imóveis.',
  });

  const { user, signIn, isSupabaseReady } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(
    isSupabaseReady ? '' : 'admin@marcelacardosoimoveis.com.br'
  );
  const [password, setPassword] = useState(isSupabaseReady ? '' : 'admin123');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const fromPath =
    (location.state as { from?: { pathname?: string } })?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const result = await signIn(email, password);
      if (result.error) {
        setErrorMsg(result.error);
      } else {
        navigate(fromPath, { replace: true });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#FAF8F5] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#6E665E] hover:text-[#181615]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Voltar para o site público</span>
        </Link>

        <div className="mt-6 rounded-2xl border border-[#E6E1DA] bg-white p-8 shadow-xs">
          <div className="mb-6">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#FAF8F5] border border-[#E6E1DA] text-[#8C6A32]">
              <Lock className="h-5 w-5" />
            </span>
            <h1 className="mt-4 font-display text-2xl font-semibold text-[#181615]">
              Área Administrativa
            </h1>
            <p className="mt-1 text-xs text-[#6E665E]">
              {SITE_CONFIG.brandFullTitle} · Gestão de Imóveis e Fotos
            </p>
          </div>

          {!isSupabaseReady && (
            <div className="mb-5 rounded-lg border border-[#E6D5B8] bg-[#FBF7F0] p-3.5 text-xs leading-relaxed text-[#5C4B2B]">
              <p className="font-semibold">Modo de Demonstração Local Ativo</p>
              <p className="mt-1">
                As variáveis <code className="font-mono">VITE_SUPABASE_URL</code> e{' '}
                <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> ainda não foram
                configuradas no <code className="font-mono">.env</code>. Você pode entrar agora
                para testar todo o painel administrativo localmente.
              </p>
            </div>
          )}

          {errorMsg && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-[#E8D2CE] bg-[#FDF8F7] p-3 text-xs font-medium text-[#B42318]"
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="mb-1.5 block text-xs font-semibold text-[#181615]"
              >
                E-mail Administrativo
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu-email@dominio.com.br"
                className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#181615] focus:border-[#C8A464] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="mb-1.5 block text-xs font-semibold text-[#181615]"
              >
                Senha
              </label>
              <input
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#181615] focus:border-[#C8A464] focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full rounded-lg bg-[#181615] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2E2A27] disabled:opacity-60"
            >
              {submitting ? 'Autenticando...' : 'Entrar no Painel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
