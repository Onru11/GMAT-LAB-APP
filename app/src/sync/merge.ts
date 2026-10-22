// Combining two devices' progress without losing work on either. Every rule is
// commutative (merge(a, b) equals merge(b, a)) and idempotent, so devices that
// sync in any order converge on the same state.

import type { Persisted } from '../persist';
import type { Answer, CardState, Ladder, Mistake } from '../progress';
import type { Score } from '../data';
import type { TestResult } from '../content/select';

type P = Partial<Persisted>;

/** Union of two lists where an item may legitimately repeat: keep max(count in a, count in b) of each key. */
export function multisetUnion<T>(a: T[] = [], b: T[] = [], key: (x: T) => string): T[] {
  const inA = new Map<string, number>();
  for (const x of a) inA.set(key(x), (inA.get(key(x)) ?? 0) + 1);
  const out: T[] = [...a];
  const seenB = new Map<string, number>();
  for (const x of b) {
    const k = key(x);
    seenB.set(k, (seenB.get(k) ?? 0) + 1);
    if (seenB.get(k)! > (inA.get(k) ?? 0)) out.push(x);
  }
  // Sort by key so both merge orders produce identical lists.
  return out.sort((x, y) => (key(x) < key(y) ? -1 : key(x) > key(y) ? 1 : 0));
}

/** Per-key pick: keep whichever entry `newer` prefers. */
function pickPerKey<T>(a: Record<string, T> = {}, b: Record<string, T> = {}, newer: (x: T, y: T) => T): Record<string, T> {
  const out: Record<string, T> = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = k in out ? newer(out[k], v) : v;
  return Object.fromEntries(Object.keys(out).sort().map(k => [k, out[k]]));
}

const later = <T extends { at?: number }>(x: T, y: T, tie: (x: T, y: T) => T) =>
  (x.at ?? 0) > (y.at ?? 0) ? x : (y.at ?? 0) > (x.at ?? 0) ? y : tie(x, y);

const answerKey = (a: Answer) => (a.t ? `${a.day}|${a.t}|${a.qid}` : `${a.day}|0|${a.qid}|${a.sec}|${+a.ok}`);
const testKey = (t: TestResult) => `${t.day}|${t.section}|${t.seconds}|${t.score}|${t.right}`;
const scoreKey = (s: Score) => `${s.date}|${s.total}|${s.q}|${s.v}|${s.di}`;

export interface Cleared {
  qid: string;
  day: string;
  at: number;
}

export function mergeProgress(a: P, b: P, historyCap = 3000): P {
  const cleared = multisetUnion<Cleared>(a.cleared, b.cleared, c => `${c.day}|${c.at}|${c.qid}`);
  const clearedAt = new Map<string, number>();
  for (const c of cleared) if (c.qid) clearedAt.set(c.qid, Math.max(clearedAt.get(c.qid) ?? 0, c.at));

  // Mistakes: newest change wins per question; a clear newer than the mistake removes it.
  const byQ = pickPerKey(
    Object.fromEntries((a.mistakes ?? []).map(m => [m.qid, m])),
    Object.fromEntries((b.mistakes ?? []).map(m => [m.qid, m])),
    (x: Mistake, y: Mistake) => later(x, y, (p, q) => (p.next >= q.next ? p : q)),
  );
  const mistakes = Object.values(byQ).filter(m => !clearedAt.has(m.qid) || clearedAt.get(m.qid)! < (m.at ?? 0));

  // Settings travel together; the later edit wins (ties: the higher target, so the order of merging doesn't matter).
  const settingsFrom = (a.settingsAt ?? 0) !== (b.settingsAt ?? 0) ? ((a.settingsAt ?? 0) > (b.settingsAt ?? 0) ? a : b) : (a.target ?? 0) >= (b.target ?? 0) ? a : b;

  // Daily queue: same day → anything done on either device is done; otherwise the later day.
  const day = [a.day, b.day].filter(Boolean).sort().pop();
  const qa = a.day === day ? a.queue : undefined;
  const qb = b.day === day ? b.queue : undefined;
  const queue = qa && qb ? qa.map((x, i) => x || qb[i]) : (qa ?? qb);

  // Streak belongs to whichever device saw the later completed day.
  const lfA = a.lastFullDay ?? '';
  const lfB = b.lastFullDay ?? '';
  const streak = lfA === lfB ? Math.max(a.streak ?? 0, b.streak ?? 0) : lfA > lfB ? (a.streak ?? 0) : (b.streak ?? 0);
  const lastFullDay = (lfA > lfB ? lfA : lfB) || null;

  const history = multisetUnion<Answer>(a.history, b.history, answerKey)
    .sort((x, y) => (x.day < y.day ? -1 : x.day > y.day ? 1 : (x.t ?? 0) - (y.t ?? 0)))
    .slice(-historyCap);

  const bests = [a.sprintBest, b.sprintBest].filter((x): x is number => x != null);

  return {
    target: settingsFrom.target,
    examDate: settingsFrom.examDate ?? null,
    dailyMin: settingsFrom.dailyMin,
    settingsAt: settingsFrom.settingsAt ?? 0,
    onboarded: !!(a.onboarded || b.onboarded),
    lessonsDone: [...new Set([...(a.lessonsDone ?? []), ...(b.lessonsDone ?? [])])].sort(),
    day,
    queue,
    lastFullDay,
    streak,
    history,
    tests: multisetUnion<TestResult>(a.tests, b.tests, testKey).sort((x, y) => (x.day < y.day ? -1 : x.day > y.day ? 1 : 0)),
    scores: multisetUnion<Score>(a.scores, b.scores, scoreKey),
    mistakes: mistakes.sort((x, y) => (x.next < y.next ? -1 : x.next > y.next ? 1 : x.qid < y.qid ? -1 : 1)),
    cleared,
    ladders: pickPerKey<Ladder>(a.ladders, b.ladders, (x, y) => later(x, y, (p, q) => (p.level >= q.level ? p : q))),
    cards: pickPerKey<CardState>(a.cards, b.cards, (x, y) => later(x, y, (p, q) => (p.last > q.last ? p : q.last > p.last ? q : p.box >= q.box ? p : q))),
    sprintBest: bests.length ? Math.min(...bests) : null,
    // No timestamp on the last run; the larger time is a symmetric, conservative choice.
    sprintLast: a.sprintLast == null ? (b.sprintLast ?? null) : b.sprintLast == null ? a.sprintLast : Math.max(a.sprintLast, b.sprintLast),
    sprintFacts: multisetUnion<[string, string]>(
      a.sprintFacts?.filter((f, i, xs) => xs.findIndex(g => g[0] === f[0]) === i),
      b.sprintFacts?.filter((f, i, xs) => xs.findIndex(g => g[0] === f[0]) === i),
      f => f[0],
    ),
  };
}
