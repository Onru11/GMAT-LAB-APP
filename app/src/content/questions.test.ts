import { describe, expect, it } from 'vitest';
import { CORE_QUESTIONS as QUESTION_LIST } from './questions';

const QUESTIONS = Object.fromEntries(QUESTION_LIST.map(q => [q.id, q]));
import { TOPICS } from '../data';

// Never trust a declared answer: every Quant and DI key is re-derived here
// without looking at `ans`, and compared with the choice the bank marks right.

const choiceOf = (id: string) => {
  const q = QUESTIONS[id];
  return q.choices[q.ans];
};

describe('bank structure', () => {
  it('has unique ids and five distinct choices per question', () => {
    expect(new Set(QUESTION_LIST.map(q => q.id)).size).toBe(QUESTION_LIST.length);
    for (const q of QUESTION_LIST) {
      expect(q.choices, q.id).toHaveLength(5);
      expect(new Set(q.choices).size, q.id).toBe(5);
      expect(q.ans, q.id).toBeGreaterThanOrEqual(0);
      expect(q.ans, q.id).toBeLessThan(5);
      expect(q.level, q.id).toBeGreaterThanOrEqual(0);
      expect(q.level, q.id).toBeLessThanOrEqual(4);
      expect(q.steps.length, q.id).toBeGreaterThan(0);
    }
  });

  it('uses only topics the app knows', () => {
    const known = new Set(TOPICS.map(t => t.name));
    for (const q of QUESTION_LIST) expect(known.has(q.topic), `${q.id}: ${q.topic}`).toBe(true);
  });

  it('can fill a full-length Quant test (21) and DI test (20)', () => {
    expect(QUESTION_LIST.filter(q => q.section === 'Quant').length).toBeGreaterThanOrEqual(21);
    expect(QUESTION_LIST.filter(q => q.section === 'Data Insights').length).toBeGreaterThanOrEqual(20);
  });
});

// ── Quant: recompute each answer ──

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const frac = (n: number, d: number) => { const g = gcd(n, d); return `${n / g}/${d / g}`; };
const choose = (n: number, k: number) => { let r = 1; for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1); return r; };
const ratio = (f: string) => { const [n, d] = f.split('/').map(Number); return n / d; };
const money = (v: number, dp = 0) => '$' + v.toFixed(dp);

const QUANT_EXPECTED: Record<string, string> = {
  'pct-raise-cut': Math.round(1.2 * 0.8 * 100) + '%',
  'pct-markup-discount': money(80 * 1.25 * 0.9),
  'pct-reverse': money(64 / 0.8, 2),
  'pct-growth-reverse': Math.round(24200 / 1.21).toLocaleString('en-US'),
  'frac-of-of': String((3 / 4) * (2 / 3) * 48),
  'frac-greatest': ['5/8', '3/5', '7/12', '2/3', '9/16'].reduce((best, f) => (ratio(f) > ratio(best) ? f : best)),
  'frac-tank': (12 / (3 / 4 - 1 / 3)).toFixed(1),
  'ratio-class': String((40 * 5) / 8),
  'ratio-chain': (() => { const [a, c] = [2 * 4, 3 * 5]; const g = gcd(a, c); return `${a / g} : ${c / g}`; })(),
  'mix-alcohol': (() => { for (let x = 0; x < 100; x++) if (Math.abs((10 + x) / (40 + x) - 0.4) < 1e-9) return String(x); return '?'; })(),
  'work-pipes': `${1 / (1 / 6 + 1 / 3)} hours`,
  'rate-avg-speed': `${240 / (120 / 40 + 120 / 60)} mph`,
  'work-solo': String(Math.round(1 / (1 / 6 - 1 / 10))),
  'np-remainder-pow2': String(2 ** 10 % 7),
  'np-divisors': String(Array.from({ length: 72 }, (_, i) => i + 1).filter(d => 72 % d === 0).length),
  'np-odd-even': (() => {
    const exprs: Record<string, (n: number) => number> = { 'n + 2': n => n + 2, '3n': n => 3 * n, 'n²': n => n * n, 'n² + 1': n => n * n + 1, '2n + 1': n => 2 * n + 1 };
    return Object.keys(exprs).filter(k => [-5, -3, -1, 1, 3, 5, 7].every(n => exprs[k](n) % 2 === 0))[0];
  })(),
  'np-lcm': String((12 * 18) / gcd(12, 18)),
  'exp-same-base': String(10 - 6),
  'exp-roots-add': `${Math.round((Math.sqrt(50) + Math.sqrt(18)) / Math.SQRT2)}√2`,
  'exp-negative': frac(1, 3 ** -(4 - 2 - 3)),
  'alg-linear': String(5 + 7),
  'alg-system': String(((10 + 4) / 2) * ((10 - 4) / 2)),
  'alg-quadratic': String([...Array(21).keys()].map(i => i - 10).filter(x => x * x - 5 * x + 6 === 0).reduce((s, x) => s + x, 0)),
  'alg-rational': String([...Array(21).keys()].map(i => i - 10).find(x => x !== 1 && (x + 3) / (x - 1) === 3)),
  'ineq-abs-count': String([...Array(41).keys()].map(i => i - 20).filter(x => Math.abs(x - 3) < 5).length),
  'ineq-flip': [-10, -4, -3.5].every(x => -2 * x + 5 > 11) && [-3, 0, 3].every(x => !(-2 * x + 5 > 11)) ? 'x < −3' : '?',
  'ineq-abs-product': String([...Array(41).keys()].map(i => i - 20).filter(x => Math.abs(2 * x - 1) === 7).reduce((p, x) => p * x, 1)).replace('-', '−'),
  'stat-removed': String(5 * 20 - 4 * 18),
  'stat-median': (() => { const s = [3, 9, 4, 12, 7, 5].sort((a, b) => a - b); return String((s[2] + s[3]) / 2); })(),
  'stat-weighted': String((20 * 70 + 30 * 80) / 50),
  'count-arrange': String(4 * 3 * 2 * 1),
  'count-committee': String(choose(7, 3)),
  'prob-dice-7': (() => { let n = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b === 7) n++; return frac(n, 36); })(),
  'prob-draw-red': frac(choose(3, 2), choose(8, 2)),
};

