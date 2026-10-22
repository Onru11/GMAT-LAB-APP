// The question bank. Every Quant and Data Insights answer is re-derived
// independently in questions.test.ts, so a typo in `ans` fails the build.

export type Section = 'Quant' | 'Data Insights' | 'Verbal';

export interface StemPart {
  t: string;
  /** Superscript that follows `t`. */
  s?: string;
}

export interface DsStatement {
  t: string;
  s?: string;
  t2?: string;
}

export interface Question {
  id: string;
  section: Section;
  topic: string;
  kind: string;
  /** 0 Foundation … 4 Elite, matching LEVELS. */
  level: number;
  stem: StemPart[];
  /** Data Sufficiency statements (1) and (2). */
  st?: DsStatement[];
  passage?: string;
  table?: { head: string[]; rows: string[][] };
  choices: string[];
  ans: number;
  steps: string[];
  fast: string;
  alt: string;
}

const PS = 'Problem solving';
const DS = 'Data sufficiency';
const CR = 'Critical reasoning';
const TABLE = 'Data Insights · Table';

export const DS_CHOICES = [
  'Statement (1) ALONE is sufficient, but statement (2) alone is not sufficient.',
  'Statement (2) ALONE is sufficient, but statement (1) alone is not sufficient.',
  'BOTH statements TOGETHER are sufficient, but NEITHER statement ALONE is sufficient.',
  'EACH statement ALONE is sufficient.',
  'Statements (1) and (2) TOGETHER are NOT sufficient.',
];
const [A, B, C, D, E] = [0, 1, 2, 3, 4];

const q = (section: Section, topic: string, kind: string) =>
  (id: string, level: number, rest: Omit<Question, 'id' | 'section' | 'topic' | 'kind' | 'level'>): Question => ({ id, section, topic, kind, level, ...rest });
const quant = (topic: string) => q('Quant', topic, PS);
const ds = q('Data Insights', 'Data sufficiency', DS);
const tableQ = q('Data Insights', 'Tables', TABLE);
const cr = (topic: string) => q('Verbal', topic, CR);
const text = (t: string): StemPart[] => [{ t }];

// ── Quant ────────────────────────────────────────────────────────────────

const percents = quant('Percents');
const fractions = quant('Fractions');
const ratios = quant('Ratios & mixtures');
const rates = quant('Rates & work');
const numprop = quant('Number properties');
const expo = quant('Exponents & roots');
const algebra = quant('Algebra');
const ineq = quant('Inequalities & absolute value');
const stats = quant('Statistics');
const counting = quant('Counting & probability');

