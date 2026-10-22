// Sample content for the prototype build. Everything here is fixed demo data
// lifted from the Claude Design handoff (project/GMAT Lab.dc.html).

import type { Section } from './content/questions';
export type { Section };

export interface LessonQuestion {
  label: string;
  head: string;
  ans: number;
  ok: string;
  bad: string;
}

export interface Deck {
  name: string;
  due: number;
  cards: [front: string, back: string][];
}

export interface Topic {
  sec: Section;
  name: string;
  /** -1 = not started, 0–4 indexes LEVELS. */
  level: number;
  acc: number | null;
}

export interface Phase {
  name: string;
  sub: string;
  tag: 'In progress' | 'Up next' | 'Daily CR' | 'Locked';
  topics: { name: string; level: number; status: string; current?: boolean }[];
}

/** Sample mistakes; `due` becomes a real next-review date when loaded. */
export interface SampleMistake {
  topic: string;
  title: string;
  reason: string;
  /** Leitner step 0–3. */
  box: number;
  due: boolean;
  /** Question id in the bank. */
  qid: string;
}

export interface Score {
  date: string;
  label: string;
  total: number;
  q: number;
  v: number;
  di: number;
}

export interface QueueItem {
  title: string;
  meta: string;
  min: number;
  verb: string;
  why: string;
}

export const LEVELS = ['Foundation', 'Building', 'Solid ~600', 'Strong ~655', 'Elite 705+'];
export const levelName = (l: number) => (l < 0 ? 'Not started' : LEVELS[l]);
export const LETTERS = 'ABCDE';
export const MISS_REASONS = ["Didn't know how", 'Careless slip', 'Misread the question', 'Rushed or too slow'];

export const LESSON_QUESTIONS: LessonQuestion[] = [
  {
    label: 'Guided question 1 of 2',
    head: 'A stock rises 50%, then falls 50%. Its final value is what percent of the original?',
    ans: 75,
    ok: '1.5 × 0.5 = 0.75. Down 25% overall.',
    bad: 'Multiply the multipliers: 1.5 × 0.5.',
  },
  {
    label: 'Guided question 2 of 2 · Watch the question word',
    head: 'A salary rises 10%, then rises another 20%. By what percent did it increase in total?',
    ans: 32,
    ok: '1.1 × 1.2 = 1.32, so +32%. The question asks for the increase, not the final percent.',
    bad: 'Not 30%. Try 1.1 × 1.2, then subtract 100%.',
  },
];

export const LESSON_STEPS = 5;

export const SPRINT: [problem: string, answer: number][] = [
  ['14 × 6', 84], ['156 ÷ 12', 13], ['25% of 64', 16], ['17 + 48', 65], ['13²', 169],
  ['91 − 37', 54], ['15 × 12', 180], ['¾ of 96', 72], ['2⁷', 128], ['0.2 × 450', 90],
  ['144 ÷ 16', 9], ['38 + 57', 95], ['19 × 5', 95], ['40% of 85', 34], ['11 × 13', 143],
  ['225 ÷ 15', 15], ['6³', 216], ['120% of 50', 60], ['84 − 29', 55], ['16 × 25', 400],
];

export const DECKS: Deck[] = [
  { name: 'Squares 11–25', due: 12, cards: [['17²', '289'], ['13²', '169'], ['19²', '361'], ['23²', '529'], ['14²', '196'], ['24²', '576']] },
  { name: 'Cubes', due: 4, cards: [['6³', '216'], ['7³', '343'], ['4³', '64'], ['9³', '729']] },
  { name: 'Powers', due: 6, cards: [['2¹⁰', '1024'], ['3⁵', '243'], ['5⁴', '625'], ['2⁷', '128']] },
  { name: 'Square roots', due: 0, cards: [['√2', '1.41'], ['√3', '1.73'], ['√5', '2.24'], ['√196', '14']] },
  { name: 'Simplifying roots', due: 3, cards: [['√50', '5√2'], ['√72', '6√2'], ['√48', '4√3'], ['√45', '3√5']] },
  { name: 'Prime factorisation', due: 5, cards: [['84', '2²·3·7'], ['126', '2·3²·7'], ['360', '2³·3²·5'], ['91', '7·13']] },
  { name: 'Prime or not?', due: 0, cards: [['91', 'Not prime · 7×13'], ['97', 'Prime'], ['51', 'Not prime · 3×17'], ['89', 'Prime']] },
  { name: 'Fractions → percents', due: 8, cards: [['1/8', '12.5%'], ['3/8', '37.5%'], ['1/6', '16.7%'], ['5/8', '62.5%']] },
  { name: 'Percents in your head', due: 0, cards: [['15% of 80', '12'], ['35% of 60', '21'], ['12.5% of 64', '8'], ['45% of 200', '90']] },
  { name: 'Exponent rules', due: 2, cards: [['aᵐ · aⁿ', 'aᵐ⁺ⁿ'], ['(aᵐ)ⁿ', 'aᵐⁿ'], ['a⁻ⁿ', '1/aⁿ'], ['a⁰', '1']] },
  { name: 'Rules & formulas', due: 3, cards: [['Work', 'Rate × time'], ['Average', 'Sum ÷ count'], ['a% then b%', 'a + b + ab/100'], ['Divisible by 3', 'Digit sum ÷ 3']] },
];

