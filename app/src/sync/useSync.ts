import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { PERSISTED, parseProgress, serializeProgress } from '../persist';
import type { Actions, AppState } from '../store';
import { mergeProgress } from './merge';
import { currentSession, onSessionChange, pullProgress, pushProgress, sendSignIn, signOut, syncConfigured, verifyCode } from './cloud';

export type SyncStatus = 'off' | 'signed-out' | 'syncing' | 'synced' | 'offline' | 'error';

export interface SyncApi {
  configured: boolean;
  status: SyncStatus;
  email: string | null;
  lastSynced: number | null;
  error: string | null;
  sendSignIn: (email: string) => Promise<void>;
  verifyCode: (email: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
  syncNow: () => void;
}

export const SyncContext = createContext<SyncApi | null>(null);
export const useSyncApi = () => useContext(SyncContext)!;

const DEBOUNCE_MS = 4000;
const INTERVAL_MS = 120_000;

const canon = (x: unknown) => JSON.stringify(x);

/**
 * Keeps local progress and the cloud copy in step: pull, merge, apply locally
 * if anything new arrived, push if the cloud is behind. Runs on sign-in, when
 * the app regains focus or comes back online, shortly after any progress
 * change, and every couple of minutes.
 */
export function useSync(s: AppState, a: Actions): SyncApi {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<SyncStatus>(syncConfigured ? 'signed-out' : 'off');
  const [lastSynced, setLastSynced] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const latest = useRef(s);
  latest.current = s;
  const running = useRef(false);

  useEffect(() => {
    if (!syncConfigured) return;
    currentSession().then(setSession);
    return onSessionChange(setSession);
  }, []);

  const syncNow = useCallback(async () => {
    const user = session?.user;
    if (!user || running.current) return;
    if (!navigator.onLine) return setStatus('offline');
    running.current = true;
    setStatus('syncing');
    try {
      const local = (JSON.parse(serializeProgress(latest.current)) as { data: Record<string, unknown> }).data;
      const raw = await pullProgress(user.id);
      const remote = raw ? parseProgress(JSON.stringify(raw)) : null;
      const merged = remote ? mergeProgress(local, remote) : mergeProgress(local, local);
      const localView = Object.fromEntries(Object.keys(merged).map(k => [k, local[k]]));
      if (canon(merged) !== canon(localView)) a.applySynced(merged as Partial<AppState>);
      if (!remote || canon(merged) !== canon(mergeProgress(remote, remote))) {
        const blob = JSON.parse(serializeProgress({ ...latest.current, ...(merged as Partial<AppState>) }));
        await pushProgress(user.id, blob);
      }
      setLastSynced(Date.now());
      setError(null);
      setStatus('synced');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus(navigator.onLine ? 'error' : 'offline');
    } finally {
      running.current = false;
    }
  }, [session, a]);

  // Sign-in state and the triggers.
  useEffect(() => {
    if (!syncConfigured) return;
    if (!session) return setStatus('signed-out');
    syncNow();
    const onFocus = () => document.visibilityState === 'visible' && syncNow();
    window.addEventListener('focus', onFocus);
    window.addEventListener('online', syncNow);
    document.addEventListener('visibilitychange', onFocus);
    const t = setInterval(syncNow, INTERVAL_MS);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('online', syncNow);
      document.removeEventListener('visibilitychange', onFocus);
      clearInterval(t);
    };
  }, [session, syncNow]);

  // Shortly after saved progress changes.
  const fingerprint = PERSISTED.map(k => s[k]);
  useEffect(() => {
    if (!session) return;
    const t = setTimeout(syncNow, DEBOUNCE_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, fingerprint);

  return {
    configured: syncConfigured,
    status,
    email: session?.user.email ?? null,
    lastSynced,
    error,
    sendSignIn,
    verifyCode,
    signOut: async () => {
      await signOut();
      setSession(null);
    },
    syncNow,
  };
}
