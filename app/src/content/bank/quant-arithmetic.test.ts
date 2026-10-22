import { describe, expect, it } from 'vitest';
import { QUANT_ARITHMETIC } from './quant-arithmetic';
import { CORE_QUESTIONS as QUESTION_LIST } from '../questions';
import { TOPICS } from '../../data';

// Never trust a declared answer: each key below is recomputed from the stem's
// numbers, then compared with the choice the bank marks right.

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const near = (a: number, b: number) => Math.abs(a - b) < 1e-9;
const money = (v: number, dp = 0) => '$' + v.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp });
const pct = (v: number, dp = 0) => `${Number(v.toFixed(dp))}%`;
const num = (v: number) => String(Number(v.toFixed(6)));
const fracStr = (n: number, d: number) => { const g = gcd(n, d); return `${n / g}/${d / g}`; };
const fracVal = (s: string) => { const [n, d] = s.split('/').map(Number); return n / d; };
const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const isPrime = (n: number) => n > 1 && range(2, Math.floor(Math.sqrt(n))).every(d => n % d !== 0);
const modPow = (b: number, e: number, m: number) => { let r = 1; for (let i = 0; i < e; i++) r = (r * b) % m; return r; };
const choicesOf = (id: string) => QUANT_ARITHMETIC.find(q => q.id === id)!.choices;
/** The only value in [lo, hi] (step) that satisfies pred; throws unless exactly one does. */
const solveUnique = (lo: number, hi: number, step: number, pred: (x: number) => boolean) => {
  const hits: number[] = [];
  for (let i = 0; lo + i * step <= hi + 1e-9; i++) { const x = Math.round((lo + i * step) * 1e6) / 1e6; if (pred(x)) hits.push(x); }
  if (hits.length !== 1) throw new Error(`expected one solution, got ${hits.join(', ')}`);
  return hits[0];
};

const EXPECTED: Record<string, () => string> = {
  // Percents
  'pct-dinner-tip': () => money(64 * 0.15, 2),
  'pct-enrollment-rise': () => pct(((1400 - 1250) / 1250) * 100),
  'pct-of-what': () => num(36 / 0.45),
  'pct-profit-on-cost': () => money(360 - 360 / 1.2),
  'pct-remote-staff': () => pct(0.4 * 30 + 0.6 * 20),
  'pct-markup-net': () => pct(solveUnique(0, 100, 0.1, d => near(1.25 * (1 - d / 100), 1.1))),
  'pct-tax-then-tip': () => money(54 + 0.2 * (54 / 1.08), 2),
  'pct-rise-p-fall-2p': () => num(solveUnique(0, 50, 0.5, p => near((1 + p / 100) * (1 - (2 * p) / 100), 0.88))),
  'pct-segment-shift': () => {
    const used = 20 * 1.5, total = 100 * 1.06, newNow = total - used;
    return pct(((80 - newNow) / 80) * 100, 1);
  },

  // Fractions
  'frac-allowance-left': () => money(45 * (1 - 2 / 5)),
  'frac-sugar-batches': () => String(Math.floor(5.5 / 0.75)),
  'frac-season-wins': () => fracStr((3 / 5) * 20 + (3 / 4) * 12, 20 + 12),
  'frac-between-mediant': () => {
    const inside = choicesOf('frac-between-mediant').filter(c => fracVal(c) > 5 / 9 && fracVal(c) < 4 / 7);
    if (inside.length !== 1) throw new Error(`choices inside window: ${inside}`);
    return inside[0];
  },
  'frac-fund-chain': () => money(5400 / ((3 / 4) * (2 / 3) * (3 / 5))),
  'frac-shift-both': () => {
    const sols: number[] = [];
    for (let d = 1; d <= 200; d++) for (let n = 1; n <= 200; n++)
      if (4 * (n + 4) === 3 * (d + 4) && 2 * (n - 2) === d - 2) sols.push(n + d);
    if (sols.length !== 1) throw new Error(String(sols));
    return String(sols[0]);
  },
  'frac-unit-pairs': () => {
    let count = 0;
    for (let a = 1; a <= 100; a++) for (let b = a + 1; b <= 1000; b++) if (6 * (a + b) === a * b) count++;
    return String(count);
  },
  'frac-telescoping': () => {
    for (let n = 1; n <= 200; n++) {
      let s = 0;
      for (let k = 1; k <= n; k++) s += 1 / (k * (k + 1));
      if (near(s, 19 / 20)) return String(n);
    }
    return '?';
  },

  // Ratios & mixtures
  'ratio-flour-sugar': () => num((15 / 5) * 2),
  'ratio-partner-gap': () => money((2400 / (7 - 4)) * 11),
  'mix-coffee-blend': () => money((6 * 8 + 4 * 13) / 10, 2),
  'ratio-marbles-added': () => String(5 * solveUnique(1, 100, 1, k => 10 * (3 * k + 12) === 9 * 5 * k)),
  'mix-drain-refill': () => {
    let conc = 0.3 * 20; conc -= (conc / 20) * 5; // drain 5 L of uniform mix, then refill to 20 L
    return pct((conc / 20) * 100, 1);
  },
  'mix-alloy-gold': () => num(solveUnique(0, 500, 1, x => near(0.4 * x + 0.8 * 30, 0.5 * (x + 30)))),
  'ratio-sibling-ages': () => {
    const k = solveUnique(1, 100, 1, k => [2, 3, 4].map(r => r * k + 6).every((age, i, arr) => age * 3 === arr[0] * (3 + i)));
    return String(9 * k);
  },
  'mix-trail-three': () => {
    const sols: number[] = [];
    for (let c = 0; c <= 20; c += 0.5) { const p = 2 * c, a = 20 - 3 * c; if (a >= 0 && near(3 * p + 8 * a + 10 * c, 6.8 * 20)) sols.push(a); }
    if (sols.length !== 1) throw new Error(String(sols));
    return num(sols[0]);
  },
  'mix-wine-repeat': () => {
    let wine = 40;
    for (let i = 0; i < 3; i++) wine -= (wine / 40) * 8;
    return num(wine);
  },

  // Number properties
  'np-primes-20-40': () => String(range(21, 39).filter(isPrime).length),
  'np-gcf-tiles': () => String(gcd(84, 120)),
  'np-units-product': () => String((17 * 24 * 39) % 10),
  'np-consecutive-even': () => {
    const start = solveUnique(-200, 200, 2, s => s + (s + 2) + (s + 4) + (s + 6) + (s + 8) === 130);
    return String(start + 8);
  },
  'np-trailing-zeros': () => {
    let f = 1n;
    for (let i = 1n; i <= 30n; i++) f *= i;
    return String(f.toString().match(/0*$/)![0].length);
  },
  'np-remainder-square-sum': () => {
    const rems = new Set(range(1, 1000).filter(n => n % 6 === 4).map(n => (n * n + n) % 6));
    if (rems.size !== 1) throw new Error(String([...rems]));
    return String([...rems][0]);
  },
  'np-must-odd': () => {
    const worlds = range(-12, 12).flatMap(x => range(-12, 12).map(y => ({ x, y }))).filter(({ x, y }) => Math.abs(x * y + x) % 2 === 1);
    const odd = (v: number) => Math.abs(v) % 2 === 1;
    const claims: Record<string, (x: number, y: number) => boolean> = {
      'x is even': x => !odd(x),
      'y is odd': (_, y) => odd(y),
      'x + y is odd': (x, y) => odd(x + y),
      'xy is odd': (x, y) => odd(x * y),
      'x − y is even': (x, y) => !odd(x - y),
    };
    const must = Object.keys(claims).filter(c => worlds.every(({ x, y }) => claims[c](x, y)));
    if (must.length !== 1) throw new Error(String(must));
    return must[0];
  },
  'np-square-divisor': () => String(range(1, 2000).filter(n => (n * n) % 72 === 0).reduce((g, n) => gcd(g, n))),
  'np-units-cycle-sum': () => String((modPow(7, 43, 10) + modPow(3, 22, 10)) % 10),
  'np-prime-square-mod': () => {
    const rems = new Set(range(5, 5000).filter(isPrime).map(p => (p * p) % 12));
    return rems.size === 1 ? String([...rems][0]) : 'It cannot be determined';
  },
};