export const LEITNER_BOXES = ['1 day', '3 days', '7 days', '14 days'];

export const TOPICS: Topic[] = (
  [
    ['Quant', 'Percents', 1, 71], ['Quant', 'Fractions', 1, 74], ['Quant', 'Ratios & mixtures', 0, 60],
    ['Quant', 'Rates & work', 0, 49], ['Quant', 'Number properties', 0, 52], ['Quant', 'Exponents & roots', 1, 63],
    ['Quant', 'Algebra', 0, 58], ['Quant', 'Inequalities & absolute value', -1, null], ['Quant', 'Statistics', 1, 70],
    ['Quant', 'Counting & probability', -1, null],
    ['Data Insights', 'Data sufficiency', 1, 61], ['Data Insights', 'Tables', 2, 77],
    ['Verbal', 'Assumption', 2, 78], ['Verbal', 'Strengthen', 2, 81], ['Verbal', 'Weaken', 1, 69],
    ['Verbal', 'Inference', 1, 66], ['Verbal', 'Evaluate', 0, 55], ['Verbal', 'Paradox', 1, 72],
    ['Verbal', 'Reading Comprehension', 2, 80],
  ] as [Section, string, number, number | null][]
).map(([sec, name, level, acc]) => ({ sec, name, level, acc }));

export const PHASES: Phase[] = [
  {
    name: 'Quant foundations', sub: 'Arithmetic without a calculator', tag: 'In progress',
    topics: [
      { name: 'Mental arithmetic', level: 2, status: '3 of 3 lessons · drills daily' },
      { name: 'Fractions', level: 1, status: '2 of 4 lessons' },
      { name: 'Percents', level: 1, status: 'Lesson 3 of 5', current: true },
      { name: 'Number properties', level: 0, status: '1 of 5 lessons' },
      { name: 'Exponents & roots', level: 1, status: '2 of 4 lessons' },
    ],
  },
  {
    name: 'Algebra & word problems', sub: 'Equations, rates, mixtures, counting', tag: 'Up next',
    topics: [
      { name: 'Algebra', level: 0, status: 'Not started' },
      { name: 'Inequalities & absolute value', level: -1, status: 'Not started' },
      { name: 'Ratios & mixtures', level: 0, status: 'Not started' },
      { name: 'Rates & work', level: 0, status: 'Not started' },
      { name: 'Statistics', level: 1, status: 'Not started' },
      { name: 'Counting & probability', level: -1, status: 'Not started' },
    ],
  },
  {
    name: 'Verbal', sub: 'Critical Reasoning daily, RC later', tag: 'Daily CR',
    topics: [
      { name: 'Assumption', level: 2, status: '2 of 2 lessons' },
      { name: 'Strengthen', level: 2, status: '2 of 2 lessons' },
      { name: 'Weaken', level: 1, status: '1 of 2 lessons' },
      { name: 'Inference', level: 1, status: '1 of 2 lessons' },
      { name: 'Evaluate', level: 0, status: 'Not started' },
      { name: 'Paradox', level: 1, status: '1 of 1 lessons' },
      { name: 'Reading Comprehension', level: 2, status: '1 of 3 lessons' },
    ],
  },
  {
    name: 'Data Insights', sub: 'DS, tables, graphs, multi-source', tag: 'Locked',
    topics: [
      { name: 'Data sufficiency', level: 1, status: 'Unlocks after phase 2' },
      { name: 'Tables', level: 2, status: 'Unlocks after phase 2' },
      { name: 'Graphics interpretation', level: -1, status: 'Unlocks after phase 2' },
      { name: 'Two-part analysis', level: -1, status: 'Unlocks after phase 2' },
      { name: 'Multi-source reasoning', level: -1, status: 'Unlocks after phase 2' },
    ],
  },
  {
    name: 'Mixed timed practice', sub: 'Section-length sets at exam pace', tag: 'Locked',
    topics: [
      { name: 'Mixed Quant sets', level: -1, status: 'Locked' },
      { name: 'Mixed Verbal sets', level: -1, status: 'Locked' },
      { name: 'Mixed DI sets', level: -1, status: 'Locked' },
    ],
  },
  {
    name: 'Peak & exam', sub: 'Full mocks, review, exam day', tag: 'Locked',
    topics: [
      { name: 'Full-length mocks', level: -1, status: 'Locked' },
      { name: 'Exam-day strategy', level: -1, status: 'Locked' },
    ],
  },
];

