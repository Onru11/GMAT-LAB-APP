import { describe, expect, it } from 'vitest';
import { LESSONS } from './lessons';
import { TOPICS } from '../../data';

const slug = (s: string) =>
  s.toLowerCase().replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

/** The answer's digits as a standalone number (not part of a longer number). */
const containsNumber = (text: string, n: number) => {
  const digits = String(Math.abs(n)).replace('.', '\\.');
  return new RegExp(`(?<![\\d.])${digits}(?![\\d]|\\.\\d)`).test(text.replace(/(\d),(?=\d{3})/g, '$1'));
};

// Every number-kind answer re-derived from the numbers in its prompt.
const EXPECTED: Record<string, [number, number]> = {
  'percents-1': [((46000 - 40000) / 40000) * 100, ((250 - 200) / 250) * 100],
  'percents-2': [1.5 * 0.5 * 100, (1.1 * 1.2 - 1) * 100],
  'fractions-1': [(3 / 5) * (5 / 8) * 160, (4 / 9) * (3 / 4) * 72],
  'fractions-2': [
    (() => { const rest = 120 * (1 - 1 / 4); return rest - rest / 3; })(),
    (() => { const rest = 600 * (1 - 1 / 2); return rest - (2 / 5) * rest; })(),
  ],
  'ratios-mixtures-1': [(72 / (4 + 5)) * 5, (1200 / 3) * (3 + 5)],
  'ratios-mixtures-2': [
    ((0.1 * 30 + 0.5 * 10) / (30 + 10)) * 100,
    (0.4 * 20) / 0.25 - 20,
  ],
  'rates-work-1': [18 * (2 + 20 / 60), 150 / (2 + 30 / 60)],
  'rates-work-2': [1 / (1 / 4 + 1 / 12), 1 / (1 / 6 - 1 / 10)],
  'number-properties-1': [
    (() => { let c = 0; for (let d = 1; d <= 180; d++) if (180 % d === 0) c++; return c; })(),
    (() => { for (let k = 1; ; k++) if (Number.isInteger(Math.sqrt(24 * k))) return k; })(),
  ],
  'number-properties-2': [
    (() => { const n = [4, 10, 16, 22].map(v => (5 * v) % 6); return new Set(n).size === 1 ? n[0] : NaN; })(),
    (() => { const n = [7, 16, 25, 34].map(v => (v + 15) % 9); return new Set(n).size === 1 ? n[0] : NaN; })(),
  ],
  'exponents-roots-1': [Math.log(9 ** 4) / Math.log(3), 11 - Math.log2(4 ** 3)],
  'exponents-roots-2': [Math.log(3 * 3 ** 8) / Math.log(3), (2 ** 12 - 2 ** 10) / 2 ** 10],
  'algebra-1': [
    (23 - 7) / (3 - -1),
    (17 + 19) / 4,
  ],
  'algebra-2': [
    (() => { const roots = [0, 7].filter(x => x * x === 7 * x && x !== 7); return roots.length === 1 ? roots[0] : NaN; })(),
    (() => { const d = Math.sqrt(4 + 60); return (2 + d) / 2 + (2 - d) / 2; })(),
  ],
  'inequalities-absolute-value-1': [
    (() => { let best = -Infinity; for (let x = -100; x <= 100; x += 0.5) if (-2 * x + 7 >= 1) best = x; return best; })(),
    (() => { for (let x = -100; x <= 100; x++) if (5 - 3 * x < -10) return x; return NaN; })(),
  ],
  'inequalities-absolute-value-2': [
    (9 - 1) / 2 + (-9 - 1) / 2,
    (() => { let c = 0; for (let x = -100; x <= 100; x++) if (Math.abs(x - 4) < 3) c++; return c; })(),
  ],
  'statistics-1': [6 * 15 - 5 * 14, (4 * 10 + 25) / 5],
  'statistics-2': [(20 * 70 + 30 * 80) / 50, (3 * 4 + 1 * 8) / 4],
  'counting-probability-1': [3 * 3 * 10 * 10 * 10, 5 * 4 * 3 * 2 * 1],
  'counting-probability-2': [1 - 0.1 * 0.1, 1 - (3 / 5) * (2 / 4)],
  'tables-1': [
    (() => { const s = [120, 95, 140, 85].sort((a, b) => a - b); return (s[1] + s[2]) / 2; })(),
    (() => { const v = [30, 45, 25, 50, 40]; const m = v.reduce((a, b) => a + b) / v.length; return v.filter(x => x > m).length; })(),
  ],
  'tables-2': [
    Math.max(((92 - 80) / 80) * 100, ((50 - 40) / 40) * 100, ((132 - 120) / 120) * 100),
    40 * 0.25 + 60 * 0.1 + 100 * 0.12,
  ],
};

