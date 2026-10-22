/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL; sync is off when unset. */
  readonly VITE_SUPABASE_URL?: string;
  /** Supabase anon (public) key. Safe in the browser: row-level security limits each user to their own row. */
  readonly VITE_SUPABASE_ANON_KEY?: string;
}
