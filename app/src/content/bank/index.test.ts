import { describe, expect, it } from 'vitest';
import { TOPICS } from '../../data';
import { QUESTION_LIST } from './index';

describe('full bank', () => {
  it('has unique ids across every file', () => {
    expect(new Set(QUESTION_LIST.map(q => q.id)).size).toBe(QUESTION_LIST.length);
  });

  it('gives every topic questions, and Quant/DI enough for adaptive tests at every level', () => {
    for (const t of TOPICS) expect(QUESTION_LIST.some(q => q.topic === t.name), t.name).toBe(true);
    for (const section of ['Quant', 'Data Insights'] as const)
      for (let level = 0; level <= 4; level++)
        expect(QUESTION_LIST.filter(q => q.section === section && q.level === level).length, `${section} L${level}`).toBeGreaterThanOrEqual(3);
  });
});