describe('Quant answer keys', () => {
  const quantIds = QUESTION_LIST.filter(q => q.section === 'Quant').map(q => q.id);
  it('covers every Quant question', () => expect(Object.keys(QUANT_EXPECTED).sort()).toEqual(quantIds.sort()));
  for (const [id, expected] of Object.entries(QUANT_EXPECTED)) it(id, () => expect(choiceOf(id)).toBe(expected));
});

// ── Data sufficiency: brute-force the letter ──

type World = Record<string, number>;
const LETTER = ['A', 'B', 'C', 'D', 'E'];

/** A statement set is sufficient when every world it allows gives one answer. */
function dsLetter(worlds: World[], s1: (w: World) => boolean, s2: (w: World) => boolean, value: (w: World) => unknown) {
  const sufficient = (pred: (w: World) => boolean) => {
    const answers = new Set(worlds.filter(pred).map(w => JSON.stringify(value(w))));
    if (answers.size === 0) throw new Error('statements allow no world');
    return answers.size === 1;
  };
  const one = sufficient(s1), two = sufficient(s2);
  if (one && two) return 'D';
  if (one) return 'A';
  if (two) return 'B';
  return sufficient(w => s1(w) && s2(w)) ? 'C' : 'E';
}

const range = (a: number, b: number, step = 1) => { const r: number[] = []; for (let v = a; v <= b + 1e-9; v += step) r.push(Math.round(v * 1000) / 1000); return r; };
const grid1 = (k: string, vals: number[]) => vals.map(v => ({ [k]: v }));
const grid2 = (k1: string, k2: string, vals: number[]) => vals.flatMap(a => vals.map(b => ({ [k1]: a, [k2]: b })));
const eq = (a: number, b: number) => Math.abs(a - b) < 1e-6;
const isPrime = (n: number) => n > 1 && range(2, Math.floor(Math.sqrt(n))).every(d => n % d !== 0);

const DS_CASES: Record<string, () => string> = {
  'ds-sign': () => dsLetter(grid1('x', range(-30, 30, 0.5)), w => eq(w.x ** 2, 9), w => eq(w.x ** 3, 27), w => w.x > 0),
  'ds-same-equation': () => dsLetter(grid2('x', 'y', range(-20, 20, 0.5)), w => eq(2 * w.x + 3 * w.y, 12), w => eq(4 * w.x + 6 * w.y, 24), w => w.x),
  'ds-parity': () => dsLetter(grid1('n', range(-50, 50)), w => (w.n * w.n) % 2 === 0, w => Math.abs(w.n + 3) % 2 === 1, w => w.n % 2 === 0),
  'ds-average': () => dsLetter(range(-10, 10).flatMap(a => range(-10, 10).flatMap(b => range(-10, 20).map(c => ({ a, b, c })))), w => w.a + w.b + w.c === 15, w => w.a === 5, w => (w.a + w.b + w.c) / 3),
  'ds-compare-squares': () => dsLetter(grid2('x', 'y', range(-10, 10, 0.5)), w => w.x ** 2 > w.y ** 2, w => w.x > 0, w => w.x > w.y),
  'ds-employees': () => dsLetter(grid1('n', range(1, 2000)), w => eq(w.n + 10, 1.25 * w.n), w => Number.isInteger(0.6 * w.n), w => w.n),
  'ds-factor': () => dsLetter(grid1('k', range(1, 200)), w => 30 % w.k === 0, w => w.k % 5 === 0 && w.k < 9, w => w.k),
  'ds-product-sign': () => dsLetter(grid2('x', 'y', range(-10, 10, 0.5)).filter(w => w.y !== 0), w => w.x / w.y < 0, w => w.x - w.y > 0, w => w.x * w.y < 0),
  'ds-remainder6': () => dsLetter(grid1('n', range(1, 600)), w => w.n % 3 === 0, w => w.n % 2 === 0, w => w.n % 6),
  'ds-rectangle': () => {
    // Shapes on a grid, plus continuous families on each constraint so a coarse grid can't fake sufficiency.
    const worlds = [
      ...grid2('l', 'w', range(0.5, 12, 0.5)),
      ...range(0.1, 9.9, 0.1).map(l => ({ l, w: 10 - l })),
      ...range(0.1, 7.2, 0.1).map(l => ({ l, w: Math.sqrt(52 - l * l) })),
    ];
    return dsLetter(worlds, w => eq(w.l + w.w, 10), w => eq(w.l ** 2 + w.w ** 2, 52), w => Math.round(w.l * w.w * 1e6) / 1e6);
  },
  'ds-prime': () => dsLetter(grid1('p', range(-20, 200)), w => Math.abs(w.p) % 2 === 1, w => w.p > 20 && w.p < 24, w => isPrime(w.p)),
};