export const PERCENT_LESSONS: [mark: string, name: string, current: boolean][] = [
  ['✓', 'Percent basics', false],
  ['✓', 'Percent change', false],
  ['→', 'Two changes in a row', true],
  ['4', 'Watch the question word', false],
  ['5', 'Reverse percents', false],
];

export const INITIAL_MISTAKES: SampleMistake[] = [
  { topic: 'Percents', title: 'Successive % change', reason: 'Misread the question', box: 1, due: true, qid: 'pct-raise-cut' },
  { topic: 'Number properties', title: 'Is x > 0? · DS with x²', reason: "Didn't know how", box: 0, due: true, qid: 'ds-sign' },
  { topic: 'Exponents & roots', title: 'Rewrite on base 2', reason: 'Careless slip', box: 2, due: true, qid: 'exp-same-base' },
  { topic: 'Weaken', title: 'Alternative cause', reason: 'Rushed or too slow', box: 1, due: false, qid: 'cr-streetlights' },
  { topic: 'Tables', title: 'Percent vs raw change', reason: 'Misread the question', box: 3, due: false, qid: 'tbl-sales-pct' },
  { topic: 'Percents', title: 'Percent of vs percent more', reason: 'Careless slip', box: 0, due: false, qid: 'pct-markup-discount' },
];

export const INITIAL_SCORES: Score[] = [
  { date: 'Aug 22', label: 'Baseline · Official Practice 1', total: 375, q: 62, v: 73, di: 70 },
  { date: 'Sep 19', label: 'Official Practice 2', total: 425, q: 65, v: 75, di: 71 },
  { date: 'Oct 17', label: 'Official Practice 3', total: 465, q: 67, v: 76, di: 73 },
];

export const QUEUE: QueueItem[] = [
  { title: 'Flashcards', meta: 'Squares 11–25 · 12 due', min: 4, verb: 'cards', why: 'Instant squares turn 30-second steps into 3-second ones.' },
  { title: 'Mental maths sprint', meta: '20 items · last 2:58, beat 2:45', min: 3, verb: 'sprint', why: 'No calculator on Quant. Speed here buys time for DS and CR.' },
  { title: 'Lesson: Two changes in a row', meta: 'Percents · lesson 3 of 5', min: 8, verb: 'lesson', why: 'Percents are your most common miss. This lesson targets the exact trap.' },
  { title: 'Mistake review', meta: '3 due · Percents, Exponents, DS', min: 5, verb: 'review', why: 'Three misses are due today. Clean answers move them toward cleared.' },
  { title: 'Critical Reasoning set', meta: 'Weaken · timed', min: 8, verb: 'set', why: 'Daily CR keeps Verbal climbing while Quant foundations build.' },
];

export const TOOLS: [name: string, rule: string, note: string][] = [
  ['Successive percent change', 'a + b + ab/100', '+20% then −20% → 20 − 20 − 4 = −4%.'],
  ['Exponent rules', 'aᵐ·aⁿ = aᵐ⁺ⁿ   (aᵐ)ⁿ = aᵐⁿ', 'Rewrite every term on one base before comparing.'],
  ['Data sufficiency order', 'AD / BCE', 'Judge (1) alone first. Sufficient → A or D. Not → B, C or E.'],
  ['Rates & work', 'Work = rate × time', 'Rates add when working together: 1/a + 1/b = 1/t.'],
  ['Divisibility', '3 and 9: digit sum · 4: last two digits', '6 needs 2 and 3. 12 needs 3 and 4.'],
  ['Averages', 'Sum = average × count', 'Most average questions are really sum questions.'],
];