describe('lessons', () => {
  it('has 38 lessons, 2 per topic with orders 1 and 2, covering every topic', () => {
    expect(TOPICS).toHaveLength(19);
    expect(LESSONS).toHaveLength(38);
    const known = new Set(TOPICS.map(t => t.name));
    for (const l of LESSONS) expect(known.has(l.topic), l.id).toBe(true);
    for (const t of TOPICS) {
      const orders = LESSONS.filter(l => l.topic === t.name).map(l => l.order).sort();
      expect(orders, t.name).toEqual([1, 2]);
    }
  });

  it('has unique ids of the form <topic-slug>-<order>', () => {
    expect(new Set(LESSONS.map(l => l.id)).size).toBe(LESSONS.length);
    for (const l of LESSONS) expect(l.id).toBe(`${slug(l.topic)}-${l.order}`);
  });

  it('keeps headlines short and the shape complete', () => {
    for (const l of LESSONS) {
      expect(words(l.rule.headline), l.id).toBeLessThanOrEqual(10);
      expect(l.rule.body.length, l.id).toBeGreaterThan(0);
      expect(l.example.lines.length, l.id).toBeGreaterThanOrEqual(2);
      expect(l.example.lines.length, l.id).toBeLessThanOrEqual(4);
      expect(l.trap.title.length, l.id).toBeGreaterThan(0);
      expect(l.guided, l.id).toHaveLength(2);
    }
  });

  it('uses number guided questions for Quant and Tables, choice for Verbal and DS', () => {
    const sec = new Map(TOPICS.map(t => [t.name, t.sec]));
    for (const l of LESSONS) {
      const want = sec.get(l.topic) === 'Verbal' || l.topic === 'Data sufficiency' ? 'choice' : 'number';
      for (const g of l.guided) expect(g.kind, l.id).toBe(want);
    }
  });

  it('has valid choice questions', () => {
    for (const l of LESSONS)
      for (const g of l.guided) {
        if (g.kind !== 'choice') continue;
        expect(g.choices.length, l.id).toBeGreaterThanOrEqual(3);
        expect(g.choices.length, l.id).toBeLessThanOrEqual(5);
        expect(new Set(g.choices).size, l.id).toBe(g.choices.length);
        expect(Number.isInteger(g.ans), l.id).toBe(true);
        expect(g.ans, l.id).toBeGreaterThanOrEqual(0);
        expect(g.ans, l.id).toBeLessThan(g.choices.length);
      }
  });

  it('never reveals the answer in the hint', () => {
    for (const l of LESSONS)
      for (const g of l.guided) {
        if (g.kind === 'number') expect(containsNumber(g.bad, g.ans), `${l.id}: ${g.bad}`).toBe(false);
        else expect(g.bad.includes(g.choices[g.ans]), `${l.id}: ${g.bad}`).toBe(false);
      }
  });

  it('recomputes every number answer from its prompt', () => {
    const numberLessons = LESSONS.filter(l => l.guided.some(g => g.kind === 'number'));
    expect(Object.keys(EXPECTED).sort()).toEqual(numberLessons.map(l => l.id).sort());
    for (const l of numberLessons)
      l.guided.forEach((g, i) => {
        expect(g.kind, l.id).toBe('number');
        if (g.kind !== 'number') return;
        expect(g.ans, `${l.id} q${i + 1}`).toBeCloseTo(EXPECTED[l.id][i], 9);
      });
  });

  it('reproduces the existing "Two changes in a row" lesson', () => {
    const l = LESSONS.find(x => x.id === 'percents-2')!;
    expect(l.rule.headline).toBe('Percent changes multiply. They never add.');
    expect(l.example.lines).toEqual(['+10% → ×1.1, twice', '1.1 × 1.1 = 1.21', 'Total change = +21%, not +20%']);
    expect(l.trap.title).toBe('+20% then −20% is not 0%');
    expect(l.guided.map(g => (g.kind === 'number' ? [g.ans, g.unit] : null))).toEqual([[75, '%'], [32, '%']]);
  });
});