describe('Data sufficiency answer keys', () => {
  const dsIds = QUESTION_LIST.filter(q => q.topic === 'Data sufficiency').map(q => q.id);
  it('covers every DS question', () => expect(Object.keys(DS_CASES).sort()).toEqual(dsIds.sort()));
  for (const [id, derive] of Object.entries(DS_CASES)) it(id, () => expect(LETTER[QUESTIONS[id].ans]).toBe(derive()));
});

// ── Tables: compute from the table the question shows ──

const num = (s: string) => Number(s.replace(/,/g, ''));
const rowsOf = (id: string) => QUESTIONS[id].table!.rows.map(r => ({ name: r[0], v: r.slice(1).map(num) }));
const argmax = (xs: { name: string; score: number }[]) => {
  const best = Math.max(...xs.map(x => x.score));
  return xs.filter(x => Math.abs(x.score - best) < 1e-9).map(x => x.name);
};
const pick = (id: string, winners: string[]) => {
  const choices = QUESTIONS[id].choices;
  return winners.length === 1 ? winners[0] : choices.find(c => winners.every(w => c.includes(w)) && c.includes('tied'))!;
};
const nearest = (id: string, value: number, parse = (c: string) => num(c.replace(/[%+]/g, ''))) =>
  QUESTIONS[id].choices.reduce((best, c) => (Math.abs(parse(c) - value) < Math.abs(parse(best) - value) ? c : best));

const TABLE_EXPECTED: Record<string, () => string> = {
  'tbl-sales-pct': () => pick('tbl-sales-pct', argmax(rowsOf('tbl-sales-pct').map(r => ({ name: r.name, score: (r.v[1] - r.v[0]) / r.v[0] })))),
  'tbl-visitors-total': () => pick('tbl-visitors-total', argmax(rowsOf('tbl-visitors-total').map(r => ({ name: r.name, score: r.v[0] + r.v[1] + r.v[2] })))),
  'tbl-visitors-growth': () => pick('tbl-visitors-growth', argmax(rowsOf('tbl-visitors-growth').map(r => ({ name: r.name, score: r.v[2] / r.v[0] })))),
  'tbl-revenue-max': () => pick('tbl-revenue-max', argmax(rowsOf('tbl-revenue-max').map(r => ({ name: r.name, score: r.v[0] * r.v[1] })))),
  'tbl-revenue-share': () => {
    const rows = rowsOf('tbl-revenue-share');
    const total = rows.reduce((s, r) => s + r.v[0] * r.v[1], 0);
    const z = rows.find(r => r.name === 'Z')!;
    return nearest('tbl-revenue-share', (100 * z.v[0] * z.v[1]) / total);
  },
  'tbl-class-mean': () => {
    const rows = rowsOf('tbl-class-mean');
    const n = rows.reduce((s, r) => s + r.v[0], 0);
    return (rows.reduce((s, r) => s + r.v[0] * r.v[1], 0) / n).toFixed(1);
  },
  'tbl-class-shift': () => {
    const rows = rowsOf('tbl-class-shift');
    const n = rows.reduce((s, r) => s + r.v[0], 0);
    return String((rows.find(r => r.name === 'R')!.v[0] * 6) / n);
  },
  'tbl-budget-pct': () => pick('tbl-budget-pct', argmax(rowsOf('tbl-budget-pct').map(r => ({ name: r.name, score: Math.abs(r.v[1] - r.v[0]) / r.v[0] })))),
  'tbl-budget-total': () => {
    const rows = rowsOf('tbl-budget-total');
    const [a, b] = [0, 1].map(i => rows.reduce((s, r) => s + r.v[i], 0));
    return '+' + ((100 * (b - a)) / a).toFixed(1) + '%';
  },
};

describe('Table answer keys', () => {
  const ids = QUESTION_LIST.filter(q => q.topic === 'Tables').map(q => q.id);
  it('covers every table question', () => expect(Object.keys(TABLE_EXPECTED).sort()).toEqual(ids.sort()));
  for (const [id, derive] of Object.entries(TABLE_EXPECTED)) it(id, () => expect(choiceOf(id)).toBe(derive()));
});
