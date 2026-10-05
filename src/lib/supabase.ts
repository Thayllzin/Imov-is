import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * CONEXÃO COM O SUPABASE
 * Utilize as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
 * definidas no arquivo .env (local) ou no painel da Vercel (produção).
 *
 * NUNCA coloque a service_role key no frontend.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const STORAGE_BUCKET = 'property-images';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://seu-projeto.supabase.co' &&
    supabaseAnonKey !== 'sua-chave-anon-publica-aqui' &&
    supabaseUrl.startsWith('http')
);

// Inicializa o cliente Supabase apenas se as variáveis estiverem configuradas,
// ou cria um cliente placeholder seguro para evitar falhas de importação antes de configurar o .env
export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createClient('https://placeholder-project.supabase.co', 'placeholder-anon-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
