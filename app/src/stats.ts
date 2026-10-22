// Numbers the screens show, derived from the learner's saved progress.

import { TOPICS, type Topic } from './data';
import type { Section } from './content/questions';
import { sectionEstimate, topicStat, totalFromSections } from './progress';
import type { AppState } from './store';

/** Every topic with its live level and accuracy. */
export function topicStats(s: Pick<AppState, 'history' | 'ladders'>): Topic[] {
  return TOPICS.map(t => {
    const { level, acc } = topicStat(t.name, s.history, s.ladders);
    return { ...t, level, acc };
  });
}

export const weakestTopics = (s: Pick<AppState, 'history' | 'ladders'>, n = 3) =>
  topicStats(s).filter(t => t.acc != null).sort((a, b) => a.acc! - b.acc!).slice(0, n);

const SECTIONS: Section[] = ['Quant', 'Verbal', 'Data Insights'];
const OFFICIAL_KEY = { Quant: 'q', Verbal: 'v', 'Data Insights': 'di' } as const;

export interface Estimate {
  total: number | null;
  /** First official exam total, shown as the "Start" marker. */
  base: number | null;
  sections: { name: Section; val: number | null; delta: number | null }[];
  note: string;
}

export function estimate(s: Pick<AppState, 'history' | 'tests' | 'scores' | 'noScores'>): Estimate {
  const scores = s.noScores ? [] : s.scores;
  const official = scores[scores.length - 1];
  const first = scores[0];
  const sections = SECTIONS.map(name => {
    const val = sectionEstimate(name, s.history, s.tests, official);
    return { name, val, delta: val != null && first ? val - first[OFFICIAL_KEY[name]] : null };
  });
  const [q, v, di] = sections.map(x => x.val);
  const total = q != null && v != null && di != null ? totalFromSections(q, v, di) : official ? official.total : null;
  const drills = s.history.length;
  const note = official
    ? `From your last official exam (${official.total})${drills ? ` and ${Math.min(drills, 40)} recent drill answers` : ''}.`
    : total != null
      ? `From ${drills} drill answers and your section tests. Log an official exam to anchor it.`
      : 'Answer at least 5 questions in each section, or log an official exam, to get an estimate.';
  return { total, base: first ? first.total : null, sections, note };
}
