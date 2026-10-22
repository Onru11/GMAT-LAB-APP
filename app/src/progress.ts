// Learner-progress rules: topic levels, adaptive picking, spaced repetition for
// mistakes and flashcards, and the score estimate. Pure functions over plain
// data, no React or storage, so every rule here is unit-tested.

import { QUESTIONS, QUESTION_LIST, type Question, type Section } from './content/questions';
import { sectionScore, seededShuffle } from './content/select';

/** Spacing ladder shared by mistakes and flashcards: box 0 → 1 day … box 3 → 14 days. */
export const INTERVALS = [1, 3, 7, 14];

// ── Dates (local calendar days as YYYY-MM-DD) ──

const parse = (day: string) => {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const key = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const addDays = (day: string, n: number) => {
  const d = parse(day);
  d.setDate(d.getDate() + n);
  return key(d);
};
export const daysBetween = (from: string, to: string) => Math.round((parse(to).getTime() - parse(from).getTime()) / 86_400_000);

// ── Answer history ──

export interface Answer {
  qid: string;
  ok: boolean;
  sec: number;
  day: string;
}
export const HISTORY_CAP = 3000;
export const pushHistory = (history: Answer[], a: Answer) => [...history, a].slice(-HISTORY_CAP);

// ── Topic levels ──

/**
 * Per-topic difficulty ladder, 0 Foundation … 4 Elite. Three right in a row
 * moves up a level; two wrong in a row moves down one.
 */
export interface Ladder {
  level: number;
  right: number;
  wrong: number;
}
export const UP_AFTER = 3;
export const DOWN_AFTER = 2;
const START: Ladder = { level: 0, right: 0, wrong: 0 };

export function climb(l: Ladder = START, ok: boolean): Ladder {
  if (ok) {
    const right = l.right + 1;
    return right >= UP_AFTER && l.level < 4 ? { level: l.level + 1, right: 0, wrong: 0 } : { level: l.level, right: Math.min(right, UP_AFTER), wrong: 0 };
  }
  const wrong = l.wrong + 1;
  return wrong >= DOWN_AFTER && l.level > 0 ? { level: l.level - 1, right: 0, wrong: 0 } : { level: l.level, right: 0, wrong: Math.min(wrong, DOWN_AFTER) };
}

export interface TopicStat {
  /** -1 until the topic has been practised. */
  level: number;
  /** Accuracy over the last 20 answers, as a whole percent; null if none. */
  acc: number | null;
  answered: number;
}

export function topicStat(topic: string, history: Answer[], ladders: Record<string, Ladder>): TopicStat {
  const mine = history.filter(a => QUESTIONS[a.qid]?.topic === topic);
  const recent = mine.slice(-20);
  return {
    level: mine.length ? (ladders[topic]?.level ?? 0) : -1,
    acc: recent.length ? Math.round((100 * recent.filter(a => a.ok).length) / recent.length) : null,
    answered: mine.length,
  };
}

// ── Adaptive picking ──

/** The question in `pool` closest to `level`, preferring ones not in `avoid`. */
export function pickNearest(pool: Question[], level: number, avoid: Set<string>, seed: number): Question | undefined {
  const ranked = seededShuffle(pool, seed).sort((a, b) => {
    const fresh = Number(avoid.has(a.id)) - Number(avoid.has(b.id));
    return fresh || Math.abs(a.level - level) - Math.abs(b.level - level);
  });
  return ranked[0];
}

/** A drill of up to n questions around the learner's level, skipping recent ones where possible. */
export function adaptiveDrill(pool: Question[], level: number, recent: Set<string>, seed: number, n = 6): string[] {
  const picked: string[] = [];
  let rest = [...pool];
  while (picked.length < n && rest.length) {
    const q = pickNearest(rest, level, recent, seed + picked.length)!;
    picked.push(q.id);
    rest = rest.filter(x => x.id !== q.id);
  }
  return picked;
}

/** Test difficulty walk: start at level 1, step up after a right answer and down after a wrong one. */
export function testLevel(results: boolean[]): number {
  return results.reduce((lvl, ok) => Math.max(0, Math.min(4, lvl + (ok ? 1 : -1))), 1);
}

export function nextTestQuestion(section: Section, asked: string[], results: boolean[], seed: number): string | undefined {
  const pool = QUESTION_LIST.filter(q => q.section === section && !asked.includes(q.id));
  return pickNearest(pool, testLevel(results), new Set(), seed + asked.length)?.id;
}

// ── Mistakes ──

export interface Mistake {
  topic: string;
  title: string;
  reason: string;
  /** Clean reviews so far, 0–3; four clears it. */
  box: number;
  /** Day it is next due. */
  next: string;
  qid: string;
}

/** Result of reviewing a due mistake: rescheduled, or null when cleared. */
export function reviewMistake(m: Mistake, ok: boolean, today: string): Mistake | null {
  if (!ok) return { ...m, box: 0, next: addDays(today, INTERVALS[0]) };
  if (m.box >= 3) return null;
  return { ...m, box: m.box + 1, next: addDays(today, INTERVALS[m.box + 1]) };
}

export const isDue = (next: string, today: string) => next <= today;

// ── Flashcards ──

export interface CardState {
  box: number;
  next: string;
  /** Last day it was graded. */
  last: string;
}
export const cardKey = (deck: string, front: string) => `${deck}|${front}`;

export function gradeCard(state: CardState | undefined, known: boolean, today: string): CardState {
  const box = known ? Math.min(3, (state ? state.box : -1) + 1) : 0;
  return { box, next: addDays(today, INTERVALS[box]), last: today };
}

/** Days until a card comes back after "Got it". */
export const knownInterval = (state: CardState | undefined) => INTERVALS[Math.min(3, (state ? state.box : -1) + 1)];

// ── Score estimate ──

export interface OfficialScore {
  total: number;
  q: number;
  v: number;
  di: number;
}
export interface TestScore {
  section: Section;
  score: number;
}

const OFFICIAL_KEY = { Quant: 'q', Verbal: 'v', 'Data Insights': 'di' } as const;

/**
 * Section estimate on 60–90: the average of whatever evidence exists among
 * recent drill answers (at least 5), the latest section test and the latest
 * official exam. Null when there is none.
 */
export function sectionEstimate(section: Section, history: Answer[], tests: TestScore[], official?: OfficialScore): number | null {
  const sources: number[] = [];
  const drills = history.filter(a => QUESTIONS[a.qid]?.section === section).slice(-40);
  if (drills.length >= 5) sources.push(sectionScore(drills.map(a => ({ qid: a.qid, sel: 0, ok: a.ok, sec: a.sec }))));
  const test = [...tests].reverse().find(t => t.section === section);
  if (test) sources.push(test.score);
  if (official) sources.push(official[OFFICIAL_KEY[section]]);
  return sources.length ? Math.round(sources.reduce((s, x) => s + x, 0) / sources.length) : null;
}

/** Total on the 205–805 scale from three section scores, rounded to the exam's steps of 5 (ending in 5). */
export function totalFromSections(q: number, v: number, di: number): number {
  const raw = 205 + ((q + v + di - 180) * 600) / 90;
  return Math.max(205, Math.min(805, Math.round((raw - 5) / 10) * 10 + 5));
}