const QUANT: Question[] = [
  percents('pct-raise-cut', 2, {
    stem: text("A jacket's price is raised by 20%, and then the new price is cut by 20%. The final price is what percent of the original price?"),
    choices: ['100%', '98%', '96%', '94%', '80%'],
    ans: C,
    steps: ['Turn each change into a multiplier: +20% is ×1.2, −20% is ×0.8.', 'Multiply the multipliers: 1.2 × 0.8 = 0.96.', 'The final price is 96% of the original.'],
    fast: 'Successive change: a + b + ab/100 = 20 − 20 − 4 = −4%. So 96%. Ten seconds, no multiplying.',
    alt: 'Start from $100. Up 20% gives $120. 20% of $120 is $24, so it falls to $96. The cut acts on a bigger base than the raise did.',
  }),
  percents('pct-markup-discount', 1, {
    stem: text('A store marks up an $80 item by 25%, then offers 10% off the marked price. What is the sale price?'),
    choices: ['$86', '$88', '$90', '$92', '$94'],
    ans: C,
    steps: ['Markup: 80 × 1.25 = 100.', 'Discount: 100 × 0.9 = 90.', 'The sale price is $90.'],
    fast: '25% up on 80 is a round 100, and 10% off 100 is 90. Look for the round number in the middle.',
    alt: 'Combine first: 1.25 × 0.9 = 1.125, so the price is 12.5% above $80, which is $80 + $10 = $90.',
  }),
  percents('pct-reverse', 1, {
    stem: text('After a 20% decrease, a price is $64. What was the price before the decrease?'),
    choices: ['$76.80', '$78.00', '$80.00', '$82.00', '$84.00'],
    ans: C,
    steps: ['After a 20% decrease the price is 80% of the original: 0.8 × P = 64.', 'P = 64 ÷ 0.8 = 80.', 'The original price was $80.'],
    fast: 'Reverse percents divide; they never add back. 64 ÷ 0.8 = 80.',
    alt: 'The trap is adding 20% of 64 (= $76.80). Check any answer by applying the cut: 80 − 16 = 64. Only $80 survives.',
  }),
  percents('pct-growth-reverse', 2, {
    stem: text("A town's population grew 10% in each of two years and was 24,200 at the end of the second year. What was it at the start?"),
    choices: ['19,800', '20,000', '20,167', '20,500', '22,000'],
    ans: B,
    steps: ['Two 10% rises multiply: 1.1 × 1.1 = 1.21.', 'Start × 1.21 = 24,200.', 'Start = 24,200 ÷ 1.21 = 20,000.'],
    fast: '24,200 ÷ 1.21: notice 121 × 200 = 24,200. Clean numbers are a hint you are on track.',
    alt: 'Work backward one year at a time: 24,200 ÷ 1.1 = 22,000, then 22,000 ÷ 1.1 = 20,000.',
  }),

  fractions('frac-of-of', 0, {
    stem: text('What is 3/4 of 2/3 of 48?'),
    choices: ['16', '18', '24', '32', '36'],
    ans: C,
    steps: ['"Of" means multiply: 3/4 × 2/3 × 48.', '3/4 × 2/3 = 6/12 = 1/2.', '1/2 × 48 = 24.'],
    fast: 'Cancel before you multiply: the 3s cancel and 2/4 is 1/2. Half of 48.',
    alt: 'Go in order: 2/3 of 48 is 32, and 3/4 of 32 is 24.',
  }),
  fractions('frac-greatest', 1, {
    stem: text('Which of the following is greatest?'),
    choices: ['5/8', '3/5', '7/12', '2/3', '9/16'],
    ans: D,
    steps: ['Compare each to a benchmark: 5/8 = 0.625, 3/5 = 0.6, 7/12 ≈ 0.583, 2/3 ≈ 0.667, 9/16 = 0.5625.', '2/3 is the largest.'],
    fast: 'Distance from 1: 2/3 is 1/3 short, 5/8 is 3/8 short, 3/5 is 2/5 short. The smallest gap wins.',
    alt: 'Use a common denominator of 240: 150, 144, 140, 160, 135. 160/240 = 2/3 is greatest.',
  }),
  fractions('frac-tank', 2, {
    stem: text('A tank is 1/3 full. After 12 liters are added, it is 3/4 full. What is the capacity of the tank, in liters?'),
    choices: ['24', '28.8', '30', '32', '36'],
    ans: B,
    steps: ['The 12 liters fill 3/4 − 1/3 of the tank.', '3/4 − 1/3 = 9/12 − 4/12 = 5/12.', 'Capacity = 12 ÷ (5/12) = 144/5 = 28.8.'],
    fast: 'Find the fraction the added amount covers, then divide. Twelve liters is five twelfths.',
    alt: 'If 5/12 of the tank is 12 liters, 1/12 is 2.4 liters, so the whole is 12 × 2.4 = 28.8.',
  }),

  ratios('ratio-class', 0, {
    stem: text('The ratio of boys to girls in a class of 40 is 3 : 5. How many girls are in the class?'),
    choices: ['15', '20', '24', '25', '30'],
    ans: D,
    steps: ['3 + 5 = 8 parts.', '40 ÷ 8 = 5 students per part.', 'Girls = 5 parts × 5 = 25.'],
    fast: 'Girls are 5/8 of the class: 5/8 × 40 = 25.',
    alt: '15 is the trap: it is the number of boys. Always check which part the question asks for.',
  }),
  ratios('ratio-chain', 1, {
    stem: text('If a : b = 2 : 3 and b : c = 4 : 5, what is a : c?'),
    choices: ['2 : 5', '8 : 15', '3 : 5', '6 : 5', '8 : 5'],
    ans: B,
    steps: ['Make b the same in both ratios: b is 3 in one and 4 in the other, so scale to 12.', 'a : b = 8 : 12 and b : c = 12 : 15.', 'So a : c = 8 : 15.'],
    fast: 'Chain ratios multiply: a/c = (a/b)(b/c) = (2/3)(4/5) = 8/15.',
    alt: 'Pick b = 12. Then a = 8 and c = 15.',
  }),
  ratios('mix-alcohol', 2, {
    stem: text('A 40-liter mixture is 25% alcohol. How many liters of pure alcohol must be added to make the mixture 40% alcohol?'),
    choices: ['6', '8', '10', '12', '15'],
    ans: C,
    steps: ['Alcohol now: 0.25 × 40 = 10 liters.', 'After adding x: (10 + x) ÷ (40 + x) = 0.4.', '10 + x = 16 + 0.4x, so 0.6x = 6 and x = 10.'],
    fast: 'Track what does NOT change: 30 liters of non-alcohol must become 60% of the new total, so the total is 50 and you add 10.',
    alt: 'Test an answer: add 10 to get 20 alcohol in 50 liters = 40%. It works.',
  }),

  rates('work-pipes', 1, {
    stem: text('Pipe A can fill a tank in 6 hours and pipe B in 3 hours. Working together, how long do they take?'),
    choices: ['1.5 hours', '2 hours', '2.5 hours', '4.5 hours', '9 hours'],
    ans: B,
    steps: ['Rates add: 1/6 + 1/3 = 1/6 + 2/6 = 3/6 = 1/2 tank per hour.', 'Time = 1 ÷ (1/2) = 2 hours.'],
    fast: 'Two workers: time = ab ÷ (a + b) = 18 ÷ 9 = 2.',
    alt: 'Together must be faster than the faster pipe alone (3 h). Only 1.5 and 2 qualify, and 1.5 would need both pipes as fast as B.',
  }),
  rates('rate-avg-speed', 2, {
    stem: text('A car drives 120 miles at 40 mph and returns the same 120 miles at 60 mph. What is its average speed for the whole trip?'),
    choices: ['45 mph', '48 mph', '50 mph', '52 mph', '55 mph'],
    ans: B,
    steps: ['Time out: 120 ÷ 40 = 3 h. Time back: 120 ÷ 60 = 2 h.', 'Average speed = total distance ÷ total time = 240 ÷ 5 = 48 mph.'],
    fast: 'Equal distances: average speed = 2ab ÷ (a + b) = 4800 ÷ 100 = 48.',
    alt: '50 is the trap. The car spends more time at the slower speed, so the average leans toward 40.',
  }),
  rates('work-solo', 2, {
    stem: text('A can finish a job alone in 10 days. A and B together finish it in 6 days. How many days would B take alone?'),
    choices: ['4', '12', '15', '16', '20'],
    ans: C,
    steps: ["B's rate = together − A = 1/6 − 1/10.", '1/6 − 1/10 = 5/30 − 3/30 = 2/30 = 1/15.', 'B takes 15 days.'],
    fast: 'Subtract rates, never times. 10 − 6 = 4 is the trap.',
    alt: 'Say the job is 30 units. Together 5 a day, A does 3, so B does 2 a day: 30 ÷ 2 = 15.',
  }),

  numprop('np-remainder-pow2', 2, {
    stem: [{ t: 'What is the remainder when 2' , s: '10' }, { t: ' is divided by 7?' }],
    choices: ['1', '2', '3', '4', '5'],
    ans: B,
    steps: ['Powers of 2 mod 7 cycle: 2, 4, 1, 2, 4, 1, …', 'The cycle has length 3; 10 = 3 × 3 + 1.', 'So 2¹⁰ leaves the same remainder as 2¹, which is 2.'],
    fast: '2³ = 8 = 7 + 1, so 2³ ≡ 1. Then 2¹⁰ = (2³)³ · 2 ≡ 2.',
    alt: '2¹⁰ = 1024 and 7 × 146 = 1022, leaving 2.',
  }),
  numprop('np-divisors', 2, {
    stem: text('How many positive divisors does 72 have?'),
    choices: ['6', '8', '10', '12', '14'],
    ans: D,
    steps: ['Factor: 72 = 2³ × 3².', 'Add 1 to each exponent and multiply: (3 + 1)(2 + 1) = 12.'],
    fast: 'Prime-factor, then (exponent + 1) for each prime, multiplied.',
    alt: 'List pairs: 1×72, 2×36, 3×24, 4×18, 6×12, 8×9. Six pairs, 12 divisors.',
  }),
  numprop('np-odd-even', 1, {
    stem: text('If n is an odd integer, which of the following must be even?'),
    choices: ['n + 2', '3n', 'n²', 'n² + 1', '2n + 1'],
    ans: D,
    steps: ['Odd × odd = odd, so n² is odd.', 'Odd + 1 = even, so n² + 1 is even.', 'Every other choice is odd for any odd n.'],
    fast: 'Plug in n = 1: 3, 3, 1, 2, 3. Only one is even.',
    alt: 'Adding an even number keeps parity; adding an odd number flips it. n² is odd, and +1 flips it to even.',
  }),
  numprop('np-lcm', 0, {
    stem: text('What is the least common multiple of 12 and 18?'),
    choices: ['6', '24', '36', '54', '216'],
    ans: C,
    steps: ['12 = 2² × 3 and 18 = 2 × 3².', 'Take the highest power of each prime: 2² × 3² = 36.'],
    fast: 'Count up multiples of the larger number: 18, 36. 36 is divisible by 12.',
    alt: '6 is the greatest common factor, not the LCM. LCM × GCF = 12 × 18 = 216, so LCM = 216 ÷ 6 = 36.',
  }),

  expo('exp-same-base', 1, {
    stem: [{ t: 'If 2', s: 'x' }, { t: ' · 4', s: '3' }, { t: ' = 2', s: '10' }, { t: ', what is the value of x?' }],
    choices: ['2', '3', '4', '5', '7'],
    ans: C,
    steps: ['Rewrite 4 as 2²: 4³ = (2²)³ = 2⁶.', 'Combine: 2ˣ · 2⁶ = 2ˣ⁺⁶.', 'Set the exponents equal: x + 6 = 10, so x = 4.'],
    fast: 'Put every term on the same base, then compare exponents. Never compute 4³ = 64.',
    alt: 'Think in doublings. 4³ = 64 is six doublings of 1. 2¹⁰ needs ten, so 2ˣ supplies the other four.',
  }),
  expo('exp-roots-add', 1, {
    stem: text('√50 + √18 = ?'),
    choices: ['4√2', '6√2', '8√2', '2√17', '15'],
    ans: C,
    steps: ['√50 = √(25 × 2) = 5√2.', '√18 = √(9 × 2) = 3√2.', '5√2 + 3√2 = 8√2.'],
    fast: 'Pull out the largest perfect square from each root, then add like terms.',
    alt: '2√17 = √68 is the trap: roots do not add under one sign. √50 + √18 ≈ 7.07 + 4.24 = 11.3, and 8√2 ≈ 11.3.',
  }),
  expo('exp-negative', 1, {
    stem: [{ t: '(3', s: '4' }, { t: ' · 3', s: '−2' }, { t: ') ÷ 3', s: '3' }, { t: ' = ?' }],
    choices: ['1/9', '1/3', '1', '3', '9'],
    ans: B,
    steps: ['Multiply: add exponents, 4 + (−2) = 2.', 'Divide: subtract, 2 − 3 = −1.', '3⁻¹ = 1/3.'],
    fast: 'Net exponent 4 − 2 − 3 = −1.',
    alt: '3⁴ · 3⁻² = 81 ÷ 9 = 9, and 9 ÷ 27 = 1/3.',
  }),

  algebra('alg-linear', 0, {
    stem: text('If 3x − 7 = 2x + 5, what is x?'),
    choices: ['−2', '2', '7', '12', '17'],
    ans: D,
    steps: ['Subtract 2x from both sides: x − 7 = 5.', 'Add 7: x = 12.'],
    fast: 'Collect x on one side, numbers on the other, in one move.',
    alt: 'Check: 3(12) − 7 = 29 and 2(12) + 5 = 29.',
  }),
  algebra('alg-system', 1, {
    stem: text('If x + y = 10 and x − y = 4, what is xy?'),
    choices: ['14', '21', '24', '25', '30'],
    ans: B,
    steps: ['Add the equations: 2x = 14, so x = 7.', 'Then y = 3.', 'xy = 21.'],
    fast: 'Identity: 4xy = (x + y)² − (x − y)² = 100 − 16 = 84, so xy = 21.',
    alt: 'Two numbers 4 apart that sum to 10 sit 2 either side of 5: 7 and 3.',
  }),
  algebra('alg-quadratic', 1, {
    stem: [{ t: 'If x', s: '2' }, { t: ' − 5x + 6 = 0, what is the sum of all possible values of x?' }],
    choices: ['−5', '−1', '1', '5', '6'],
    ans: D,
    steps: ['Factor: (x − 2)(x − 3) = 0.', 'x = 2 or x = 3.', 'Sum = 5.'],
    fast: 'For x² + bx + c = 0 the roots sum to −b. Here −(−5) = 5.',
    alt: '6 is the product of the roots, not the sum.',
  }),
  algebra('alg-rational', 1, {
    stem: text('If (x + 3) ÷ (x − 1) = 3, what is x?'),
    choices: ['0', '1', '2', '3', '6'],
    ans: D,
    steps: ['Multiply both sides by (x − 1): x + 3 = 3x − 3.', '6 = 2x, so x = 3.', 'x = 3 does not make the denominator zero, so it stands.'],
    fast: 'Back-solve from the middle: x = 3 gives 6 ÷ 2 = 3.',
    alt: 'x = 1 is never allowed: it divides by zero.',
  }),

  ineq('ineq-abs-count', 2, {
    stem: text('How many integers x satisfy |x − 3| < 5?'),
    choices: ['7', '8', '9', '10', '11'],
    ans: C,
    steps: ['|x − 3| < 5 means −5 < x − 3 < 5.', 'So −2 < x < 8.', 'Integers −1 through 7: that is 9 values.'],
    fast: 'Distance from 3 is less than 5: 4 integers on each side plus 3 itself = 9.',
    alt: 'The trap is counting the endpoints −2 and 8. The inequality is strict.',
  }),
  ineq('ineq-flip', 1, {
    stem: text('If −2x + 5 > 11, which of the following must be true?'),
    choices: ['x > −3', 'x < −3', 'x > 3', 'x < 3', 'x < −8'],
    ans: B,
    steps: ['Subtract 5: −2x > 6.', 'Divide by −2 and flip the sign: x < −3.'],
    fast: 'Dividing by a negative flips the inequality. Every time.',
    alt: 'Test x = −4: 8 + 5 = 13 > 11, true. Test x = 0: 5 > 11, false. Only "x < −3" fits both.',
  }),
  ineq('ineq-abs-product', 2, {
    stem: text('What is the product of all solutions of |2x − 1| = 7?'),
    choices: ['−12', '−3', '4', '12', '28'],
    ans: A,
    steps: ['2x − 1 = 7 gives x = 4.', '2x − 1 = −7 gives x = −3.', 'Product: 4 × (−3) = −12.'],
    fast: 'Absolute value equations split into two cases. Solve both before you combine.',
    alt: 'Check −3: |−6 − 1| = 7. Both solutions are valid.',
  }),

  stats('stat-removed', 1, {
    stem: text('The average of five numbers is 20. When one number is removed, the average of the remaining four is 18. What number was removed?'),
    choices: ['18', '20', '22', '26', '28'],
    ans: E,
    steps: ['Sum of five: 5 × 20 = 100.', 'Sum of four: 4 × 18 = 72.', 'Removed: 100 − 72 = 28.'],
    fast: 'Averages are sums in disguise. Convert, subtract, done.',
    alt: 'Removing the number lowered each of the four by 2 relative to 20, a total of 8. So it was 8 above 20.',
  }),
  stats('stat-median', 0, {
    stem: text('What is the median of 3, 9, 4, 12, 7 and 5?'),
    choices: ['5', '6', '6.5', '7', '8'],
    ans: B,
    steps: ['Sort: 3, 4, 5, 7, 9, 12.', 'Six values, so average the middle two: (5 + 7) ÷ 2 = 6.'],
    fast: 'Sort first. An even count means averaging the two middle values.',
    alt: '7 is the trap: the middle of the list as written, before sorting.',
  }),
  stats('stat-weighted', 1, {
    stem: text('Class A has 20 students with an average score of 70. Class B has 30 students averaging 80. What is the combined average?'),
    choices: ['74', '75', '76', '77', '78'],
    ans: C,
    steps: ['Total: 20 × 70 + 30 × 80 = 1,400 + 2,400 = 3,800.', 'Average: 3,800 ÷ 50 = 76.'],
    fast: 'Weighted average: the 10-point gap splits 30 : 20 toward B, so 70 + 10 × 3/5 = 76.',
    alt: '75 is the trap: it ignores that class B is larger.',
  }),

  counting('count-arrange', 0, {
    stem: text('In how many different orders can 4 different books be arranged on a shelf?'),
    choices: ['4', '12', '16', '24', '256'],
    ans: D,
    steps: ['4 choices for the first spot, 3 for the second, 2, then 1.', '4 × 3 × 2 × 1 = 24.'],
    fast: 'Arranging n distinct items: n!.',
    alt: '256 = 4⁴ would allow the same book in every spot.',
  }),
  counting('count-committee', 1, {
    stem: text('How many different 3-person committees can be chosen from 7 people?'),
    choices: ['21', '35', '42', '210', '343'],
    ans: B,
    steps: ['Order does not matter, so use combinations: 7C3.', '7C3 = (7 × 6 × 5) ÷ (3 × 2 × 1) = 210 ÷ 6 = 35.'],
    fast: 'Committee = combination. Divide the ordered count by 3!.',
    alt: '210 counts ordered picks (president, VP, secretary). Each committee appears 6 times in it.',
  }),
  counting('prob-dice-7', 1, {
    stem: text('Two fair six-sided dice are rolled. What is the probability that the sum is 7?'),
    choices: ['1/12', '1/9', '1/6', '7/36', '1/4'],
    ans: C,
    steps: ['36 equally likely outcomes.', 'Sum 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6 outcomes.', '6/36 = 1/6.'],
    fast: 'Whatever the first die shows, exactly one value of the second makes 7: probability 1/6.',
    alt: '7/36 is the trap: the sum is 7, but there are only 6 ways to make it.',
  }),
  counting('prob-draw-red', 2, {
    stem: text('A bag has 3 red and 5 blue marbles. Two are drawn without replacement. What is the probability both are red?'),
    choices: ['3/28', '9/64', '3/16', '1/4', '3/8'],
    ans: A,
    steps: ['First red: 3/8.', 'Second red, given the first was: 2/7.', '3/8 × 2/7 = 6/56 = 3/28.'],
    fast: 'Count pairs: 3C2 ÷ 8C2 = 3 ÷ 28.',
    alt: '9/64 assumes replacement. Without replacement the second draw has one fewer red and one fewer marble.',
  }),
];

