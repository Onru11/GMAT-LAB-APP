import { describe, expect, it } from 'vitest';
import { QUESTIONS } from './questions';
import { TESTS, buildTest, crSet, mixedDrill, scoreTest, sectionScore, topicDrill } from './select';

describe('question selection', () => {
  it('builds full-length tests from the right section, no repeats', () => {
    for (const section of ['Quant', 'Data Insights'] as const) {
      const ids = buildTest(section, 20261022);
      expect(ids).toHaveLength(TESTS[section].length);
      expect(new Set(ids).size).toBe(ids.length);
      expect(ids.every(id => QUESTIONS[id].section === section)).toBe(true);
    }
  });

  it('is deterministic for a seed and varies across seeds', () => {
    expect(buildTest('Quant', 7)).toEqual(buildTest('Quant', 7));
    expect(buildTest('Quant', 7)).not.toEqual(buildTest('Quant', 8));
  });

  it('serves a topic its own questions, or its section when it has none', () => {
    expect(topicDrill('Percents').every(id => QUESTIONS[id].topic === 'Percents')).toBe(true);
    const rc = topicDrill('Reading Comprehension', 'Verbal');
    expect(rc.length).toBeGreaterThan(0);
    expect(rc.every(id => QUESTIONS[id].section === 'Verbal')).toBe(true);
  });

  it('mixes topics and picks CR for the daily set', () => {
    const mixed = mixedDrill(5, 3);
    expect(new Set(mixed.map(id => QUESTIONS[id].topic)).size).toBe(5);
    expect(crSet(2, 3).every(id => QUESTIONS[id].kind === 'Critical reasoning')).toBe(true);
  });
});

describe('scoring', () => {
  const ids = buildTest('Quant', 1);
  const answers = (okIf: (id: string) => boolean) => ids.map(qid => ({ qid, sel: 0, ok: okIf(qid), sec: 90 }));

  it('spans the 60–90 section scale', () => {
    expect(sectionScore(answers(() => true))).toBe(90);
    expect(sectionScore(answers(() => false))).toBe(60);
  });

  it('rewards hard questions more than easy ones', () => {
    const byLevel = [...ids].sort((x, y) => QUESTIONS[x].level - QUESTIONS[y].level);
    const hard = sectionScore(answers(id => id === byLevel[byLevel.length - 1]));
    const easy = sectionScore(answers(id => id === byLevel[0]));
    expect(hard).toBeGreaterThan(easy);
  });

  it('summarises a test', () => {
    const list = answers(id => QUESTIONS[id].level < 2).map((a, i) => ({ ...a, sec: i === 0 ? 150 : 60 }));
    const r = scoreTest('Quant', list, new Date(2026, 9, 22), '2026-10-22');
    expect(r.total).toBe(21);
    expect(r.right).toBe(list.filter(a => a.ok).length);
    expect(r.over).toBe(1);
    expect(r.date).toBe('Oct 22');
    expect(r.byTopic.reduce((n, t) => n + t[2], 0)).toBe(21);
    const rates = r.byTopic.map(t => t[1] / t[2]);
    expect(rates).toEqual([...rates].sort((a, b) => a - b));
  });
});
