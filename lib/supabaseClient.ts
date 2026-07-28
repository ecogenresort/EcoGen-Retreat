import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

if ((!SUPABASE_URL || !SUPABASE_ANON_KEY) && import.meta.env.DEV) {
  console.warn(
    'VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set. The admin dashboard and Supabase sync will not work. See .env.example.'
  );
}

// Falls back to placeholder values so createClient doesn't throw when the
// env vars are unset in dev — calls will fail at request time instead, which
// the dual-write call sites already treat as best-effort.
export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder-anon-key'
);
