// Saves the learner's progress in localStorage so a reload or a new day picks up
// where they left off. Only durable data is stored; screen state (current route,
// open question, typed input) always starts fresh.

import type { AppState } from './store';

const KEY = 'gmatlab.progress';
const VERSION = 1;

export const PERSISTED = [
  'target', 'day', 'lastFullDay', 'queue', 'streak', 'inRow', 'boxes', 'mistakes', 'scores',
  'openPhase', 'lvl', 'progSec',
] as const satisfies readonly (keyof AppState)[];

export type Persisted = Pick<AppState, (typeof PERSISTED)[number]>;

/** Local calendar day as YYYY-MM-DD. */
export function dayKey(d = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function previousDay(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d - 1));
}

export function loadProgress(): Partial<Persisted> | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { v?: number; data?: Partial<Persisted> };
    return parsed.v === VERSION && parsed.data ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveProgress(s: AppState) {
  const data = Object.fromEntries(PERSISTED.map(k => [k, s[k]]));
  try {
    localStorage.setItem(KEY, JSON.stringify({ v: VERSION, data }));
  } catch {
    /* storage full or unavailable: progress lives for this session only */
  }
}

export function clearProgress() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* storage unavailable */
  }
}

/**
 * Bring saved progress up to `today`: a new day gets a fresh queue, and the
 * streak survives only if the last fully completed day was today or yesterday.
 */
export function rollOver<T extends Pick<AppState, 'day' | 'lastFullDay' | 'queue' | 'streak'>>(s: T, today = dayKey()): T {
  if (s.day === today) return s;
  const alive = s.lastFullDay === today || s.lastFullDay === previousDay(today);
  return { ...s, day: today, queue: s.queue.map(() => false), streak: alive ? s.streak : 0 };
}
