import { describe, expect, it } from 'vitest';
import { QUESTION_LIST } from './content/bank';
import {
  addDays, adaptiveDrill, climb, daysBetween, gradeCard, knownInterval, nextTestQuestion, reviewMistake,
  sectionEstimate, testLevel, topicStat, totalFromSections, type Answer, type Mistake,
} from './progress';

const day = '2026-10-22';

describe('dates', () => {
  it('adds days across month ends and counts between days', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    expect(daysBetween('2026-10-22', '2026-11-05')).toBe(14);
  });
});

describe('topic ladder', () => {
  it('moves up after three right in a row and down after two wrong', () => {
    let l = climb(undefined, true);
    l = climb(l, true);
    expect(l.level).toBe(0);
    l = climb(l, true);
    expect(l).toEqual({ level: 1, right: 0, wrong: 0 });
    l = climb(l, false);
    expect(l.level).toBe(1);
    l = climb(l, false);
    expect(l.level).toBe(0);
  });

  it('a wrong answer resets the run of rights', () => {
    let l = climb(climb(undefined, true), true);
    l = climb(climb(l, false), true);
    expect(l.level).toBe(0);
    expect(l.right).toBe(1);
  });

  it('stays within Foundation … Elite', () => {
    let l = { level: 4, right: 0, wrong: 0 };
    for (let i = 0; i < 5; i++) l = climb(l, true);
    expect(l.level).toBe(4);
    let d = { level: 0, right: 0, wrong: 0 };
    for (let i = 0; i < 5; i++) d = climb(d, false);
    expect(d.level).toBe(0);
  });

  it('reports not started, then recent accuracy', () => {
    expect(topicStat('Percents', [], {}).level).toBe(-1);
    const h: Answer[] = [
      { qid: 'pct-raise-cut', ok: true, sec: 30, day },
      { qid: 'pct-reverse', ok: false, sec: 30, day },
      { qid: 'alg-linear', ok: true, sec: 30, day },
    ];
    expect(topicStat('Percents', h, { Percents: { level: 2, right: 0, wrong: 0 } })).toEqual({ level: 2, acc: 50, answered: 2 });
  });
});

describe('adaptive picking', () => {
  const percents = QUESTION_LIST.filter(q => q.topic === 'Percents');

  it('serves questions nearest the learner level first', () => {
    const [first] = adaptiveDrill(percents, 2, new Set(), 1);
    expect(QUESTION_LIST.find(q => q.id === first)!.level).toBe(2);
  });

  it('avoids recently seen questions while others remain', () => {
    const recent = new Set(percents.filter(q => q.level === 2).map(q => q.id));
    const [first] = adaptiveDrill(percents, 2, recent, 1);
    expect(recent.has(first)).toBe(false);
  });

  it('walks test difficulty with each answer', () => {
    expect(testLevel([])).toBe(1);
    expect(testLevel([true, true])).toBe(3);
    expect(testLevel([false, false, false])).toBe(0);
  });

  it('builds a full test without repeats', () => {
    const asked: string[] = [];
    const results: boolean[] = [];
    for (let i = 0; i < 21; i++) {
      const id = nextTestQuestion('Quant', asked, results, 5)!;
      expect(asked).not.toContain(id);
      asked.push(id);
      results.push(i % 3 !== 0);
    }
    expect(asked).toHaveLength(21);
  });
});

describe('spaced repetition', () => {
  const m: Mistake = { topic: 'Percents', title: 't', reason: 'r', box: 0, next: day, qid: 'pct-reverse' };

  it('moves a clean review up the 1/3/7/14-day ladder and clears after four', () => {
    let cur: Mistake | null = m;
    const gaps: number[] = [];
    for (let i = 0; i < 3; i++) {
      cur = reviewMistake(cur!, true, day);
      gaps.push(daysBetween(day, cur!.next));
    }
    expect(gaps).toEqual([3, 7, 14]);
    expect(reviewMistake(cur!, true, day)).toBeNull();
  });

  it('sends a slip back to day 1', () => {
    const r = reviewMistake({ ...m, box: 2 }, false, day)!;
    expect(r.box).toBe(0);
    expect(r.next).toBe(addDays(day, 1));
  });

  it('schedules flashcards the same way', () => {
    const first = gradeCard(undefined, true, day);
    expect(first).toEqual({ box: 0, next: addDays(day, 1), last: day });
    const second = gradeCard(first, true, day);
    expect(daysBetween(day, second.next)).toBe(3);
    expect(knownInterval(second)).toBe(7);
    expect(gradeCard(second, false, day).box).toBe(0);
  });
});

describe('score estimate', () => {
  it('maps section scores onto 205–805 in steps ending in 5', () => {
    expect(totalFromSections(60, 60, 60)).toBe(205);
    expect(totalFromSections(90, 90, 90)).toBe(805);
    const mid = totalFromSections(75, 75, 75);
    expect(mid % 10).toBe(5);
    expect(mid).toBeGreaterThan(450);
    expect(mid).toBeLessThan(560);
  });

  it('needs evidence, and averages what it has', () => {
    expect(sectionEstimate('Quant', [], [])).toBeNull();
    expect(sectionEstimate('Quant', [], [{ section: 'Quant', score: 70 }], { total: 500, q: 80, v: 75, di: 72 })).toBe(75);
    const fewDrills: Answer[] = Array.from({ length: 4 }, () => ({ qid: 'alg-linear', ok: true, sec: 30, day }));
    expect(sectionEstimate('Quant', fewDrills, [])).toBeNull();
  });
});
