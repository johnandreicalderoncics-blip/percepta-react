import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// Supabase now issues a "publishable" key; older projects use the "anon" key.
// Either works here, and both are safe in the browser (never use a secret/service_role key).
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(supabaseUrl && supabaseKey);

if (!supabaseConfigured) {
  console.error(
    'Missing Supabase config. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY) in .env, then restart the dev server.'
  );
}

// Placeholders keep the app rendering when config is missing; auth calls will then
// fail with a normal error message instead of a blank page.
export const supabase = createClient(
  supabaseUrl || 'http://localhost:54321',
  supabaseKey || 'missing-supabase-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);
