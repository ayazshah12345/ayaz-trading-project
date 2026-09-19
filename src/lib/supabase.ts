import { createClient } from '@supabase/supabase-js';

// Verified project connection credentials (fallback for Vercel production builds)
const FALLBACK_SUPABASE_URL = 'https://pzdsiqqxuvogvvvbjhtq.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6ZHNpcXF4dXZvZ3Z2dmJqaHRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3MDIxMTQsImV4cCI6MjEwNDI3ODExNH0.q3p3mJwpmcpR_b3u9SRWoYjiDH5T-lUBXYRgXYwnqUE';

// Sanitize URL (strip wrapping quotes, whitespace, trailing slashes, or /rest/v1)
let rawUrl = (import.meta.env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL).trim();
rawUrl = rawUrl.replace(/^["']|["']$/g, '').replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');

// Sanitize Anon Key
let rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY).trim();
rawKey = rawKey.replace(/^["']|["']$/g, '');

export const supabaseUrl = rawUrl;
export const supabaseAnonKey = rawKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseAnonKey.includes('PASTE_YOUR')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

