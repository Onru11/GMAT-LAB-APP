import { describe, expect, it } from 'vitest';
import { READING_COMPREHENSION } from './reading-comprehension';
import { CORE_QUESTIONS as QUESTION_LIST } from '../questions';

const words = (s: string) => s.trim().split(/\s+/).length;

describe('Reading Comprehension bank', () => {
  it('has 24 questions on 6 distinct passages, 4 per passage', () => {
    expect(READING_COMPREHENSION).toHaveLength(24);
    const counts = new Map<string, number>();
    for (const q of READING_COMPREHENSION) {
      expect(q.passage, q.id).toBeTruthy();
      counts.set(q.passage!, (counts.get(q.passage!) ?? 0) + 1);
    }
    expect(counts.size).toBe(6);
    for (const n of counts.values()) expect(n).toBe(4);
  });

  it('keeps passages at 180–300 words in 2–3 paragraphs', () => {
    for (const p of new Set(READING_COMPREHENSION.map(q => q.passage!))) {
      const w = words(p);
      expect(w, p.slice(0, 40)).toBeGreaterThanOrEqual(180);
      expect(w, p.slice(0, 40)).toBeLessThanOrEqual(300);
      const paras = p.split('\n\n');
      expect(paras.length, p.slice(0, 40)).toBeGreaterThanOrEqual(2);
      expect(paras.length, p.slice(0, 40)).toBeLessThanOrEqual(3);
      for (const para of paras) expect(para.trim().length).toBeGreaterThan(0);
    }
  });

  it('has unique ids, also across the main bank', () => {
    const ids = READING_COMPREHENSION.map(q => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    const existing = new Set(QUESTION_LIST.map(q => q.id));
    for (const id of ids) {
      expect(existing.has(id), id).toBe(false);
      expect(id).toMatch(/^rc-[a-z0-9-]+-\d$/);
    }
  });

  it('has well-formed questions', () => {
    for (const q of READING_COMPREHENSION) {
      expect(q.topic, q.id).toBe('Reading Comprehension');
      expect(q.section, q.id).toBe('Verbal');
      expect(q.kind, q.id).toBe('Reading comprehension');
      expect(q.choices, q.id).toHaveLength(5);
      expect(new Set(q.choices).size, q.id).toBe(5);
      expect(Number.isInteger(q.ans), q.id).toBe(true);
      expect(q.ans, q.id).toBeGreaterThanOrEqual(0);
      expect(q.ans, q.id).toBeLessThanOrEqual(4);
      expect(q.level, q.id).toBeGreaterThanOrEqual(0);
      expect(q.level, q.id).toBeLessThanOrEqual(4);
      expect(q.steps.length, q.id).toBeGreaterThanOrEqual(2);
      expect(q.fast.length, q.id).toBeGreaterThan(0);
      expect(q.alt.length, q.id).toBeGreaterThan(0);
    }
  });

  it('spreads answer letters: each used 3–7 times', () => {
    const counts = [0, 0, 0, 0, 0];
    for (const q of READING_COMPREHENSION) counts[q.ans]++;
    for (const c of counts) {
      expect(c).toBeGreaterThanOrEqual(3);
      expect(c).toBeLessThanOrEqual(7);
    }
  });
});