describe('quant arithmetic bank: structure', () => {
  it('has the requested counts per topic', () => {
    const count = (t: string) => QUANT_ARITHMETIC.filter(q => q.topic === t).length;
    expect(count('Percents')).toBe(9);
    expect(count('Fractions')).toBe(8);
    expect(count('Ratios & mixtures')).toBe(9);
    expect(count('Number properties')).toBe(10);
  });

  it('has ids unique within the bank and against the main question list', () => {
    const ids = QUANT_ARITHMETIC.map(q => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    const existing = new Set(QUESTION_LIST.map(q => q.id));
    for (const id of ids) {
      expect(existing.has(id), id).toBe(false);
      expect(id, id).toMatch(/^(pct|frac|ratio|mix|np)-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it('uses valid topics, section, kind, levels and five distinct choices', () => {
    const known = new Set(TOPICS.map(t => t.name));
    for (const q of QUANT_ARITHMETIC) {
      expect(known.has(q.topic), `${q.id}: ${q.topic}`).toBe(true);
      expect(q.section, q.id).toBe('Quant');
      expect(q.kind, q.id).toBe('Problem solving');
      expect(Number.isInteger(q.level) && q.level >= 0 && q.level <= 4, q.id).toBe(true);
      expect(q.choices, q.id).toHaveLength(5);
      expect(new Set(q.choices).size, q.id).toBe(5);
      expect(q.ans >= 0 && q.ans < 5, q.id).toBe(true);
      expect(q.steps.length, q.id).toBeGreaterThan(0);
      expect(q.fast.length && q.alt.length, q.id).toBeTruthy();
    }
  });

  it('starts every stem differently', () => {
    const openings = QUANT_ARITHMETIC.map(q => q.stem.map(p => p.t).join('').split(/\s+/).slice(0, 3).join(' '));
    expect(new Set(openings).size).toBe(openings.length);
  });
});

describe('quant arithmetic bank: answer keys', () => {
  it('derives every question', () => expect(Object.keys(EXPECTED).sort()).toEqual(QUANT_ARITHMETIC.map(q => q.id).sort()));
  for (const q of QUANT_ARITHMETIC) {
    it(q.id, () => {
      const expected = EXPECTED[q.id]();
      expect(q.choices[q.ans]).toBe(expected);
      expect(q.choices.filter(c => c === expected), `${q.id}: computed answer appears more than once`).toHaveLength(1);
    });
  }
});
