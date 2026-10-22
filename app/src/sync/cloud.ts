// Supabase access: email sign-in and one progress row per user.
// The table and its row-level-security policies are in /supabase/schema.sql.

import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const syncConfigured = Boolean(url && key);

let client: SupabaseClient | null = null;
function cloud(): SupabaseClient {
  if (!syncConfigured) throw new Error('Sync is not configured');
  return (client ??= createClient(url!, key!, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }));
}

export async function currentSession(): Promise<Session | null> {
  if (!syncConfigured) return null;
  const { data } = await cloud().auth.getSession();
  return data.session;
}

export function onSessionChange(cb: (s: Session | null) => void): () => void {
  if (!syncConfigured) return () => {};
  const { data } = cloud().auth.onAuthStateChange((_event, session) => cb(session));
  return () => data.subscription.unsubscribe();
}

/** Email a sign-in link and a 6-digit code (the code works inside the installed app). */
export async function sendSignIn(email: string) {
  const { error } = await cloud().auth.signInWithOtp({
    email,
    options: { emailRedirectTo: location.origin + import.meta.env.BASE_URL, shouldCreateUser: true },
  });
  if (error) throw error;
}

export async function verifyCode(email: string, token: string) {
  const { error } = await cloud().auth.verifyOtp({ email, token, type: 'email' });
  if (error) throw error;
}

/** Create an account with a password. Returns true if the project wants the email confirmed first. */
export async function signUpWithPassword(email: string, password: string): Promise<boolean> {
  const { data, error } = await cloud().auth.signUp({ email, password, options: { emailRedirectTo: location.origin + import.meta.env.BASE_URL } });
  if (error) throw error;
  return !data.session;
}

export async function signInWithPassword(email: string, password: string) {
  const { error } = await cloud().auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOut() {
  await cloud().auth.signOut();
}

/** The saved progress blob for this user, or null if they have never synced. */
export async function pullProgress(userId: string): Promise<unknown | null> {
  const { data, error } = await cloud().from('progress').select('data').eq('user_id', userId).maybeSingle();
  if (error) throw error;
  return data?.data ?? null;
}

export async function pushProgress(userId: string, blob: unknown) {
  const { error } = await cloud().from('progress').upsert({ user_id: userId, data: blob, updated_at: new Date().toISOString() });
  if (error) throw error;
}
