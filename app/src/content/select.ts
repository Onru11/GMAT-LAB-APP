// Picking questions for drills and tests, and scoring finished tests.
// Pure functions: no React, no storage, so they can be unit-tested.

import { QUESTIONS, QUESTION_LIST } from './bank';
import type { Question, Section } from './questions';

export interface TestDef {
  section: Exclude<Section, 'Verbal'>;
  length: number;
  minutes: number;
}

export const TESTS: Record<TestDef['section'], TestDef> = {
  Quant: { section: 'Quant', length: 21, minutes: 45 },
  'Data Insights': { section: 'Data Insights', length: 20, minutes: 45 },
};

export interface AnswerRecord {
  qid: string;
  sel: number;
  ok: boolean;
  sec: number;
}

export interface TestResult {
  section: TestDef['section'];
  /** Display date, e.g. "Oct 22". */
  date: string;
  day: string;
  score: number;
  right: number;
  total: number;
  seconds: number;
  over: number;
  byTopic: [topic: string, right: number, of: number][];
  /** Questions left unanswered when time ran out. */
  unanswered: number;
  /** The final answers, for reviewing the test afterwards. */
  answers: AnswerRecord[];
}

/** Weight of an unanswered question: the real exam penalises an unfinished section. */
const MISSING_WEIGHT = 3;

/** Shuffle with a seed so a given seed always yields the same order. */
export function seededShuffle<T>(items: T[], seed: number): T[] {
  const out = [...items];
  let s = seed >>> 0 || 1;
  const rand = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Critical Reasoning set for the daily queue. */
export function crSet(n: number, seed: number): string[] {
  return seededShuffle(QUESTION_LIST.filter(q => q.kind === 'Critical reasoning'), seed).slice(0, n).map(q => q.id);
}

/**
 * Section score on the 60–90 scale. Harder questions weigh more, so getting
 * the hard ones right moves the score more than the easy ones.
 */
export function sectionScore(answers: AnswerRecord[], unanswered = 0): number {
  if (!answers.length && !unanswered) return 60;
  let got = 0;
  let max = unanswered * MISSING_WEIGHT;
  for (const a of answers) {
    const w = QUESTIONS[a.qid].level + 1;
    max += w;
    if (a.ok) got += w;
  }
  return Math.round(60 + (30 * got) / max);
}

export function scoreTest(section: TestDef['section'], answers: AnswerRecord[], date: Date, day: string, unanswered = 0): TestResult {
  const topics = new Map<string, [number, number]>();
  for (const a of answers) {
    const t = QUESTIONS[a.qid].topic;
    const [r, n] = topics.get(t) ?? [0, 0];
    topics.set(t, [r + (a.ok ? 1 : 0), n + 1]);
  }
  return {
    section,
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    day,
    score: sectionScore(answers, unanswered),
    right: answers.filter(a => a.ok).length,
    total: answers.length,
    seconds: answers.reduce((s, a) => s + a.sec, 0),
    over: answers.filter(a => a.sec > 120).length,
    byTopic: [...topics].map(([t, [r, n]]) => [t, r, n] as [string, number, number]).sort((x, y) => x[1] / x[2] - y[1] / y[2]),
    unanswered,
    answers,
  };
}

/** Short label for a question in the Mistakes list. */
export function questionTitle(q: Question): string {
  const stem = q.stem.map(p => p.t + (p.s ? toSuperscript(p.s) : '')).join('');
  return stem.length > 52 ? stem.slice(0, 50).trimEnd() + '…' : stem;
}

const SUP: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '−': '⁻', '-': '⁻', x: 'ˣ' };
const toSuperscript = (s: string) => [...s].map(c => SUP[c] ?? c).join('');