// ── Data Insights: Data sufficiency ─────────────────────────────────────

const DS_QUESTIONS: Question[] = [
  ds('ds-sign', 2, {
    stem: text('Is x > 0?'),
    st: [{ t: 'x', s: '2', t2: ' = 9' }, { t: 'x', s: '3', t2: ' = 27' }],
    choices: DS_CHOICES,
    ans: B,
    steps: ['(1) x² = 9 gives x = 3 or x = −3. One yes, one no: not sufficient.', '(2) x³ = 27 gives only x = 3. Odd powers keep the sign: sufficient.', '(2) alone works and (1) alone does not, so B.'],
    fast: 'Even powers hide the sign; odd powers keep it. Spot that and you are done in 20 seconds.',
    alt: 'Test numbers. For (1), try 3 and −3: both square to 9 but give different answers. For (2), only 3 cubes to 27, because (−3)³ = −27.',
  }),
  ds('ds-same-equation', 2, {
    stem: text('What is the value of x?'),
    st: [{ t: '2x + 3y = 12' }, { t: '4x + 6y = 24' }],
    choices: DS_CHOICES,
    ans: E,
    steps: ['(1) has two unknowns: not sufficient.', '(2) is (1) multiplied by 2. It adds no new information.', 'Together they are still one equation in two unknowns: E.'],
    fast: 'Two equations only help if they are different equations. Check for a multiple before you reach for C.',
    alt: 'x = 0, y = 4 and x = 6, y = 0 both satisfy both statements, so x is not fixed.',
  }),
  ds('ds-parity', 1, {
    stem: text('Is the integer n even?'),
    st: [{ t: 'n', s: '2', t2: ' is even.' }, { t: 'n + 3 is odd.' }],
    choices: DS_CHOICES,
    ans: D,
    steps: ['(1) If n were odd, n² would be odd. So n is even: sufficient.', '(2) n + 3 odd means n = odd − 3 = even: sufficient.', 'Each alone works: D.'],
    fast: 'Squaring and adding an odd number both have fixed parity rules. Apply them to each statement separately.',
    alt: 'Try values. (1): n = 2, 4, 6 all give even squares; n = 1, 3 do not. (2): n = 2 gives 5, odd; n = 1 gives 4, even.',
  }),
  ds('ds-average', 0, {
    stem: text('What is the average of a, b and c?'),
    st: [{ t: 'a + b + c = 15' }, { t: 'a = 5' }],
    choices: DS_CHOICES,
    ans: A,
    steps: ['The average is (a + b + c) ÷ 3, so you need only the sum.', '(1) gives the sum: average 5. Sufficient.', '(2) says nothing about b and c: not sufficient. A.'],
    fast: 'Ask what you actually need. For an average, the sum is enough; individual values are not required.',
    alt: '(2) is tempting because 5 is the answer from (1), but a = 5 with b = c = 0 gives an average of 5/3.',
  }),
  ds('ds-compare-squares', 3, {
    stem: text('Is x > y?'),
    st: [{ t: 'x', s: '2', t2: ' > y²' }, { t: 'x > 0' }],
    choices: DS_CHOICES,
    ans: C,
    steps: ['(1) x = 3, y = 1 says yes; x = −3, y = 1 says no. Not sufficient.', '(2) says nothing about y. Not sufficient.', 'Together: x > 0 and x² > y² mean x > |y| ≥ y. Yes. C.'],
    fast: 'x² > y² compares sizes, not signs. Once x is positive, its size beats y’s, whatever y’s sign.',
    alt: 'Try to break the pair: you need x > 0 with x² > y² but x ≤ y. If x ≤ y and both positive, x² ≤ y². If y is negative, x > y automatically. No counterexample exists.',
  }),
  ds('ds-employees', 1, {
    stem: text('How many employees does company K have?'),
    st: [{ t: 'If K hired 10 more employees, it would have 25% more employees than it has now.' }, { t: '60% of K’s employees work full-time.' }],
    choices: DS_CHOICES,
    ans: A,
    steps: ['(1) 10 employees are 25% of the current count: N = 10 ÷ 0.25 = 40. Sufficient.', '(2) gives a share, never a count. Not sufficient. A.'],
    fast: 'A percent becomes a count only when it is tied to an actual number. (1) does that; (2) does not.',
    alt: 'For (2), K could have 10 employees (6 full-time) or 100 (60 full-time).',
  }),
  ds('ds-factor', 1, {
    stem: text('What is the value of the positive integer k?'),
    st: [{ t: 'k is a factor of 30.' }, { t: 'k is a multiple of 5 and k < 9.' }],
    choices: DS_CHOICES,
    ans: B,
    steps: ['(1) k could be 1, 2, 3, 5, 6, 10, 15 or 30. Not sufficient.', '(2) The only positive multiple of 5 below 9 is 5. Sufficient.', 'B.'],
    fast: 'Read (2) by itself before combining. Here it already pins k down.',
    alt: 'List the candidates for each statement: {1, 2, 3, 5, 6, 10, 15, 30} and {5}. One list has a single value, so there is no need to combine.',
  }),
  ds('ds-product-sign', 2, {
    stem: text('Is xy < 0?'),
    st: [{ t: 'x ÷ y < 0' }, { t: 'x − y > 0' }],
    choices: DS_CHOICES,
    ans: A,
    steps: ['(1) A negative quotient means x and y have opposite signs, so xy < 0. Sufficient.', '(2) x = 5, y = 2 gives no; x = 2, y = −1 gives yes. Not sufficient. A.'],
    fast: 'Quotient and product share their sign. Same rule, different operation.',
    alt: 'Signs: (+)÷(−) and (−)÷(+) are the only negative quotients, and both make a negative product.',
  }),
  ds('ds-remainder6', 2, {
    stem: text('What is the remainder when the positive integer n is divided by 6?'),
    st: [{ t: 'n is divisible by 3.' }, { t: 'n is even.' }],
    choices: DS_CHOICES,
    ans: C,
    steps: ['(1) n = 3 leaves 3; n = 6 leaves 0. Not sufficient.', '(2) n = 2 leaves 2; n = 6 leaves 0. Not sufficient.', 'Together n is divisible by 2 and 3, so by 6: remainder 0. C.'],
    fast: 'Divisible by 2 and by 3 means divisible by 6. Recognise the LCM and stop.',
    alt: 'List remainders mod 6 for each statement: {0, 3} and {0, 2, 4}. The only overlap is 0.',
  }),
  ds('ds-rectangle', 3, {
    stem: text('What is the area of the rectangle?'),
    st: [{ t: 'The perimeter of the rectangle is 20.' }, { t: 'The diagonal of the rectangle is √52.' }],
    choices: DS_CHOICES,
    ans: C,
    steps: ['(1) l + w = 10, but 1 × 9 and 5 × 5 give different areas. Not sufficient.', '(2) l² + w² = 52 alone allows many shapes. Not sufficient.', 'Together: (l + w)² = l² + w² + 2lw, so 100 = 52 + 2lw and lw = 24. C.'],
    fast: 'You need lw, not l and w. The square of the sum gives it from the sum and the sum of squares.',
    alt: 'Solve outright: l + w = 10 and l² + w² = 52 give 4 and 6. Area 24.',
  }),
  ds('ds-prime', 2, {
    stem: text('Is the integer p a prime number?'),
    st: [{ t: 'p is odd.' }, { t: '20 < p < 24' }],
    choices: DS_CHOICES,
    ans: E,
    steps: ['(1) 3 is prime, 9 is not. Not sufficient.', '(2) p is 21, 22 or 23. Not sufficient.', 'Together p is 21 (not prime) or 23 (prime). Still not sufficient: E.'],
    fast: 'When the statements leave a short list, write it out and test each value.',
    alt: '21 = 3 × 7 is the number that breaks it. Odd does not mean prime.',
  }),
];

