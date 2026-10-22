import { describe, expect, it } from 'vitest';
import { DATA_INSIGHTS } from './data-insights';
import { CORE_QUESTIONS as QUESTION_LIST, DS_CHOICES, type Question } from '../questions';

// Never trust a declared answer: every key here is re-derived from the
// statements or the table rows, without looking at `ans`.

const BY_ID: Record<string, Question> = Object.fromEntries(DATA_INSIGHTS.map(q => [q.id, q]));

describe('data-insights bank structure', () => {
  it('has unique ids, also against the main bank', () => {
    const ids = DATA_INSIGHTS.map(q => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    const main = new Set(QUESTION_LIST.map(q => q.id));
    for (const id of ids) expect(main.has(id), id).toBe(false);
  });

  it('has five distinct choices, a valid answer and a level 0–4', () => {
    for (const q of DATA_INSIGHTS) {
      expect(q.section, q.id).toBe('Data Insights');
      expect(q.choices, q.id).toHaveLength(5);
      expect(new Set(q.choices).size, q.id).toBe(5);
      expect(Number.isInteger(q.ans) && q.ans >= 0 && q.ans < 5, q.id).toBe(true);
      expect(Number.isInteger(q.level) && q.level >= 0 && q.level <= 4, q.id).toBe(true);
      expect(q.steps.length, q.id).toBeGreaterThan(0);
      expect(q.fast.length, q.id).toBeGreaterThan(0);
      expect(q.alt.length, q.id).toBeGreaterThan(0);
    }
  });

  it('uses the right shape per type', () => {
    for (const q of DATA_INSIGHTS) {
      if (q.topic === 'Data sufficiency') {
        expect(q.id.startsWith('ds-'), q.id).toBe(true);
        expect(q.kind).toBe('Data sufficiency');
        expect(q.choices).toEqual(DS_CHOICES);
        expect(q.st, q.id).toHaveLength(2);
      } else {
        expect(q.topic, q.id).toBe('Tables');
        expect(q.id.startsWith('tbl-'), q.id).toBe(true);
        expect(q.kind).toBe('Data Insights · Table');
        expect(q.table, q.id).toBeDefined();
        for (const r of q.table!.rows) expect(r.length, q.id).toBe(q.table!.head.length);
      }
    }
  });
});

// ── Data sufficiency: brute-force the letter over candidate worlds ──

type World = Record<string, number>;
type Pred = (w: World) => boolean;
interface DsCase { worlds: World[]; s1: Pred; s2: Pred; value: (w: World) => unknown }
const LETTER = ['A', 'B', 'C', 'D', 'E'];

/** A statement set is sufficient when every world it allows gives one answer. */
function dsLetter({ worlds, s1, s2, value }: DsCase) {
  const sufficient = (pred: Pred) => {
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
const r6 = (x: number) => Math.round(x * 1e6) / 1e6;
const mod = (n: number, m: number) => ((n % m) + m) % m;
const median = (xs: number[]) => { const s = [...xs].sort((a, b) => a - b); const h = s.length >> 1; return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2; };
const mean = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length;
const powMod = (b: number, e: number, m: number) => { let r = 1; for (let i = 0; i < e; i++) r = (r * b) % m; return r; };
const distinctPrimes = (n: number) => { let c = 0; for (let p = 2; p * p <= n; p++) if (n % p === 0) { c++; while (n % p === 0) n /= p; } return c + (n > 1 ? 1 : 0); };

const DS_CASES: Record<string, () => DsCase> = {
  'ds-di-jacket-pct': () => ({
    // old price p, new price q; grid plus a continuous family on each equation.
    worlds: [
      ...range(4, 200, 4).flatMap(p => range(1, 400).map(q => ({ p, q }))),
      ...range(1, 200, 0.5).flatMap(p => [{ p, q: p + 15 }, { p, q: 1.25 * p }]),
    ],
    s1: w => eq(w.q - w.p, 15), s2: w => eq(w.q, 1.25 * w.p), value: w => r6((w.q - w.p) / w.p),
  }),
  'ds-di-even-sum': () => ({
    worlds: grid2('a', 'b', range(-20, 20)),
    s1: w => mod(w.a, 2) === 1 && mod(w.b, 2) === 1, s2: w => mod(w.a - w.b, 2) === 0, value: w => mod(w.a + w.b, 2) === 0,
  }),
  'ds-di-tickets': () => ({
    worlds: range(0, 130).flatMap(a => range(0, 130).flatMap(c => [8, 10, 12].flatMap(pa => [8, 10, 12].map(pc => ({ a, c, pa, pc }))))),
    s1: w => w.a + w.c === 120, s2: w => w.pa === 12 && w.pc === 8, value: w => w.a * w.pa + w.c * w.pc,
  }),
  'ds-di-shirts-pct': () => ({
    worlds: grid2('d', 'f', range(0, 200)).filter(w => w.d + w.f > 0),
    s1: w => 5 * w.d === 3 * w.f, s2: w => w.f - w.d === 30, value: w => r6(w.d / (w.d + w.f)),
  }),
  'ds-di-median-five': () => ({
    worlds: grid1('x', range(-20, 30, 0.25)),
    s1: w => w.x > 8, s2: w => w.x < 9, value: w => median([2, 9, 4, w.x, 7]),
  }),
  'ds-di-consec-8': () => ({
    worlds: grid1('n', range(1, 400)),
    s1: w => w.n % 3 === 0, s2: w => w.n % 2 === 0, value: w => (w.n * (w.n + 1) * (w.n + 2)) % 8 === 0,
  }),
  'ds-di-speed': () => ({
    // speed v, time t; grid plus the continuous family that satisfies (1).
    worlds: [
      ...range(1, 100, 0.5).flatMap(v => range(0.5, 6, 0.25).map(t => ({ v, t }))),
      ...range(1.05, 6, 0.05).map(t => ({ v: 20 * t - 20, t })),
    ],
    s1: w => w.t > 1 && eq(w.v * w.t, (w.v + 20) * (w.t - 1)), s2: w => eq(w.t, 3), value: w => r6(w.v),
  }),
  'ds-di-mixture': () => ({
    worlds: grid1('a', range(0, 40, 0.01)),
    s1: w => eq(w.a / 40, 0.3), s2: w => eq(w.a / 50, 0.24), value: w => r6(w.a),
  }),
  'ds-di-mean-groups': () => ({
    worlds: range(1, 40).flatMap(nx => range(1, 40).flatMap(ny => [30, 35, 40].flatMap(mx => [30, 35, 40].map(my => ({ nx, ny, mx, my }))))),
    s1: w => w.mx === 30 && w.my === 40, s2: w => w.nx === w.ny + 10, value: w => r6((w.nx * w.mx + w.ny * w.my) / (w.nx + w.ny)),
  }),
  'ds-di-div6-no': () => ({
    worlds: grid1('n', range(-300, 300)),
    s1: w => mod(w.n + 1, 3) === 0, s2: w => mod(w.n, 4) === 0, value: w => mod(w.n, 6) === 0,
  }),
  'ds-di-pumps': () => {
    // a, b: hours alone (1/a + 1/b = 1/6 from the stem); V: tank size in gallons.
    const worlds: World[] = [];
    for (const a of range(6.1, 40, 0.1)) {
      const b = 1 / (1 / 6 - 1 / a);
      for (const V of [300, 600, 1200]) worlds.push({ a, b, V });
      if (a < b) worlds.push({ a, b, V: 50 / (1 / a - 1 / b) });
    }
    return { worlds, s1: w => eq(w.b, 3 * w.a), s2: w => eq(w.V / w.a - w.V / w.b, 50), value: w => r6(w.a) };
  },
  'ds-di-range-median': () => ({
    worlds: grid1('x', range(-20, 40, 0.01)),
    s1: w => w.x > 4, s2: w => eq(w.x, median([6, 11, 3, w.x])), value: w => r6(Math.max(6, 11, 3, w.x) - Math.min(6, 11, 3, w.x)),
  }),
  'ds-di-rem12': () => ({
    worlds: grid1('n', range(1, 1200)),
    s1: w => w.n % 4 === 3, s2: w => w.n % 6 === 5, value: w => w.n % 12,
  }),
  'ds-di-sets-both': () => {
    const worlds: World[] = [];
    for (const T of range(0, 100, 5)) for (const G of range(0, 100, 5)) for (let both = 0; both <= Math.min(T, G); both++) {
      const atLeastOne = T + G - both;
      if (atLeastOne <= 100) worlds.push({ T, G, both, N: 100 - atLeastOne });
    }
    return { worlds, s1: w => w.T === 60 && w.G === 50, s2: w => w.N === 10, value: w => w.both };
  },
  'ds-di-ineq-shift': () => ({
    worlds: grid2('x', 'y', range(-10, 10, 0.25)),
    s1: w => w.x > w.y + 3, s2: w => 2 * w.x - 2 * w.y > 5, value: w => 3 * w.x - 2 > 2 * w.x + w.y,
  }),
  'ds-di-prime-count': () => ({
    worlds: grid1('k', range(1, 3000)),
    s1: w => distinctPrimes(2 * w.k) === 3, s2: w => w.k % 15 === 0, value: w => distinctPrimes(w.k),
  }),
  'ds-di-recip': () => ({
    worlds: grid1('x', range(-10, 10, 0.05)).filter(w => w.x !== 0),
    s1: w => w.x * (w.x ** 2 - 1) < 0, s2: w => w.x < 1, value: w => w.x < 1 / w.x,
  }),
  'ds-di-pow7-rem5': () => ({
    worlds: grid1('n', range(1, 400)),
    s1: w => w.n % 3 === 0, s2: w => (w.n * w.n) % 8 === 4, value: w => powMod(7, w.n, 5),
  }),
  'ds-di-abs-lt1': () => ({
    worlds: grid1('x', range(-5, 5, 0.05)),
    s1: w => w.x ** 2 < 2 * w.x, s2: w => w.x ** 3 < w.x, value: w => Math.abs(w.x) < 1,
  }),
  'ds-di-median-mean': () => ({
    // Fine grid plus the analytic roots, since (2) is an equation.
    worlds: [...grid1('x', range(-20, 40, 0.01)), { x: 2 }, { x: 6 }, { x: 14 }],
    s1: w => eq(median([10, 4, 8, w.x]), 9), s2: w => eq(mean([10, 4, 8, w.x]), median([10, 4, 8, w.x])), value: w => r6(w.x),
  }),
  'ds-di-abs-no': () => ({
    worlds: grid1('x', range(-10, 10, 0.05)).filter(w => w.x !== 0),
    s1: w => w.x ** 2 + w.x < 0, s2: w => w.x + 1 / w.x < -2, value: w => Math.abs(w.x - 3) < Math.abs(w.x + 3),
  }),
  'ds-di-divide-x': () => ({
    worlds: grid1('x', range(-20, 20, 0.01)),
    s1: w => eq(w.x ** 2, 4 * w.x), s2: w => eq(w.x ** 3, 16 * w.x), value: w => r6(w.x),
  }),
};

describe('data-insights DS answer keys', () => {
  const dsIds = DATA_INSIGHTS.filter(q => q.topic === 'Data sufficiency').map(q => q.id);
  it('covers every DS question', () => expect(Object.keys(DS_CASES).sort()).toEqual([...dsIds].sort()));
  for (const [id, build] of Object.entries(DS_CASES)) {
    it(id, () => {
      const c = build();
      expect(c.worlds.some(w => c.s1(w) && c.s2(w)), `${id}: statements contradict`).toBe(true);
      expect(LETTER[BY_ID[id].ans]).toBe(dsLetter(c));
    });
  }
});

// ── Tables: compute from the rows the question shows ──

const num = (s: string) => Number(s.replace(/,/g, '').replace('−', '-').replace('+', ''));
const rowsOf = (id: string) => BY_ID[id].table!.rows.map(r => ({ name: r[0], v: r.slice(1).map(num) }));
const winners = (xs: { name: string; score: number }[], best: 'max' | 'min') => {
  const target = best === 'max' ? Math.max(...xs.map(x => x.score)) : Math.min(...xs.map(x => x.score));
  return xs.filter(x => Math.abs(x.score - target) < 1e-9).map(x => x.name);
};
/** The choice that names exactly the winner(s): one name, or "X and Y are tied". */
const isPick = (choice: string, names: string[], all: string[]) =>
  names.length === 1 ? choice === names[0] : choice.includes('tied') && all.every(n => choice.includes(n) === names.includes(n));
const pct = (x: number) => (x >= 0 ? '+' : '−') + Math.abs(x).toFixed(1) + '%';
const signed = (x: number) => (x > 0 ? '+' : x < 0 ? '−' : '') + Math.abs(x);

/** Each entry returns, per choice, whether that choice is correct according to the table. */
const TABLE_CASES: Record<string, () => boolean[]> = {
  'tbl-di-branch-rpe': () => {
    const rows = rowsOf('tbl-di-branch-rpe');
    const w = winners(rows.map(r => ({ name: r.name, score: r.v[2] / r.v[1] })), 'max');
    return BY_ID['tbl-di-branch-rpe'].choices.map(c => isPick(c, w, rows.map(r => r.name)));
  },
  'tbl-di-branch-headcount': () => {
    const rows = rowsOf('tbl-di-branch-headcount');
    const [a, b] = [0, 1].map(i => rows.reduce((s, r) => s + r.v[i], 0));
    return BY_ID['tbl-di-branch-headcount'].choices.map(c => c === pct((100 * (b - a)) / a));
  },
  'tbl-di-chan-cpl': () => {
    const rows = rowsOf('tbl-di-chan-cpl');
    const w = winners(rows.map(r => ({ name: r.name, score: r.v[0] / r.v[1] })), 'min');
    return BY_ID['tbl-di-chan-cpl'].choices.map(c => isPick(c, w, rows.map(r => r.name)));
  },
  'tbl-di-chan-cpc': () => {
    const rows = rowsOf('tbl-di-chan-cpc');
    const w = winners(rows.map(r => ({ name: r.name, score: r.v[0] / ((r.v[1] * r.v[2]) / 100) })), 'min');
    return BY_ID['tbl-di-chan-cpc'].choices.map(c => isPick(c, w, rows.map(r => r.name)));
  },
  'tbl-di-chan-shift': () => {
    const rows = rowsOf('tbl-di-chan-shift');
    const customersPerK = (name: string) => { const r = rows.find(x => x.name === name)!; return (r.v[1] / r.v[0]) * (r.v[2] / 100); };
    const delta = Math.round(20 * (customersPerK('Email') - customersPerK('Social')) * 1e6) / 1e6;
    return BY_ID['tbl-di-chan-shift'].choices.map(c => c === signed(delta));
  },
  'tbl-di-city-ev': () => {
    const rows = rowsOf('tbl-di-city-ev');
    const w = winners(rows.map(r => ({ name: r.name, score: r.v[1] * r.v[2] })), 'max');
    return BY_ID['tbl-di-city-ev'].choices.map(c => isPick(c, w, rows.map(r => r.name)));
  },
  'tbl-di-city-ratio': () => {
    const rows = rowsOf('tbl-di-city-ratio');
    const perK = (name: string) => { const r = rows.find(x => x.name === name)!; return (r.v[1] * r.v[2]) / 100 / r.v[0]; };
    const ratio = perK('Corin') / perK('Dunmore');
    return BY_ID['tbl-di-city-ratio'].choices.map(c => Math.abs(Number(c) - ratio) < 0.05);
  },
  'tbl-di-pay-dollar': () => {
    const rows = rowsOf('tbl-di-pay-dollar');
    const w = winners(rows.map(r => ({ name: r.name, score: (r.v[1] * r.v[2]) / 100 })), 'max');
    return BY_ID['tbl-di-pay-dollar'].choices.map(c => isPick(c, w, rows.map(r => r.name)));
  },
  'tbl-di-pay-total': () => {
    const rows = rowsOf('tbl-di-pay-total');
    const before = rows.reduce((s, r) => s + r.v[0] * r.v[1], 0);
    const after = rows.reduce((s, r) => s + r.v[0] * r.v[1] * (1 + r.v[2] / 100), 0);
    return BY_ID['tbl-di-pay-total'].choices.map(c => c === pct((100 * (after - before)) / before));
  },
  'tbl-di-hotel-points': () => {
    const rows = rowsOf('tbl-di-hotel-points');
    const w = winners(rows.map(r => ({ name: r.name, score: r.v[2] - r.v[1] })), 'max');
    return BY_ID['tbl-di-hotel-points'].choices.map(c => isPick(c, w, rows.map(r => r.name)));
  },
  'tbl-di-hotel-combined': () => {
    const rows = rowsOf('tbl-di-hotel-combined');
    const rooms = rows.reduce((s, r) => s + r.v[0], 0);
    const occ = rows.reduce((s, r) => s + (r.v[0] * r.v[2]) / 100, 0);
    return BY_ID['tbl-di-hotel-combined'].choices.map(c => c === ((100 * occ) / rooms).toFixed(1) + '%');
  },
  'tbl-di-hotel-true': () => {
    const rows = rowsOf('tbl-di-hotel-true');
    const h = (name: string) => rows.find(r => r.name === name)!.v; // [rooms, q1, q2, rate]
    const occ = (name: string, q: 1 | 2) => (h(name)[0] * h(name)[q]) / 100;
    const rev = (name: string) => occ(name, 2) * h(name)[3];
    const revpar = (name: string) => rev(name) / h(name)[0];
    const names = rows.map(r => r.name);
    const total = (q: 1 | 2) => names.reduce((s, n) => s + occ(n, q), 0);
    const truth = [
      total(2) > total(1),
      occ('Plaza', 2) > occ('Harbor', 2) + occ('Summit', 2),
      rev('Plaza') > rev('Harbor') + rev('Summit'),
      rev('Summit') > rev('Harbor'),
      names.every(n => n === 'Plaza' || revpar('Plaza') < revpar(n)),
    ];
    return truth;
  },
};

describe('data-insights table answer keys', () => {
  const ids = DATA_INSIGHTS.filter(q => q.topic === 'Tables').map(q => q.id);
  it('covers every table question', () => expect(Object.keys(TABLE_CASES).sort()).toEqual([...ids].sort()));
  for (const [id, derive] of Object.entries(TABLE_CASES)) {
    it(id, () => {
      const correct = derive();
      expect(correct.filter(Boolean).length, `${id}: number of correct choices`).toBe(1);
      expect(correct.indexOf(true)).toBe(BY_ID[id].ans);
    });
  }
});
