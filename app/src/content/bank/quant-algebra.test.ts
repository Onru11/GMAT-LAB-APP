import { describe, expect, it } from 'vitest';
import { QUANT_ALGEBRA } from './quant-algebra';
import { CORE_QUESTIONS as QUESTION_LIST } from '../questions';
import { TOPICS } from '../../data';

// Never trust `ans`: every key below is recomputed from scratch by brute force,
// enumeration, simulation or direct arithmetic, then compared with the choice
// the bank marks correct.

const BY_ID = Object.fromEntries(QUANT_ALGEBRA.map(q => [q.id, q]));

// ── helpers ──
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const MINUS = '−';
/** Integers and decimals with the Unicode minus the bank uses. */
const fmt = (v: number) => {
  const r = Math.round(v * 1e6) / 1e6;
  return (r < 0 ? MINUS : '') + String(Math.abs(r));
};
const frac = (n: number, d: number) => {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(Math.abs(n), d);
  const [a, b] = [n / g, d / g];
  return b === 1 ? fmt(a) : `${a < 0 ? MINUS : ''}${Math.abs(a)}/${b}`;
};
const ints = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const combos = <T,>(xs: T[], k: number): T[][] =>
  k === 0 ? [[]] : xs.flatMap((x, i) => combos(xs.slice(i + 1), k - 1).map(c => [x, ...c]));
const perms = <T,>(xs: T[]): T[][] =>
  xs.length <= 1 ? [xs] : xs.flatMap((x, i) => perms([...xs.slice(0, i), ...xs.slice(i + 1)]).map(p => [x, ...p]));
