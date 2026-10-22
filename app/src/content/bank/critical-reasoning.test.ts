import { describe, expect, it } from 'vitest';
import { CRITICAL_REASONING } from './critical-reasoning';
import { CORE_QUESTIONS as QUESTION_LIST } from '../questions';

const TOPICS = ['Assumption', 'Strengthen', 'Weaken', 'Inference', 'Evaluate', 'Paradox'];
const words = (s: string) => s.trim().split(/\s+/).length;
const opening = (s: string) => s.trim().split(/\s+/).slice(0, 4).join(' ').toLowerCase();
const stemText = (q: (typeof CRITICAL_REASONING)[number]) => q.stem.map(p => p.t).join(' ');

describe('critical reasoning bank', () => {
  it('has 30 Verbal CR questions, 5 per topic', () => {
    expect(CRITICAL_REASONING).toHaveLength(30);
    for (const t of TOPICS) {
      expect(CRITICAL_REASONING.filter(q => q.topic === t), t).toHaveLength(5);
    }
    for (const q of CRITICAL_REASONING) {
      expect(q.section, q.id).toBe('Verbal');
      expect(q.kind, q.id).toBe('Critical reasoning');
      expect(TOPICS, q.id).toContain(q.topic);
    }
  });

  it('uses levels 1, 2, 3, 3, 4 in every topic', () => {
    for (const t of TOPICS) {
      const levels = CRITICAL_REASONING.filter(q => q.topic === t).map(q => q.level).sort();
      expect(levels, t).toEqual([1, 2, 3, 3, 4]);
    }
  });

  it('has unique cr- ids that do not clash with the main bank', () => {
    const ids = CRITICAL_REASONING.map(q => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    const existing = new Set(QUESTION_LIST.map(q => q.id));
    for (const id of ids) {
      expect(id).toMatch(/^cr-/);
      expect(existing.has(id), id).toBe(false);
    }
  });

  it('has 5 distinct choices, a valid answer and level', () => {
    for (const q of CRITICAL_REASONING) {
      expect(q.choices, q.id).toHaveLength(5);
      expect(new Set(q.choices).size, q.id).toBe(5);
      expect(Number.isInteger(q.ans) && q.ans >= 0 && q.ans <= 4, q.id).toBe(true);
      expect(Number.isInteger(q.level) && q.level >= 0 && q.level <= 4, q.id).toBe(true);
      expect(q.steps.length, q.id).toBeGreaterThanOrEqual(2);
      expect(q.steps.length, q.id).toBeLessThanOrEqual(3);
      expect(q.fast.length, q.id).toBeGreaterThan(0);
      expect(q.alt.length, q.id).toBeGreaterThan(0);
    }
  });

  it('keeps passages between 45 and 110 words', () => {
    for (const q of CRITICAL_REASONING) {
      const n = words(q.passage ?? '');
      expect(n, `${q.id}: ${n} words`).toBeGreaterThanOrEqual(45);
      expect(n, `${q.id}: ${n} words`).toBeLessThanOrEqual(110);
    }
  });

  it('never opens two passages with the same four words', () => {
    const others = QUESTION_LIST.filter(q => q.passage).map(q => opening(q.passage!));
    const mine = CRITICAL_REASONING.map(q => opening(q.passage ?? ''));
    expect(new Set(mine).size).toBe(mine.length);
    for (const o of mine) expect(others, o).not.toContain(o);
  });

  it('uses no answer letter more than twice within a topic', () => {
    for (const t of TOPICS) {
      const counts = [0, 0, 0, 0, 0];
      for (const q of CRITICAL_REASONING.filter(x => x.topic === t)) counts[q.ans]++;
      expect(Math.max(...counts), `${t}: ${counts.join(',')}`).toBeLessThanOrEqual(2);
    }
  });

  it('has at most 2 EXCEPT stems', () => {
    expect(CRITICAL_REASONING.filter(q => stemText(q).includes('EXCEPT')).length).toBeLessThanOrEqual(2);
  });
});
