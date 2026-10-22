import { describe, expect, it } from 'vitest';
import { QUESTIONS } from './questions';
import { QUESTION_LIST } from './questions';
import { crSet, scoreTest, sectionScore, seededShuffle } from './select';

describe('question selection', () => {
  it('shuffles deterministically per seed', () => {
    const ids = QUESTION_LIST.map(q => q.id);
    expect(seededShuffle(ids, 7)).toEqual(seededShuffle(ids, 7));
    expect(seededShuffle(ids, 7)).not.toEqual(seededShuffle(ids, 8));
    expect([...seededShuffle(ids, 7)].sort()).toEqual([...ids].sort());
  });

  it('picks Critical Reasoning for the daily set', () => {
    expect(crSet(2, 3).every(id => QUESTIONS[id].kind === 'Critical reasoning')).toBe(true);
  });
});

describe('scoring', () => {
  const ids = QUESTION_LIST.filter(q => q.section === 'Quant').slice(0, 21).map(q => q.id);
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
