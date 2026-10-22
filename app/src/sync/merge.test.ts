import { describe, expect, it } from 'vitest';
import { mergeProgress, multisetUnion } from './merge';
import type { Persisted } from '../persist';

type P = Partial<Persisted>;
const day = '2026-10-22';

const base: P = {
  target: 705, examDate: null, dailyMin: 30, settingsAt: 0, onboarded: true, lessonsDone: [], day, queue: [false, false, false, false, false],
  lastFullDay: null, streak: 0, history: [], tests: [], scores: [], mistakes: [], cleared: [], ladders: {}, cards: {},
  sprintBest: null, sprintLast: null, sprintFacts: [],
};

const phone: P = {
  ...base,
  queue: [true, true, false, false, false],
  history: [{ qid: 'pct-reverse', ok: true, sec: 40, day, t: 1000 }, { qid: 'alg-linear', ok: false, sec: 70, day, t: 2000 }],
  mistakes: [{ topic: 'Algebra', title: 'x', reason: 'Not tagged', box: 0, next: '2026-10-23', qid: 'alg-linear', at: 2000 }],
  ladders: { Percents: { level: 1, right: 0, wrong: 0, at: 1000 } },
  cards: { 'Cubes|6³': { box: 1, next: '2026-10-25', last: day, at: 1500 } },
  lessonsDone: ['fractions-1'],
  sprintBest: 170,
};

const laptop: P = {
  ...base,
  queue: [true, false, true, false, false],
  history: [{ qid: 'ds-sign', ok: true, sec: 90, day, t: 1500 }],
  ladders: { Percents: { level: 0, right: 2, wrong: 0, at: 500 }, Weaken: { level: 2, right: 0, wrong: 0, at: 1800 } },
  cards: { 'Cubes|6³': { box: 0, next: '2026-10-23', last: day, at: 900 } },
  lessonsDone: ['fractions-2'],
  sprintBest: 155,
  target: 655,
  settingsAt: 3000,
};

describe('multisetUnion', () => {
  it('keeps repeats up to the larger count and never doubles shared items', () => {
    expect(multisetUnion(['a', 'a', 'b'], ['a', 'c'], x => x)).toEqual(['a', 'a', 'b', 'c']);
    expect(multisetUnion(['a'], ['a'], x => x)).toEqual(['a']);
  });
});

describe('mergeProgress', () => {
  const merged = mergeProgress(phone, laptop);

  it('keeps every answer from both devices, in time order', () => {
    expect(merged.history!.map(a => a.t)).toEqual([1000, 1500, 2000]);
  });

  it('combines today’s queue and finished lessons', () => {
    expect(merged.queue).toEqual([true, true, true, false, false]);
    expect(merged.lessonsDone).toEqual(['fractions-1', 'fractions-2']);
  });

  it('takes the newest level per topic and the newest card state', () => {
    expect(merged.ladders!.Percents.level).toBe(1);
    expect(merged.ladders!.Weaken.level).toBe(2);
    expect(merged.cards!['Cubes|6³'].box).toBe(1);
  });

  it('takes the latest settings edit and the best sprint', () => {
    expect(merged.target).toBe(655);
    expect(merged.sprintBest).toBe(155);
  });

  it('is the same whichever device merges first, and merging again changes nothing', () => {
    expect(JSON.stringify(mergeProgress(laptop, phone))).toBe(JSON.stringify(merged));
    expect(JSON.stringify(mergeProgress(merged, laptop))).toBe(JSON.stringify(merged));
    expect(JSON.stringify(mergeProgress(merged, merged))).toBe(JSON.stringify(merged));
  });

  it('lets a clear on one device remove a stale copy of that mistake on another', () => {
    const cleared: P = { ...laptop, cleared: [{ qid: 'alg-linear', day, at: 5000 }] };
    expect(mergeProgress(phone, cleared).mistakes).toEqual([]);
  });

  it('keeps a mistake missed again after it was cleared', () => {
    const cleared: P = { ...laptop, cleared: [{ qid: 'alg-linear', day, at: 1000 }] };
    expect(mergeProgress(phone, cleared).mistakes!.map(m => m.qid)).toEqual(['alg-linear']);
  });

  it('takes the later day’s queue and the streak from the later completed day', () => {
    const tomorrow: P = { ...laptop, day: '2026-10-23', queue: [true, false, false, false, false], lastFullDay: day, streak: 4 };
    const m = mergeProgress({ ...phone, lastFullDay: '2026-10-20', streak: 9 }, tomorrow);
    expect(m.day).toBe('2026-10-23');
    expect(m.queue).toEqual([true, false, false, false, false]);
    expect(m.streak).toBe(4);
  });

  it('does not duplicate cleared mistakes migrated identically on two devices', () => {
    const legacy = [{ qid: 'legacy-0', day, at: 0 }, { qid: 'legacy-1', day, at: 0 }];
    expect(mergeProgress({ ...phone, cleared: legacy }, { ...laptop, cleared: legacy }).cleared).toHaveLength(2);
  });
});
