// Saves the learner's progress in localStorage so a reload or a new day picks up
// where they left off. Only durable data is stored; screen state (current route,
// open question, typed input) always starts fresh.

import type { AppState } from './store';

const KEY = 'gmatlab.progress';
const VERSION = 2;

export const PERSISTED = [
  'target', 'examDate', 'dailyMin', 'onboarded', 'lessonsDone', 'day', 'lastFullDay', 'queue', 'streak', 'inRow', 'mistakes', 'scores', 'tests',
  'history', 'ladders', 'cards', 'cleared', 'sprintBest', 'sprintLast', 'sprintFacts',
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
    return raw ? parseProgress(raw) : null;
  } catch {
    return null;
  }
}

/** Read a saved or exported progress blob; null if it isn't one. */
export function parseProgress(raw: string): Partial<Persisted> | null {
  try {
    const parsed = JSON.parse(raw) as { v?: number; data?: Record<string, unknown> };
    if (!parsed.data) return null;
    if (parsed.v === VERSION) return parsed.data as Partial<Persisted>;
    if (parsed.v === 1) return migrateV1(parsed.data);
    return null;
  } catch {
    return null;
  }
}

/** v1 stored mistakes with a due flag and question indexes; keep the queue, streak and scores. */
function migrateV1(data: Record<string, unknown>): Partial<Persisted> {
  const { mistakes: _m, boxes: _b, ...rest } = data;
  return rest as Partial<Persisted>;
}

/** The saved form of the learner's progress, also used for backup files. */
export function serializeProgress(s: AppState): string {
  return JSON.stringify({ v: VERSION, app: 'gmat-lab', data: Object.fromEntries(PERSISTED.map(k => [k, s[k]])) });
}

export function saveProgress(s: AppState) {
  try {
    localStorage.setItem(KEY, serializeProgress(s));
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