// ── Data Insights: Tables ───────────────────────────────────────────────

const SALES = { head: ['Region', 'Q1 sales', 'Q2 sales'], rows: [['North', '120', '150'], ['South', '80', '92'], ['East', '200', '210'], ['West', '50', '70']] };
const VISITORS = { head: ['Site', 'Jan', 'Feb', 'Mar'], rows: [['A', '40', '50', '60'], ['B', '80', '76', '72'], ['C', '25', '35', '30'], ['D', '60', '66', '72']] };
const PRODUCTS = { head: ['Product', 'Units sold', 'Price ($)'], rows: [['X', '120', '15'], ['Y', '80', '25'], ['Z', '200', '8'], ['W', '50', '40']] };
const CLASSES = { head: ['Class', 'Students', 'Mean score'], rows: [['P', '20', '72'], ['Q', '30', '80'], ['R', '50', '68']] };
const BUDGET = { head: ['Department', '2023 ($k)', '2024 ($k)'], rows: [['Ops', '400', '440'], ['Sales', '250', '300'], ['R&D', '150', '135'], ['HR', '100', '125']] };

const TABLE_QUESTIONS: Question[] = [
  tableQ('tbl-sales-pct', 1, {
    table: SALES,
    stem: text('Which region had the greatest percent increase in sales from Q1 to Q2?'),
    choices: ['North', 'South', 'East', 'West', 'North and West are tied'],
    ans: D,
    steps: ['Percent increase = change ÷ Q1 value.', 'North 30/120 = 25%, South 12/80 = 15%, East 10/200 = 5%, West 20/50 = 40%.', 'West is greatest.'],
    fast: 'Compare change to base by eye: West gains 20 on 50, more than a third. Nothing else reaches a quarter.',
    alt: 'The biggest raw gain (North, +30) is the trap. Percent change cares about the starting size, and West started smallest.',
  }),
  tableQ('tbl-visitors-total', 0, {
    table: VISITORS,
    stem: text('Monthly visitors, in thousands. Which site had the most visitors in total over the three months?'),
    choices: ['A', 'B', 'C', 'D', 'B and D are tied'],
    ans: B,
    steps: ['A: 40 + 50 + 60 = 150. B: 80 + 76 + 72 = 228.', 'C: 25 + 35 + 30 = 90. D: 60 + 66 + 72 = 198.', 'B has the most.'],
    fast: 'B is falling but starts so high that every month beats or ties the rest. No need to add precisely.',
    alt: 'Use averages: B averages 76, D 66, A 50, C 30.',
  }),
  tableQ('tbl-visitors-growth', 1, {
    table: VISITORS,
    stem: text('Monthly visitors, in thousands. For which site was March’s figure the greatest percent above January’s?'),
    choices: ['A', 'B', 'C', 'D', 'C and D are tied'],
    ans: A,
    steps: ['A: 60 vs 40 = +50%. B: 72 vs 80 = −10%.', 'C: 30 vs 25 = +20%. D: 72 vs 60 = +20%.', 'A is greatest.'],
    fast: 'A grows by half its January figure; nothing else comes close.',
    alt: '"C and D are tied" is true but answers a different question: they tie for second.',
  }),
  tableQ('tbl-revenue-max', 1, {
    table: PRODUCTS,
    stem: text('Revenue is units sold × price. Which product generated the most revenue?'),
    choices: ['X', 'Y', 'Z', 'W', 'Y and W are tied'],
    ans: E,
    steps: ['X: 120 × 15 = 1,800. Y: 80 × 25 = 2,000.', 'Z: 200 × 8 = 1,600. W: 50 × 40 = 2,000.', 'Y and W tie at $2,000.'],
    fast: 'Multiply every row before choosing. A tie choice is often there because the tie is real.',
    alt: 'Most units (Z) and highest price (W) are both traps unless you multiply.',
  }),
  tableQ('tbl-revenue-share', 2, {
    table: PRODUCTS,
    stem: text('Revenue is units sold × price. Approximately what percent of total revenue came from product Z?'),
    choices: ['16%', '19%', '22%', '25%', '28%'],
    ans: C,
    steps: ['Revenues: 1,800 + 2,000 + 1,600 + 2,000 = 7,400.', 'Z: 1,600 ÷ 7,400 ≈ 0.216.', 'About 22%.'],
    fast: '1,600 is a little over a fifth of 7,400 (a fifth is 1,480). Only 22% fits.',
    alt: 'Equal shares would be 25% each. Z is the smallest revenue, so its share is below 25% but not by much.',
  }),
  tableQ('tbl-class-mean', 2, {
    table: CLASSES,
    stem: text('What is the mean score of all 100 students?'),
    choices: ['70.0', '72.4', '73.3', '74.0', '75.2'],
    ans: B,
    steps: ['Totals: 20 × 72 = 1,440; 30 × 80 = 2,400; 50 × 68 = 3,400.', 'Sum 7,240 over 100 students.', 'Mean 72.4.'],
    fast: 'With 100 students, the weights are just the percentages: 0.2 × 72 + 0.3 × 80 + 0.5 × 68.',
    alt: '73.3 is the trap: the plain average of the three class means, ignoring class sizes.',
  }),
  tableQ('tbl-class-shift', 2, {
    table: CLASSES,
    stem: text('If every student in class R scored 6 points higher, by how much would the mean of all 100 students rise?'),
    choices: ['1.5', '2', '3', '4', '6'],
    ans: C,
    steps: ['Class R adds 50 × 6 = 300 points.', 'Spread over 100 students: 300 ÷ 100 = 3.'],
    fast: 'Half the students rise by 6, so the overall mean rises by half of 6.',
    alt: '6 is the trap: it applies only to class R’s mean.',
  }),
  tableQ('tbl-budget-pct', 1, {
    table: BUDGET,
    stem: text('Which department’s budget changed by the largest percent from 2023 to 2024?'),
    choices: ['Ops', 'Sales', 'R&D', 'HR', 'Sales and HR are tied'],
    ans: D,
    steps: ['Ops +40 on 400 = 10%. Sales +50 on 250 = 20%.', 'R&D −15 on 150 = −10%. HR +25 on 100 = 25%.', 'HR changed the most.'],
    fast: 'Sales gained the most dollars, but HR’s base is smallest. Percent change rewards small bases.',
    alt: 'Even reading "largest change" as size regardless of direction, HR’s 25% beats R&D’s 10% drop.',
  }),
  tableQ('tbl-budget-total', 1, {
    table: BUDGET,
    stem: text('By what percent did the total budget change from 2023 to 2024?'),
    choices: ['+5.0%', '+8.3%', '+11.1%', '+12.5%', '+15.0%'],
    ans: C,
    steps: ['2023 total: 400 + 250 + 150 + 100 = 900.', '2024 total: 440 + 300 + 135 + 125 = 1,000.', 'Change: 100 ÷ 900 ≈ 11.1%.'],
    fast: 'Total the columns first; 900 to 1,000 is a ninth.',
    alt: 'Dividing by the new total (100 ÷ 1,000 = 10%) is the usual slip. Percent change always divides by the starting value.',
  }),
];