const mean = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length;
const popSd = (xs: number[]) => { const m = mean(xs); return Math.sqrt(mean(xs.map(x => (x - m) ** 2))); };
const median = (xs: number[]) => { const s = [...xs].sort((a, b) => a - b); const h = s.length >> 1; return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2; };
const clock = (min: number) => {
  const h24 = Math.floor(min / 60) % 24, m = Math.round(min % 60);
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${h24 < 12 ? 'a.m.' : 'p.m.'}`;
};
const only = <T,>(xs: T[]) => { expect(xs).toHaveLength(1); return xs[0]; };
/** Parses "x < 3", "x > −1.5" into a predicate. */
const halfLine = (c: string) => {
  const m = c.match(/^x ([<>]) (−?[\d.]+)$/);
  if (!m) throw new Error(`unparsed ${c}`);
  const v = Number(m[2].replace(MINUS, '-'));
  return (x: number) => (m[1] === '<' ? x < v : x > v);
};
const superPow = (s: string) => {
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const m = s.match(/^(\d+)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)$/)!;
  const exp = [...m[2]].map(ch => SUP.indexOf(ch)).join('');
  return BigInt(m[1]) ** BigInt(exp);
};

const EXPECTED: Record<string, () => string> = {
  // ── Algebra ──
  'alg-notebooks-pens': () => {
    const cents = only(ints(1, 1300).filter(n => 5 * n + 2 * 150 === 1300));
    return '$' + (cents / 100).toFixed(2);
  },
  'alg-consecutive-even': () => String(only(ints(-200, 200).filter(x => x % 2 === 0 && x + (x + 2) + (x + 4) === 102)) + 4),
  'alg-age-later': () => String(4 * only(ints(1, 100).filter(s => 4 * s + 20 === 2 * (s + 20)))),
  'alg-reciprocal-square': () => {
    const x = (5 + Math.sqrt(21)) / 2;
    expect(x + 1 / x).toBeCloseTo(5, 9);
    return fmt(Math.round(x * x + 1 / (x * x)));
  },
  'alg-split-bill': () => String(only(ints(4, 500).filter(n => Math.abs(360 / (n - 3) - 360 / n - 20) < 1e-9))),
  'alg-composition': () => {
    const f = (x: number) => 2 * x * x - 3, g = (x: number) => x + 1;
    return fmt(f(g(-2)) - g(f(-2)));
  },
  'alg-integer-solutions': () => {
    let n = 0;
    for (let x = 1; x <= 100; x++) for (let y = 1; y <= 100; y++) if (3 * x + 5 * y === 100) n++;
    return String(n);
  },
  'alg-diff-squares': () => {
    const as = new Set<number>();
    for (let a = 1; a <= 200; a++) for (let b = 1; b < a; b++) if (a * a - b * b === 45) as.add(a);
    return String([...as].reduce((s, a) => s + a, 0));
  },

  // ── Inequalities & absolute value ──
  'ineq-linear-basic': () => {
    const grid = ints(-80, 80).map(k => k / 4);
    const truth = (x: number) => 4 * x - 9 < 3;
    return only(BY_ID['ineq-linear-basic'].choices.filter(c => grid.every(x => halfLine(c)(x) === truth(x))));
  },
  'ineq-least-integer': () => fmt(ints(-100, 100).find(x => 7 - 3 * x < -11)!),
  'ineq-abs-between': () => String(ints(-100, 100).filter(n => 2 < Math.abs(n - 1) && Math.abs(n - 1) <= 6).length),
  'ineq-quadratic-set': () => {
    const preds: Record<string, (x: number) => boolean> = {
      '−3 < x < 5': x => -3 < x && x < 5,
      '−5 < x < 3': x => -5 < x && x < 3,
      'x < −3 or x > 5': x => x < -3 || x > 5,
      '0 < x < 5': x => 0 < x && x < 5,
      'x < 5': x => x < 5,
    };
    expect(Object.keys(preds).sort()).toEqual([...BY_ID['ineq-quadratic-set'].choices].sort());
    const grid = ints(-400, 400).map(k => k / 20);
    return only(Object.keys(preds).filter(c => grid.every(x => preds[c](x) === x * x - 2 * x - 15 < 0)));
  },
  'ineq-abs-sum-count': () => String(ints(-100, 100).filter(x => Math.abs(x - 2) + Math.abs(x + 4) === 6).length),
  'ineq-range-square': () => {
    // Sample the open interval (−5, 2) finely; 0 is hit exactly, ±5 never.
    const xs = ints(-4999, 1999).map(k => k / 1000);
    const sq = xs.map(x => x * x);
    const lo = Math.min(...sq), hi = Math.max(...sq);
    expect(lo).toBe(0);
    expect(hi).toBeLessThan(25);
    expect(hi).toBeGreaterThan(24.98);
    // Infimum 0 is attained (x = 0); supremum 25 is approached but excluded.
    return `${lo} ≤ x² < ${Math.round(hi)}`;
  },
  'ineq-abs-cases': () => {
    // Solutions of a piecewise-linear equation with slopes ±2, 0 minus 1 have denominators 1 or 3.
    const sols = ints(-6000, 6000).filter(k => {
      const x = k / 60;
      return Math.abs(Math.abs(x - 3) + Math.abs(x + 1) - (x + 6)) < 1e-9;
    });
    expect(sols.length).toBeGreaterThan(0);
    return frac(sols.reduce((s, k) => s + k, 0), 60);
  },

  // ── Rates & work ──
  'rate-cyclist-minutes': () => {
    let t = 0, miles = 0;
    while (miles < 12 - 1e-9) { t++; miles += 18 / 60; }
    return String(t);
  },
  'work-machines-scale': () => {
    const work = 4 * 15;
    let h = 0, done = 0;
    while (done < work - 1e-9) { h += 0.5; done += 6 * 0.5; }
    return fmt(h);
  },
  'rate-trains-meet': () => {
    let m = 0;
    while ((50 + 60) * (m / 60) < 330) m++;
    return clock(13 * 60 + m);
  },
  'work-joins-later': () => {
    // Fence = 180 units; per tenth of an hour Ana paints 3, Ben 2.
    let done = 0, tenths = 0;
    for (let i = 0; i < 20; i++) done += 3;
    while (done < 180) { done += 5; tenths++; }
    return fmt(tenths / 10);
  },
  'rate-catch-up': () => {
    for (let t = 61; t < 24 * 60; t++) if ((60 * (t - 60)) / 60 >= (45 * t) / 60) return clock(9 * 60 + t);
    return '?';
  },
  'work-inlet-drain': () => {
    // Tank = 120 units; per tenth of an hour inlet adds 3, drain removes 2.
    let level = 40, tenths = 0;
    while (level < 120) { level += 3 - 2; tenths++; }
    return fmt(tenths / 10);
  },
  'work-machine-breaks': () => {
    // Job = 3600 units; per minute A does 6, B 5, C 4.
    let done = 0, t = 0;
    while (done < 3600) { done += t < 120 ? 15 : 9; t++; }
    return `${Math.floor(t / 60)} hours ${t % 60} minutes`;
  },
  'work-partner-leaves': () => {
    const found: number[] = [];
    for (let p = 1; p <= 500; p++) for (let s = 1; s <= 500; s++) {
      // together: 1/p + 1/s = 1/12; and 8 days together + 10 days Priya = 1 job.
      if (12 * (p + s) === p * s && 8 * (p + s) + 10 * s === p * s) found.push(s);
    }
    return String(only(found));
  },

  // ── Exponents & roots ──
  'exp-power-tower': () => String((2 ** 3) ** 2),
  'exp-root-square': () => fmt(Math.round((Math.sqrt(12) + Math.sqrt(27)) ** 2)),
  'exp-common-base': () => fmt(only(ints(-30, 30).filter(x => Math.abs(4 ** (x + 1) / 8 ** (x - 1) - 1) < 1e-9))),
  'exp-sum-equal-powers': () => String(only(ints(0, 100).filter(n => 4n * 2n ** 10n === 2n ** BigInt(n)))),
  'exp-greatest-power': () => {
    const cs = BY_ID['exp-greatest-power'].choices;
    return cs.reduce((best, c) => (superPow(c) > superPow(best) ? c : best));
  },
  'exp-radical-equation': () => fmt(only(ints(-7, 200).filter(x => Math.sqrt(x + 7) === x - 5))),
  'exp-quadratic-disguise': () => {
    // t = 3^x > 0, so there are at most two real roots; find them on the integers.
    const roots = ints(-30, 30).filter(x => 3 ** (2 * x) - 12 * 3 ** x + 27 === 0);
    expect(roots).toHaveLength(2);
    return String(roots.reduce((s, x) => s + x, 0));
  },

  // ── Statistics ──
  'stat-mean-scores': () => fmt(mean([72, 85, 90, 68, 95])),
  'stat-missing-median': () => {
    const x = only(ints(-100, 100).filter(v => mean([4, 7, 7, 10, 15, v]) === 9));
    return fmt(median([4, 7, 7, 10, 15, x]));
  },
  'stat-mean-transform': () => {
    const xs = [12, 18, 25, 27, 30, 30, 33, 35, 42, 48];
    expect(mean(xs)).toBe(30);
    return fmt(mean(xs.map(v => v * 1.2 - 4)));
  },
  'stat-sd-linear': () => {
    const results = [[-4, 4], [0, 8, 0, 8], [10 - 2 * Math.sqrt(6), 10, 10 + 2 * Math.sqrt(6)]].map(s => {
      expect(popSd(s)).toBeCloseTo(4, 9);
      return popSd(s.map(v => v * 3 + 5));
    });
    results.forEach(r => expect(r).toBeCloseTo(results[0], 9));
    return fmt(results[0]);
  },
  'stat-sd-greatest': () => {
    const parse = (c: string) => c.slice(1, -1).split(', ').map(Number);
    const cs = BY_ID['stat-sd-greatest'].choices;
    const sds = cs.map(c => popSd(parse(c)));
    const best = Math.max(...sds);
    expect(sds.filter(s => Math.abs(s - best) < 1e-9)).toHaveLength(1);
    return cs[sds.indexOf(best)];
  },
  'stat-weighted-fraction': () => {
    const fracs = new Set<string>();
    for (let m = 1; m <= 200; m++) for (let s = 1; s <= 200; s++) if (90 * m + 50 * s === 60 * (m + s)) fracs.add(frac(m, m + s));
    return only([...fracs]);
  },
  'stat-must-be-true': () => {
    // Every sorted list a ≤ b ≤ 12 ≤ d ≤ e of positive integers with sum 50.
    const lists: number[][] = [];
    for (let a = 1; a <= 12; a++) for (let b = a; b <= 12; b++) for (let d = 12; d <= 50; d++) {
      const e = 50 - a - b - 12 - d;
      if (e >= d) lists.push([a, b, 12, d, e]);
    }
    expect(lists.length).toBeGreaterThan(0);
    lists.forEach(l => { expect(mean(l)).toBe(10); expect(median(l)).toBe(12); });
    const must = [
      lists.every(l => l[0] <= 7),
      lists.every(l => l[4] > 12),
      lists.every(l => l[3] + l[4] >= 24),
    ];
    const names = ['I', 'II', 'III'].filter((_, i) => must[i]);
    if (names.length === 1) return `${names[0]} only`;
    if (names.length === 3) return 'I, II and III';
    return `${names.join(' and ')} only`;
  },

  // ── Counting & probability ──
  'count-lunch-specials': () => {
    let n = 0;
    for (let a = 0; a < 4; a++) for (let b = 0; b < 6; b++) for (let c = 0; c < 3; c++) n++;
    return String(n);
  },
  'prob-coin-at-least-one': () => {
    const outcomes = ints(0, 7).map(k => [k & 1, k & 2, k & 4]);
    return frac(outcomes.filter(o => o.some(Boolean)).length, outcomes.length);
  },
  'count-level-letters': () => String(new Set(perms([...'LEVEL']).map(p => p.join(''))).size),
  'prob-two-women': () => {
    const people = [...'WWWWWMMMM'];
    const all = combos(ints(0, 8), 3);
    const fav = all.filter(c => c.filter(i => people[i] === 'W').length === 2);
    return frac(fav.length, all.length);
  },
  'count-round-table': () => {
    // Fix person 0 in seat 0 to remove rotations; people 1 and 2 are Ana and Ben.
    const seatings = perms(ints(1, 5)).map(p => [0, ...p]);
    return String(seatings.filter(s => { const i = s.indexOf(1), j = s.indexOf(2); return (i - j + 6) % 6 === 1 || (j - i + 6) % 6 === 1; }).length);
  },
  'count-team-junior': () => {
    const juniors = new Set([6, 7, 8, 9]);
    return String(combos(ints(0, 9), 4).filter(t => t.some(i => juniors.has(i))).length);
  },
  'prob-defect-source': () => {
    const fromX = { parts: 600, bad: (600 * 2) / 100 }, fromY = { parts: 400, bad: (400 * 5) / 100 };
    return frac(fromY.bad, fromX.bad + fromY.bad);
  },
  'count-cookies-cap': () => {
    let n = 0;
    for (let a = 1; a <= 4; a++) for (let b = 1; b <= 4; b++) { const c = 8 - a - b; if (c >= 1 && c <= 4) n++; }
    return String(n);
  },
};

describe('quant-algebra bank structure', () => {
  it('has 45 questions with the planned topic mix', () => {
    const count = (t: string) => QUANT_ALGEBRA.filter(q => q.topic === t).length;
    expect(QUANT_ALGEBRA).toHaveLength(45);
    expect(count('Algebra')).toBe(8);
    expect(count('Inequalities & absolute value')).toBe(7);
    expect(count('Rates & work')).toBe(8);
    expect(count('Exponents & roots')).toBe(7);
    expect(count('Statistics')).toBe(7);
    expect(count('Counting & probability')).toBe(8);
  });

  it('has unique ids that do not clash with the main bank', () => {
    const ids = QUANT_ALGEBRA.map(q => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    const existing = new Set(QUESTION_LIST.map(q => q.id));
    for (const id of ids) {
      expect(existing.has(id), id).toBe(false);
      expect(id, id).toMatch(/^(alg|ineq|rate|work|exp|stat|count|prob)-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it('is well formed', () => {
    const known = new Set(TOPICS.map(t => t.name));
    for (const q of QUANT_ALGEBRA) {
      expect(q.section, q.id).toBe('Quant');
      expect(q.kind, q.id).toBe('Problem solving');
      expect(known.has(q.topic), `${q.id}: ${q.topic}`).toBe(true);
      expect(q.choices, q.id).toHaveLength(5);
      expect(new Set(q.choices).size, q.id).toBe(5);
      expect(Number.isInteger(q.level) && q.level >= 0 && q.level <= 4, q.id).toBe(true);
      expect(q.ans >= 0 && q.ans < 5, q.id).toBe(true);
      expect(q.steps.length, q.id).toBeGreaterThan(0);
      expect(q.fast.length, q.id).toBeGreaterThan(0);
      expect(q.alt.length, q.id).toBeGreaterThan(0);
      // Hyphen-minus never appears before a digit in learner-facing math.
      const texts = [...q.stem.map(p => p.t + (p.s ?? '')), ...q.choices, ...q.steps, q.fast, q.alt];
      for (const t of texts) expect(/(^|[\s(=<>±])-\d/.test(t), `${q.id}: ${t}`).toBe(false);
    }
  });

  it('never starts two stems the same way', () => {
    const openings = [...QUANT_ALGEBRA, ...QUESTION_LIST].map(q => q.stem.map(p => p.t).join('').split(/\s+/).slice(0, 4).join(' '));
    const own = openings.slice(0, QUANT_ALGEBRA.length);
    for (const o of own) expect(openings.filter(x => x === o), o).toHaveLength(1);
  });
});

describe('quant-algebra answer keys', () => {
  it('covers every question', () => expect(Object.keys(EXPECTED).sort()).toEqual(QUANT_ALGEBRA.map(q => q.id).sort()));
  for (const q of QUANT_ALGEBRA) {
    it(q.id, () => {
      const derive = EXPECTED[q.id];
      expect(derive, q.id).toBeTypeOf('function');
      const expected = derive();
      expect(q.choices[q.ans]).toBe(expected);
      expect(q.choices.filter(c => c === expected)).toHaveLength(1);
    });
  }
});
