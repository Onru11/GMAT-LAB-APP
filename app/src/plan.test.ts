import { describe, expect, it } from 'vitest';
import { daysToExam, drillSize, phaseFor, todaysFocus, weakestTopic } from './plan';
import type { Answer } from './progress';

const day = '2026-10-22';
const answers = (qid: string, right: number, of: number): Answer[] =>
  Array.from({ length: of }, (_, i) => ({ qid, ok: i < right, sec: 60, day }));

describe('study plan', () => {
  it('picks the phase from days to the exam', () => {
    expect(phaseFor(90)).toBe('foundations');
    expect(phaseFor(30)).toBe('timed');
    expect(phaseFor(10)).toBe('peak');
    expect(daysToExam(day, null)).toBe(90);
    expect(daysToExam(day, '2026-11-01')).toBe(10);
  });

  it('sizes drills to the daily time', () => {
    expect([15, 30, 45, 60].map(drillSize)).toEqual([4, 6, 8, 10]);
  });

  it('finds the weakest practised topic', () => {
    const history = [...answers('pct-reverse', 1, 4), ...answers('alg-linear', 4, 4)];
    expect(weakestTopic({ history, ladders: {} })?.name).toBe('Percents');
  });

  const base = { day, examDate: null, dailyMin: 30, ladders: {}, tests: [] as { section: string; day: string }[] };

  it('schedules a section test once there is enough history and none recently', () => {
    const history = answers('alg-linear', 10, 20);
    expect(todaysFocus({ ...base, history })).toEqual({ kind: 'test', section: 'Quant' });
    const recent = [{ section: 'Quant', day: '2026-10-18' }];
    expect(todaysFocus({ ...base, history, tests: recent }).kind).not.toBe('test');
    // Closer to the exam, tests come round more often.
    expect(todaysFocus({ ...base, history, tests: recent, examDate: '2026-10-30' })).toEqual({ kind: 'test', section: 'Data Insights' });
  });

  it('rotates the focus across days', () => {
    const history = answers('pct-reverse', 1, 4);
    const kinds = ['2026-10-22', '2026-10-23', '2026-10-24'].map(d => todaysFocus({ ...base, day: d, history }).kind);
    expect(new Set(kinds).size).toBe(3);
  });
});