// ── Verbal: Critical reasoning ──────────────────────────────────────────

const CR_QUESTIONS: Question[] = [
  cr('Weaken')('cr-streetlights', 3, {
    passage: "Last year, Riverton's council installed brighter streetlights along Main Street. Since then, reported nighttime thefts on Main Street have fallen by 30 percent. The council concludes that brighter lighting deters theft and plans to install it citywide.",
    stem: text("Which of the following, if true, most seriously weakens the council's conclusion?"),
    choices: [
      'Residents of several other streets have asked for brighter lights.',
      'The new lights use less electricity than the ones they replaced.',
      'Last year a police substation opened on Main Street and began nightly foot patrols.',
      'Daytime thefts on Main Street did not change over the same period.',
      'Brighter lighting has reduced theft in some other cities.',
    ],
    ans: C,
    steps: ['Conclusion: the lights caused the drop in theft.', 'To weaken a causal claim, find another cause that fits the same time and place.', '(C) gives one: nightly patrols started on Main Street in the same year.'],
    fast: 'Causal conclusion? Hunt for an alternative cause first. It is the most common right answer on Weaken.',
    alt: 'Imagine the council is wrong. What else could explain 30% fewer thefts on that street that year? Nightly patrols are the obvious rival explanation.',
  }),
  cr('Weaken')('cr-four-day-week', 2, {
    passage: 'Six months ago, Halden Corp. moved its Denver office to a four-day work week. Since then, output per employee in that office has risen 12 percent. Management concludes that the four-day week raised productivity and plans to adopt it in every office.',
    stem: text("Which of the following, if true, most seriously weakens management's conclusion?"),
    choices: [
      'Most Denver employees say they prefer the four-day week.',
      'Three months ago, the Denver office installed software that automated much of its routine reporting work.',
      'Several competitors have also experimented with shorter work weeks.',
      'Halden measures productivity as output per employee in every office.',
      'The Denver office is the smallest of Halden’s offices.',
    ],
    ans: B,
    steps: ['Conclusion: the four-day week caused the 12% gain.', 'An alternative cause in the same office and period weakens it.', '(B) new automation could explain the gain on its own.'],
    fast: 'Same pattern as most Weaken questions: something else changed at the same time.',
    alt: '(E) sounds relevant, but office size does not explain a change over time. Look for something that changed.',
  }),
  cr('Weaken')('cr-dogs-bp', 2, {
    passage: 'A survey of 5,000 adults found that dog owners have lower average blood pressure than people who do not own dogs. The researchers conclude that owning a dog lowers blood pressure.',
    stem: text("Which of the following, if true, most seriously weakens the researchers' conclusion?"),
    choices: [
      'Dog owners in the survey walked, on average, more than non-owners.',
      'The survey included people from many different regions.',
      'People with high blood pressure are often advised by their doctors to avoid the demands of caring for a dog.',
      'Cat owners in the survey had blood pressure similar to non-owners.',
      'Blood pressure was measured by trained nurses.',
    ],
    ans: C,
    steps: ['The study shows a correlation and concludes causation.', 'One way to weaken: the causation runs the other way.', '(C) says high blood pressure leads people not to own dogs, which explains the gap without dogs lowering anything.'],
    fast: 'Correlation → causation? Check for reverse causation as well as a third cause.',
    alt: '(A) is tempting but it suggests a route by which dogs DO help (more walking), so it does not weaken.',
  }),
  cr('Strengthen')('cr-breakfast', 2, {
    passage: 'Students at Linwood High who eat breakfast score higher on tests, on average, than students who skip it. The principal concludes that eating breakfast improves test performance and plans to offer free breakfast to all students.',
    stem: text("Which of the following, if true, most strengthens the principal's conclusion?"),
    choices: [
      'Many students say they skip breakfast because they are short on time.',
      'Students who eat breakfast also tend to get more sleep.',
      'Among students from similar households, those who started eating breakfast saw their scores rise afterward.',
      'Free breakfast programs at other schools have been popular.',
      'Test scores at Linwood rose slightly last year.',
    ],
    ans: C,
    steps: ['The conclusion is causal: breakfast improves scores.', 'Strengthen by ruling out other explanations or showing the effect follows the cause.', '(C) compares similar students and shows scores rising after breakfast starts.'],
    fast: 'For causal Strengthen, look for a before-and-after or a controlled comparison.',
    alt: '(B) actually weakens: sleep is an alternative cause.',
  }),
  cr('Strengthen')('cr-bike-lanes', 3, {
    passage: 'Last year Brenton added protected bike lanes to its main roads. Over the year, the number of cyclists injured in traffic fell 40 percent. The council concludes that the lanes made cycling in Brenton safer.',
    stem: text("Which of the following, if true, most strengthens the council's conclusion?"),
    choices: [
      'The number of people cycling in Brenton rose substantially over the same year.',
      'Some residents complained that the lanes slowed car traffic.',
      'Neighbouring towns plan to build similar lanes.',
      'Most injuries before the lanes occurred on side streets.',
      'The lanes were more expensive than the council expected.',
    ],
    ans: A,
    steps: ['A 40% drop in injuries could just mean fewer people cycled.', '(A) rules that out: more people cycled, yet injuries fell.', 'So the risk per cyclist dropped, which supports "safer".'],
    fast: 'When a count falls, ask whether exposure fell too. Ruling that out strengthens.',
    alt: '(D) weakens: if most injuries happened on side streets, the main-road lanes could not explain much of the drop.',
  }),
  cr('Assumption')('cr-laptops', 1, {
    passage: 'Professor Ames has banned laptops in her lectures. She argues that students who take notes by hand produce better notes, and so they will learn more of the course material.',
    stem: text("Professor Ames's argument assumes which of the following?"),
    choices: [
      'Most students prefer typing to writing by hand.',
      'The quality of students’ notes affects how much of the material they learn.',
      'Laptops are a distraction to students sitting nearby.',
      'Some students cannot afford laptops.',
      'Other professors have banned laptops.',
    ],
    ans: B,
    steps: ['Premise: handwritten notes are better. Conclusion: students learn more.', 'The gap: better notes must lead to more learning.', '(B) bridges it.'],
    fast: 'Find the new idea in the conclusion ("learn more") and link it to the premise ("better notes").',
    alt: 'Negate (B): note quality has no effect on learning. Then the argument collapses. That is the test of a necessary assumption.',
  }),
  cr('Assumption')('cr-organic-flour', 2, {
    passage: 'Since switching to organic flour, Rosa’s Bakery has seen its ingredient costs rise 8 percent. Rosa argues that the switch will still raise profits, because customers will pay more for organic bread.',
    stem: text("Rosa's argument depends on which of the following assumptions?"),
    choices: [
      'Organic flour produces bread that stays fresh longer.',
      'Other bakeries in the area do not use organic flour.',
      'Enough customers will accept the higher prices without buying much less bread.',
      'Ingredient costs are the bakery’s largest expense.',
      'Organic farming is better for the environment.',
    ],
    ans: C,
    steps: ['Higher costs + higher prices → higher profit only if sales hold up.', '(C) says volume will not fall enough to cancel the price gain.', 'Negate it, and profits could fall.'],
    fast: 'Price-up arguments almost always assume demand does not collapse.',
    alt: '(B) would help Rosa, but she does not need it: the argument works even if competitors also go organic.',
  }),
  cr('Inference')('cr-analysts', 2, {
    passage: 'Every senior analyst at Corvant has an MBA. Some Corvant analysts who have an MBA work in the London office. No one in the London office works on the energy team.',
    stem: text('If the statements above are true, which of the following must also be true?'),
    choices: [
      'Some senior analysts work in the London office.',
      'No senior analyst works on the energy team.',
      'Some Corvant analysts with an MBA do not work on the energy team.',
      'Every analyst in the London office has an MBA.',
      'Some members of the energy team do not have an MBA.',
    ],
    ans: C,
    steps: ['Some MBA analysts are in London.', 'Nobody in London is on the energy team.', 'So those London MBA analysts are MBA analysts not on the energy team: (C).'],
    fast: 'Chain the "some" statement with the "no" statement; that is the only link that guarantees anything.',
    alt: '(A) is the trap: the MBA analysts in London need not be senior. "All seniors have MBAs" does not mean all MBAs are senior.',
  }),
  cr('Inference')('cr-ebikes', 3, {
    passage: 'Last year in Norland, sales of electric bicycles tripled, while sales of conventional bicycles stayed the same. Total bicycle sales rose by 20 percent.',
    stem: text('Which of the following can be properly inferred from the statements above?'),
    choices: [
      'Electric bicycles now outsell conventional bicycles in Norland.',
      'Before last year, electric bicycles accounted for about one-tenth of Norland’s bicycle sales.',
      'The price of electric bicycles in Norland fell last year.',
      'Most first-time cyclists in Norland bought electric bicycles.',
      'Sales of conventional bicycles in Norland will decline next year.',
    ],
    ans: B,
    steps: ['Let electric sales be e and total be T. Tripling adds 2e, and that is the whole 20% rise.', '2e = 0.2T, so e = 0.1T.', 'Electric bikes were one-tenth of sales before: (B).'],
    fast: 'All of the growth came from one segment, so its growth equals the total growth. Set them equal.',
    alt: '(A) fails: electric is now 0.3T against 0.9T conventional.',
  }),
  cr('Evaluate')('cr-congestion-charge', 2, {
    passage: 'Port Avery plans to charge drivers $10 to enter downtown at peak hours. Planners cite Westmoor, where a similar charge cut downtown traffic by 20 percent, and predict the same result in Port Avery.',
    stem: text('Which of the following would be most useful to know in evaluating the planners’ prediction?'),
    choices: [
      'Whether Westmoor’s charge was introduced in summer or winter.',
      'Whether Port Avery has public transit alternatives comparable to Westmoor’s.',
      'How many downtown businesses Port Avery has.',
      'Whether Westmoor residents supported the charge.',
      'How the $10 charge compares with downtown parking fees.',
    ],
    ans: B,
    steps: ['The argument assumes Port Avery is like Westmoor in the ways that matter.', 'Drivers cut back only if they have another way to get downtown.', 'If Port Avery lacks comparable transit, the 20% result may not carry over: (B).'],
    fast: 'Analogy argument? Evaluate by asking whether the two cases differ on the factor that drove the result.',
    alt: 'Answer (B) both ways: good transit makes the prediction more likely, poor transit less. A useful Evaluate answer moves the argument in either direction.',
  }),
  cr('Evaluate')('cr-supplement', 1, {
    passage: 'In a trial of VitaGuard, people taking the supplement reported 30 percent fewer colds over the winter than they had the previous winter. The manufacturer concludes that VitaGuard prevents colds.',
    stem: text('Which of the following would be most useful to know in evaluating the manufacturer’s conclusion?'),
    choices: [
      'Whether VitaGuard is more expensive than other supplements.',
      'Whether people not taking VitaGuard also reported fewer colds that winter than the winter before.',
      'How many people took part in the trial.',
      'Whether VitaGuard contains vitamin C.',
      'Whether participants enjoyed taking the supplement.',
    ],
    ans: B,
    steps: ['The trial has no comparison group.', 'If colds fell for everyone that winter, the supplement explains nothing.', '(B) supplies the missing control.'],
    fast: 'No control group? The best Evaluate answer usually asks what happened to people without the treatment.',
    alt: '(C) matters a little, but even a large trial is useless without a comparison.',
  }),
  cr('Paradox')('cr-coffee', 1, {
    passage: 'Coffee bean prices rose sharply across the country last quarter. Yet Café Lumen, which did not raise its menu prices, earned more profit per cup than in the quarter before.',
    stem: text('Which of the following, if true, most helps explain the situation above?'),
    choices: [
      'Coffee drinkers rarely change cafés over small price differences.',
      'Café Lumen buys its beans under a two-year fixed-price contract signed before the rise.',
      'Several cafés near Café Lumen closed last quarter.',
      'Café Lumen sells pastries as well as coffee.',
      'Bean prices are expected to fall next year.',
    ],
    ans: B,
    steps: ['The puzzle: costs rose nationally, prices stayed the same, yet profit per cup rose.', '(B) shows Café Lumen’s own costs did not rise.', 'That removes the conflict.'],
    fast: 'Paradox answers explain why the general trend did not apply to this case.',
    alt: '(C) could raise total profit through more customers, but not profit per cup.',
  }),
  cr('Paradox')('cr-hospital', 2, {
    passage: 'Hospital X has a higher death rate among its surgery patients than Hospital Y. Yet independent experts rate Hospital X’s surgeons as more skilled than Hospital Y’s.',
    stem: text('Which of the following, if true, most helps resolve the apparent discrepancy?'),
    choices: [
      'Hospital X is older than Hospital Y.',
      'Hospital X receives most of the region’s highest-risk surgical cases.',
      'Hospital Y has more surgeons than Hospital X.',
      'The experts visited both hospitals.',
      'Hospital Y’s patients report higher satisfaction.',
    ],
    ans: B,
    steps: ['Skilled surgeons should mean fewer deaths, unless the patients differ.', '(B) says X treats much riskier cases.', 'Higher-risk patients explain a higher death rate despite better surgeons.'],
    fast: 'Rates comparison paradox? Look for a difference in who is being counted.',
    alt: 'This is the classic reason raw outcome rates mislead: case mix.',
  }),
];

export const QUESTION_LIST: Question[] = [...QUANT, ...DS_QUESTIONS, ...TABLE_QUESTIONS, ...CR_QUESTIONS];
export const QUESTIONS: Record<string, Question> = Object.fromEntries(QUESTION_LIST.map(x => [x.id, x]));

export const questionsFor = (pred: (q: Question) => boolean) => QUESTION_LIST.filter(pred).map(x => x.id);
