import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * CONEXÃO COM O SUPABASE
 * Utilize as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
 * definidas no arquivo .env (local) ou no painel da Vercel (produção).
 *
 * NUNCA coloque a service_role key no frontend.
 */

const DEFAULT_SUPABASE_URL = 'https://tnvhmfybdvnnbodhscyl.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRudmhtZnliZHZubmJvZGhzY3lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMzAzMjcsImV4cCI6MjEwNjgwNjMyN30.B9GbKw7S50BJ7VJj9jSKVtrhdv_JiM8x1WE0ug5c5yc';

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) || DEFAULT_SUPABASE_URL;
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || DEFAULT_SUPABASE_ANON_KEY;

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
