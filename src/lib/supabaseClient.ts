import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://placeholder.supabase.co'
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'placeholder-anon-key'

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    '[Baseline] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set. ' +
    'Auth and data features will not work. Copy .env.example to .env.local and fill in your Supabase project values.'
  )
}

// The anon key is intentionally public — Supabase Row Level Security
// enforces all data access boundaries. The service role key must NEVER
// appear in browser code.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // Supabase stores session tokens in localStorage by default.
    // Do NOT manually store profile data or personal information in localStorage.
  },
})
