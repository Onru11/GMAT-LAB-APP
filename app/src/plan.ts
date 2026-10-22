// The study plan: which phase the learner is in, and what the daily "focus"
// item should be. Pure functions over saved progress.

import type { Section } from './content/questions';
import { daysBetween, topicStat, type Answer, type Ladder } from './progress';
import { TOPICS } from './data';

export type Phase = 'foundations' | 'timed' | 'peak';

/** Days the plan assumes when no exam is booked. */
export const DEFAULT_RUNWAY = 90;

export function daysToExam(today: string, examDate: string | null): number {
  return examDate ? Math.max(0, daysBetween(today, examDate)) : DEFAULT_RUNWAY;
}

export function phaseFor(days: number): Phase {
  if (days > 42) return 'foundations';
  if (days > 14) return 'timed';
  return 'peak';
}

export const PHASE_COPY: Record<Phase, { name: string; what: string }> = {
  foundations: { name: 'Foundations', what: 'Lessons and topic drills to build every skill. Section tests every couple of weeks.' },
  timed: { name: 'Timed practice', what: 'Mixed sets at exam pace and a section test each week. Fewer new lessons.' },
  peak: { name: 'Peak', what: 'Full section tests and mistake review. No new material in the last two weeks.' },
};

/** Questions per drill for the daily time budget. */
export const drillSize = (dailyMin: number) => (dailyMin >= 60 ? 10 : dailyMin >= 45 ? 8 : dailyMin >= 30 ? 6 : 4);

export type Focus =
  | { kind: 'cr'; n: number }
  | { kind: 'weak'; n: number; topic: string; section: Section }
  | { kind: 'mixed'; n: number }
  | { kind: 'test'; section: 'Quant' | 'Data Insights' };

interface PlanInput {
  day: string;
  examDate: string | null;
  dailyMin: number;
  history: Answer[];
  ladders: Record<string, Ladder>;
  tests: { section: string; day: string }[];
}

/** Weakest practised topic (lowest recent accuracy), if any. */
export function weakestTopic(s: Pick<PlanInput, 'history' | 'ladders'>) {
  const stats = TOPICS.map(t => ({ t, st: topicStat(t.name, s.history, s.ladders) })).filter(x => x.st.acc != null && x.st.answered >= 3);
  stats.sort((a, b) => a.st.acc! - b.st.acc!);
  return stats[0]?.t;
}

/** Days since the last section test, or Infinity. */
const daysSinceTest = (s: PlanInput) => {
  const last = s.tests[s.tests.length - 1];
  return last ? daysBetween(last.day, s.day) : Infinity;
};

/** The section whose latest test is oldest (never tested counts as oldest). */
function staleSection(s: PlanInput): 'Quant' | 'Data Insights' {
  const lastOf = (sec: string) => [...s.tests].reverse().find(t => t.section === sec)?.day ?? '0000-00-00';
  return lastOf('Quant') <= lastOf('Data Insights') ? 'Quant' : 'Data Insights';
}

/**
 * Today's focus item. Rotates by day so the week mixes Critical Reasoning,
 * weakest-topic work and mixed sets, and slots in a section test when one is due
 * for the current phase.
 */
export function todaysFocus(s: PlanInput): Focus {
  const phase = phaseFor(daysToExam(s.day, s.examDate));
  const n = drillSize(s.dailyMin);
  const testEvery = phase === 'foundations' ? 14 : phase === 'timed' ? 7 : 3;
  // Need some history before a test is worth taking.
  if (s.history.length >= 15 && daysSinceTest(s) >= testEvery) return { kind: 'test', section: staleSection(s) };
  const weak = weakestTopic(s);
  const turn = daysBetween('2026-01-01', s.day) % 3;
  if (turn === 0) return { kind: 'cr', n: Math.min(n, 5) };
  if (turn === 1 && weak) return { kind: 'weak', n, topic: weak.name, section: weak.sec };
  return { kind: 'mixed', n };
}

export function focusCopy(f: Focus) {
  switch (f.kind) {
    case 'cr':
      return { title: 'Critical Reasoning set', meta: `${f.n} questions · timed`, min: f.n * 2, verb: 'set', why: 'Daily CR keeps Verbal climbing while Quant foundations build.' };
    case 'weak':
      return { title: `Drill: ${f.topic}`, meta: `${f.n} questions · your weakest topic`, min: f.n * 2, verb: 'drill', why: `${f.topic} has your lowest recent accuracy. Short, focused drills move it fastest.` };
    case 'mixed':
      return { title: 'Mixed set', meta: `${f.n} questions · all sections`, min: f.n * 2, verb: 'set', why: 'Switching between topics is what the exam does. Practise recognising each type fast.' };
    case 'test':
      return { title: `${f.section} section test`, meta: `${f.section === 'Quant' ? 21 : 20} questions · 45 min`, min: 45, verb: 'test', why: 'A timed section test is due. It recalibrates your estimate and shows what to drill next.' };
  }
}

