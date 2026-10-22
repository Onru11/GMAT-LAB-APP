// Quant problem-solving bank: algebra, inequalities, rates & work, exponents,
// statistics, counting & probability. Every key is re-derived independently in
// quant-algebra.test.ts, so a wrong `ans` fails the build.

import type { Question, StemPart } from '../questions';

const PS = 'Problem solving';
const [A, B, C, D, E] = [0, 1, 2, 3, 4];

const quant = (topic: string) =>
  (id: string, level: number, rest: Omit<Question, 'id' | 'section' | 'topic' | 'kind' | 'level'>): Question =>
    ({ id, section: 'Quant', topic, kind: PS, level, ...rest });
const text = (t: string): StemPart[] => [{ t }];

const algebra = quant('Algebra');
const ineq = quant('Inequalities & absolute value');
const rates = quant('Rates & work');
const expo = quant('Exponents & roots');
const stats = quant('Statistics');
const counting = quant('Counting & probability');

export const QUANT_ALGEBRA: Question[] = [
  // ── Algebra ──────────────────────────────────────────────────────────────
  algebra('alg-notebooks-pens', 0, {
    stem: text('Five identical notebooks and two pens cost $13.00 in total. If each pen costs $1.50, what is the price of one notebook?'),
    choices: ['$2.00', '$2.20', '$2.30', '$2.60', '$3.20'],
    ans: A,
    steps: ['Write the total: 5n + 2(1.50) = 13, so 5n + 3 = 13, 5n = 10 and n = 2.00.'],
    fast: 'Take the pens out first: $13 − $3 = $10 for five notebooks, so $2 each.',
    alt: '$2.60 ignores the pens (13 ÷ 5), $2.30 removes only one pen, $2.20 subtracts the number of pens (2) instead of their cost, and $3.20 adds the pens instead of removing them.',
  }),
  algebra('alg-consecutive-even', 1, {
    stem: text('The sum of three consecutive even integers is 102. What is the largest of the three?'),
    choices: ['32', '34', '35', '36', '38'],
    ans: D,
    steps: ['Call the middle one m; the three are m − 2, m and m + 2, so 3m = 102 and m = 34.', 'The largest is m + 2 = 36.'],
    fast: 'Evenly spaced numbers: the middle is the average, 102 ÷ 3 = 34. Add 2.',
    alt: '34 is the middle and 32 the smallest. 35 comes from using consecutive integers (33, 34, 35) instead of even ones, and 38 adds 4 to the middle.',
  }),
  algebra('alg-age-later', 2, {
    stem: text('A mother is now four times as old as her son. In 20 years, she will be twice as old as he will be then. How old is the mother now?'),
    choices: ['10', '30', '40', '60', '80'],
    ans: C,
    steps: ['Let the son be s now, so the mother is 4s.', 'In 20 years: 4s + 20 = 2(s + 20) = 2s + 40.', '2s = 20, so s = 10 and the mother is 40.'],
    fast: 'Back-solve: mother 40, son 10. In 20 years: 60 and 30. Twice as old, done.',
    alt: '10 is the son, and 60 and 30 are their ages in 20 years. 80 comes from adding 20 to the son only: 4s = 2(s + 20) gives s = 20. Both people age.',
  }),
  algebra('alg-reciprocal-square', 2, {
    stem: [{ t: 'Given that x + 1/x = 5, what is the value of x', s: '2' }, { t: ' + 1/x', s: '2' }, { t: '?' }],
    choices: ['10', '23', '24', '25', '27'],
    ans: B,
    steps: ['Square both sides: (x + 1/x)² = x² + 2 · x · (1/x) + 1/x² = 25.', 'The middle term is 2 · 1 = 2, so x² + 1/x² = 25 − 2 = 23.'],
    fast: 'Memorize it: x² + 1/x² = (x + 1/x)² − 2.',
    alt: '25 forgets the cross term, 24 counts it as 1 instead of 2, 27 adds it on the wrong side, and 10 doubles 5 instead of squaring. Solving for x (x = (5 ± √21)/2) works but wastes two minutes.',
  }),
  algebra('alg-split-bill', 3, {
    stem: text('A group of friends agreed to split a $360 dinner bill equally. Three of them left without paying, so each of the others paid $20 more than planned. How many friends were in the group originally?'),
    choices: ['6', '9', '18', '27', '54'],
    ans: B,
    steps: ['With n friends the planned share is 360/n; the actual share is 360/(n − 3).', '360/(n − 3) − 360/n = 20. Multiply by n(n − 3): 360 · 3 = 20n(n − 3), so n(n − 3) = 54.', 'n² − 3n − 54 = 0 factors as (n − 9)(n + 6) = 0, so n = 9.'],
    fast: 'Back-solve: 9 friends pay $40 each as planned; 6 pay $60. That is $20 more.',
    alt: 'The trap is stopping early: 6 is the number who paid, 54 is n(n − 3) before factoring, and 27 halves it. 18 is just 360 ÷ 20, which has no meaning here.',
  }),
  algebra('alg-composition', 3, {
    stem: [{ t: 'Let f(x) = 2x', s: '2' }, { t: ' − 3 and g(x) = x + 1. What is f(g(−2)) − g(f(−2))?' }],
    choices: ['−13', '−7', '−1', '5', '7'],
    ans: B,
    steps: ['Inside out: g(−2) = −1, then f(−1) = 2(1) − 3 = −1.', 'f(−2) = 2(4) − 3 = 5, then g(5) = 6.', 'Difference: −1 − 6 = −7.'],
    fast: 'Always start with the innermost function, and square the negative before you double it.',
    alt: '7 reverses the order of subtraction, −1 stops after the first term, −13 squares 2x instead of x, and 5 treats (−1)² as −1.',
  }),
  algebra('alg-integer-solutions', 4, {
    stem: text('How many ordered pairs of positive integers (x, y) satisfy 3x + 5y = 100?'),
    choices: ['5', '6', '7', '20', '33'],
    ans: B,
    steps: ['3x = 100 − 5y must be a positive multiple of 3.', '100 − 5y is divisible by 3 when y = 2, 5, 8, 11, 14, 17 (y goes up in steps of 3).', 'y = 20 would make x = 0, which is not positive. That leaves 6 pairs.'],
    fast: 'Find one solution (x, y) = (30, 2), then step: x falls by 5 and y rises by 3 each time. x = 30, 25, 20, 15, 10, 5: six values.',
    alt: '7 includes (0, 20), but 0 is not positive. 20 and 33 are only the largest possible y and x.',
  }),
  algebra('alg-diff-squares', 4, {
    stem: [{ t: 'Positive integers a and b satisfy a', s: '2' }, { t: ' − b', s: '2' }, { t: ' = 45. What is the sum of all possible values of a?' }],
    choices: ['16', '23', '32', '39', '45'],
    ans: D,
    steps: ['Factor: (a − b)(a + b) = 45, with a − b < a + b and both positive.', 'Factor pairs of 45: 1 × 45, 3 × 15, 5 × 9.', 'a is the average of each pair: 23, 9 and 7. Sum: 39.'],
    fast: 'Difference of squares turns one equation into a factor-pair hunt. All pairs of 45 are odd × odd, so every pair works.',
    alt: '23 uses only the largest pair. 32 misses 5 × 9 and 16 misses 1 × 45. Check one: 7² − 2² = 49 − 4 = 45.',
  }),

  // ── Inequalities & absolute value ────────────────────────────────────────
  ineq('ineq-linear-basic', 0, {
    stem: text('For which values of x is 4x − 9 < 3?'),
    choices: ['x < −1.5', 'x < 0.75', 'x < 3', 'x > 3', 'x < 12'],
    ans: C,
    steps: ['Add 9 to both sides: 4x < 12, then divide by 4 (positive, no flip): x < 3.'],
    fast: 'Plug in x = 0: −9 < 3 is true, so 0 must be in the set. That kills x > 3 and x < −1.5.',
    alt: 'x < −1.5 subtracts 9 instead of adding it, x < 0.75 drops the 9, x < 12 forgets to divide, and x > 3 flips the sign when dividing by a positive number.',
  }),
  ineq('ineq-least-integer', 1, {
    stem: text('Find the least integer x for which 7 − 3x < −11.'),
    choices: ['−5', '2', '5', '6', '7'],
    ans: E,
    steps: ['Subtract 7: −3x < −18.', 'Divide by −3 and flip the sign: x > 6. The least integer greater than 6 is 7.'],
    fast: 'Test the edge: x = 6 gives 7 − 18 = −11, not less than −11. x = 7 gives −14. Works.',
    alt: '6 forgets the inequality is strict, 5 forgets to flip (x < 6), −5 gets the sign of 18 ÷ 3 wrong, and 2 adds 7 to −11 instead of subtracting.',
  }),
  ineq('ineq-abs-between', 2, {
    stem: text('Count the integers n that satisfy 2 < |n − 1| ≤ 6.'),
    choices: ['4', '6', '8', '10', '13'],
    ans: C,
    steps: ['|n − 1| can be 3, 4, 5 or 6.', 'Each value gives two integers: n − 1 = ±3, ±4, ±5, ±6.', 'That is 4 × 2 = 8 integers: −5, −4, −3, −2, 4, 5, 6, 7.'],
    fast: 'Count allowed distances (3, 4, 5, 6), then double for the two sides of 1.',
    alt: '13 ignores the lower bound, 4 forgets the negative side, 6 treats ≤ 6 as < 6, and 10 includes distance 2.',
  }),
  ineq('ineq-quadratic-set', 2, {
    stem: [{ t: 'The inequality x', s: '2' }, { t: ' − 2x − 15 < 0 is true exactly when' }],
    choices: ['−3 < x < 5', '−5 < x < 3', 'x < −3 or x > 5', '0 < x < 5', 'x < 5'],
    ans: A,
    steps: ['Factor: (x − 5)(x + 3) < 0.', 'A product is negative when the factors have opposite signs, which happens between the roots −3 and 5.'],
    fast: 'The parabola opens upward, so it is below zero between its roots.',
    alt: '−5 < x < 3 flips the signs of the roots, "x < −3 or x > 5" is where the product is positive, x < 5 ignores the factor (x + 3), and 0 < x < 5 assumes x is positive. Test x = −1: 1 + 2 − 15 < 0.',
  }),
  ineq('ineq-abs-sum-count', 3, {
    stem: text('For how many integers x is |x − 2| + |x + 4| = 6?'),
    choices: ['1', '2', '5', '6', '7'],
    ans: E,
    steps: ['|x − 2| + |x + 4| is the distance from x to 2 plus the distance from x to −4.', 'The points −4 and 2 are 6 apart, so the sum is exactly 6 for every x from −4 to 2, and larger outside.', 'Integers −4 through 2: 7 of them.'],
    fast: 'Sum of distances to two points equals the gap between them exactly on the segment. Count the integers on it, endpoints included.',
    alt: '2 finds only the endpoints by setting each bracket to zero. 5 drops the endpoints, 6 is the length of the segment, and 1 picks just the midpoint −1.',
  }),
  ineq('ineq-range-square', 3, {
    stem: [{ t: 'Given −5 < x < 2, which of the following describes every possible value of x', s: '2' }, { t: '?' }],
    choices: ['0 ≤ x² < 25', '0 < x² < 25', '4 < x² < 25', '0 ≤ x² < 4', '−25 < x² < 4'],
    ans: A,
    steps: ['x can be 0, so x² can be 0: the lower bound is 0, and it is included.', 'The largest |x| comes near −5, so x² approaches 25 but never reaches it.'],
    fast: 'When the range crosses zero, the square starts at 0. Then square the endpoint farther from zero.',
    alt: '4 < x² < 25 squares the endpoints in order, as if x² grew with x. 0 < x² < 25 forgets that x = 0 is allowed, and −25 < x² < 4 forgets that squares are never negative.',
  }),
  ineq('ineq-abs-cases', 4, {
    stem: text('What is the sum of all real solutions of |x − 3| + |x + 1| = x + 6?'),
    choices: ['−4/3', '6', '14/3', '20/3', '8'],
    ans: D,
    steps: ['x ≥ 3: (x − 3) + (x + 1) = x + 6, so 2x − 2 = x + 6 and x = 8. Valid.', '−1 ≤ x < 3: (3 − x) + (x + 1) = 4 = x + 6 gives x = −2, outside the range. Reject.', 'x < −1: (3 − x) − (x + 1) = x + 6, so 2 − 2x = x + 6 and x = −4/3. Valid. Sum: 8 − 4/3 = 20/3.'],
    fast: 'Split at the zeros −1 and 3, solve each piece, and keep only answers that land inside their own piece.',
    alt: '14/3 keeps the rejected x = −2. 8 and −4/3 each stop after one case, and 6 adds 8 and −2. Check −4/3: 13/3 + 1/3 = 14/3 = −4/3 + 6.',
  }),

  // ── Rates & work ─────────────────────────────────────────────────────────
  rates('rate-cyclist-minutes', 0, {
    stem: text('Riding at a steady 18 miles per hour, how many minutes does a cyclist need to cover 12 miles?'),
    choices: ['36', '40', '66', '90', '216'],
    ans: B,
    steps: ['Time = distance ÷ rate = 12/18 = 2/3 hour, and 2/3 × 60 = 40 minutes.'],
    fast: '18 mph is 3 miles every 10 minutes. 12 miles is four of those.',
    alt: '90 divides the wrong way (18 ÷ 12), 216 multiplies, 66 reads 0.66 hour as 66 minutes, and 36 rounds 2/3 to 0.6 hour.',
  }),
  rates('work-machines-scale', 1, {
    stem: text('Four identical machines working together finish an order in 15 hours. At the same rate, how many hours would 6 such machines need?'),
    choices: ['9', '10', '13', '22.5', '90'],
    ans: B,
    steps: ['Total work: 4 machines × 15 hours = 60 machine-hours.', 'With 6 machines: 60 ÷ 6 = 10 hours.'],
    fast: 'More machines, less time: multiply by 4/6. 15 × 2/3 = 10.',
    alt: '22.5 scales the wrong way (15 × 6/4). 13 and 9 subtract the change in machines from the hours, and 90 is 15 × 6.',
  }),
  rates('rate-trains-meet', 2, {
    stem: text('At 1:00 p.m., two trains start toward each other from stations 330 miles apart, one at 50 mph and the other at 60 mph. At what time do they meet?'),
    choices: ['3:00 p.m.', '4:00 p.m.', '6:30 p.m.', '7:00 p.m.', '7:36 p.m.'],
    ans: B,
    steps: ['Moving toward each other, the gap closes at 50 + 60 = 110 mph.', '330 ÷ 110 = 3 hours, and 1:00 p.m. + 3 hours = 4:00 p.m.'],
    fast: 'Opposite directions: add the speeds. Then add the time to the start.',
    alt: '3:00 p.m. reads "3 hours" as a clock time. 7:00 p.m. divides by the average speed (55), and 6:30 and 7:36 have one train cover the whole distance alone.',
  }),
  rates('work-joins-later', 2, {
    stem: text('Ana can paint a fence alone in 6 hours, and Ben can paint it alone in 9 hours. Ana starts alone; after 2 hours Ben joins her. How many more hours do they need to finish?'),
    choices: ['1.6', '2.4', '3.6', '4.4', '6'],
    ans: B,
    steps: ['In 2 hours Ana paints 2/6 = 1/3 of the fence, leaving 2/3.', 'Together: 1/6 + 1/9 = 5/18 of the fence per hour.', '(2/3) ÷ (5/18) = 12/5 = 2.4 hours.'],
    fast: 'Call the fence 18 units: Ana 3 per hour, Ben 2. After 2 hours, 12 units remain at 5 per hour: 2.4.',
    alt: '3.6 is the time for both to paint the whole fence, 4.4 adds Ana’s 2 hours, 1.6 subtracts them, and 6 has Ben finish the remaining 2/3 alone.',
  }),
  rates('rate-catch-up', 3, {
    stem: text('A bus leaves a depot at 9:00 a.m. and travels at 45 mph. At 10:00 a.m. a car leaves the same depot on the same road at 60 mph. At what time does the car catch up with the bus?'),
    choices: ['10:26 a.m.', '10:45 a.m.', '12:00 p.m.', '1:00 p.m.', '2:00 p.m.'],
    ans: D,
    steps: ['At 10:00 a.m. the bus is 45 miles ahead.', 'Same direction, so the gap closes at 60 − 45 = 15 mph: 45 ÷ 15 = 3 hours.', 'Three hours after the car starts: 1:00 p.m.'],
    fast: 'Chasing: subtract the speeds. Head start ÷ closing speed, counted from when the chaser leaves.',
    alt: '12:00 p.m. counts 3 hours from the bus’s start. 2:00 p.m. measures the head start with the car’s speed (60 miles). 10:26 adds the speeds as if they were approaching, and 10:45 has the car reach a bus that stood still.',
  }),
  rates('work-inlet-drain', 3, {
    stem: text('An inlet pipe can fill a tank in 4 hours, and a drain can empty the full tank in 6 hours. The tank is one-third full when both are opened at the same time. How many hours does it take to fill the tank?'),
    choices: ['1.6', '2', '2.4', '8', '12'],
    ans: D,
    steps: ['Net rate: 1/4 − 1/6 = 1/12 of the tank per hour (the drain works against the inlet).', 'Two-thirds of the tank is left to fill: (2/3) ÷ (1/12) = 8 hours.'],
    fast: 'Tank = 12 units: in 3, out 2, net 1 per hour. 4 units already in, 8 to go.',
    alt: '12 ignores the water already in the tank. 2.4 and 1.6 add the drain instead of subtracting it, and 2 subtracts the times (6 − 4).',
  }),
  rates('work-machine-breaks', 4, {
    stem: text('Machines A, B and C can each complete a job alone in 10, 12 and 15 hours, respectively. All three start together, but A breaks down after 2 hours and B and C finish the job. How long does the job take from start to finish?'),
    choices: ['3 hours 20 minutes', '4 hours', '5 hours 20 minutes', '6 hours 40 minutes', '8 hours 40 minutes'],
    ans: C,
    steps: ['Job = 60 units. Rates: A 6, B 5, C 4 units per hour, so all three do 15 per hour.', 'In 2 hours they do 30 units, leaving 30.', 'B and C do 9 per hour: 30 ÷ 9 = 3⅓ hours = 3 hours 20 minutes. Total: 5 hours 20 minutes.'],
    fast: 'Pick a job size divisible by every time (LCM 60) so every rate is a whole number.',
    alt: '3 hours 20 minutes forgets the first 2 hours. 4 hours assumes A never broke down. 6 hours 40 minutes is B and C doing the whole job, and 8 hours 40 minutes adds the 2 hours to that.',
  }),
  rates('work-partner-leaves', 4, {
    stem: text('Working together, Priya and Sam can complete a project in 12 days. They work together for 8 days; then Sam leaves, and Priya finishes the project alone in 10 more days. How many days would Sam need to complete the whole project alone?'),
    choices: ['15', '18', '20', '30', '60'],
    ans: C,
    steps: ['In 8 days together they finish 8/12 = 2/3 of the project, leaving 1/3.', 'Priya does 1/3 in 10 days, so alone she needs 30 days.', "Sam's rate = 1/12 − 1/30 = 5/60 − 2/60 = 3/60 = 1/20. He needs 20 days."],
    fast: 'Project = 60 units: together 5 a day. After 8 days, 20 units remain, so Priya does 2 a day and Sam 3. 60 ÷ 3 = 20.',
    alt: '30 is Priya’s time, and 18 just adds 8 + 10. If you misread 2/3 as the part left, Priya does 2/3 in 10 days (15 days alone) and Sam’s rate becomes 1/12 − 1/15 = 1/60: that is where 15 and 60 come from.',
  }),

  // ── Exponents & roots ────────────────────────────────────────────────────
  expo('exp-power-tower', 0, {
    stem: [{ t: 'Evaluate (2', s: '3' }, { t: ')', s: '2' }, { t: '.' }],
    choices: ['12', '32', '36', '64', '512'],
    ans: D,
    steps: ['A power of a power multiplies the exponents: (2³)² = 2⁶ = 64.'],
    fast: '2³ = 8, and 8² = 64.',
    alt: '32 = 2⁵ adds the exponents, 512 = 2⁹ computes 2^(3²), 36 = 6² doubles the base first, and 12 = 2 × 3 × 2 multiplies everything.',
  }),
  expo('exp-root-square', 1, {
    stem: [{ t: 'Simplify (√12 + √27)', s: '2' }, { t: '.' }],
    choices: ['15', '25', '39', '75', '5√3'],
    ans: D,
    steps: ['√12 = 2√3 and √27 = 3√3, so the sum is 5√3.', '(5√3)² = 25 × 3 = 75.'],
    fast: 'Simplify the roots before squaring: like terms add, then square.',
    alt: 'Expanding works too: 12 + 2√324 + 27 = 12 + 36 + 27 = 75. 39 forgets the middle term, 5√3 forgets to square, 25 squares only the 5, and 15 multiplies 5 by 3 without squaring the 5.',
  }),
  expo('exp-common-base', 2, {
    stem: [{ t: 'If 4', s: 'x + 1' }, { t: ' = 8', s: 'x − 1' }, { t: ', what is the value of x?' }],
    choices: ['−5', '2', '3', '4', '5'],
    ans: E,
    steps: ['Rewrite on base 2: 4ˣ⁺¹ = 2²⁽ˣ⁺¹⁾ and 8ˣ⁻¹ = 2³⁽ˣ⁻¹⁾.', 'Set the exponents equal: 2x + 2 = 3x − 3.', 'x = 5.'],
    fast: 'Common base, then compare exponents. Distribute the outer exponent across both terms.',
    alt: '3 and 4 each distribute on only one side, 2 distributes on neither, and −5 swaps 2 and 3. Check: 4⁶ = 2¹² and 8⁴ = 2¹².',
  }),
  expo('exp-sum-equal-powers', 2, {
    stem: [{ t: 'Suppose 2', s: '10' }, { t: ' + 2', s: '10' }, { t: ' + 2', s: '10' }, { t: ' + 2', s: '10' }, { t: ' = 2', s: 'n' }, { t: '. What is n?' }],
    choices: ['11', '12', '14', '20', '40'],
    ans: B,
    steps: ['Four equal terms: 4 × 2¹⁰.', '4 = 2², so 2² × 2¹⁰ = 2¹².'],
    fast: 'Adding k copies of a power multiplies it by k. Here k = 4 = 2².',
    alt: '40 adds the exponents, 14 adds the number of terms to the exponent, 20 treats 2¹⁰ + 2¹⁰ as 2²⁰, and 11 is the rule for two copies, not four.',
  }),
  expo('exp-greatest-power', 3, {
    stem: text('Of the numbers below, which has the greatest value?'),
    choices: ['2⁵⁰', '3³⁰', '5²⁰', '6²⁰', '10¹⁰'],
    ans: D,
    steps: ['Every exponent is a multiple of 10, so take each number to the 1/10 power.', '2⁵ = 32, 3³ = 27, 5² = 25, 6² = 36, 10¹ = 10.', '36 is largest, so 6²⁰ is greatest.'],
    fast: 'Rewrite with a common exponent: (32)¹⁰, (27)¹⁰, (25)¹⁰, (36)¹⁰, (10)¹⁰. Compare the bases.',
    alt: 'The traps are picking the biggest exponent (2⁵⁰) or the biggest base (10¹⁰). Neither alone decides the size.',
  }),
  expo('exp-radical-equation', 3, {
    stem: text('Solve for x: √(x + 7) = x − 5.'),
    choices: ['−9', '−2', '2', '9', '11'],
    ans: D,
    steps: ['Square both sides: x + 7 = x² − 10x + 25, so x² − 11x + 18 = 0.', 'Factor: (x − 2)(x − 9) = 0, so x = 2 or x = 9.', 'Check: x = 2 gives √9 = 3 but 2 − 5 = −3. Reject. x = 9 gives √16 = 4 = 9 − 5. Keep.'],
    fast: 'Back-solve: 9 gives 4 = 4. Squaring can create false roots, so always check.',
    alt: '2 is the extraneous root that squaring introduced: a square root is never negative. −2 and −9 come from sign errors in the factoring, and 11 is the sum of the roots.',
  }),
  expo('exp-quadratic-disguise', 4, {
    stem: [{ t: 'Find the sum of all real x such that 3', s: '2x' }, { t: ' − 12 · 3', s: 'x' }, { t: ' + 27 = 0.' }],
    choices: ['1', '2', '3', '12', '27'],
    ans: C,
    steps: ['Let t = 3ˣ, so 3²ˣ = t². The equation becomes t² − 12t + 27 = 0.', 'Factor: (t − 3)(t − 9) = 0, so 3ˣ = 3 or 3ˣ = 9.', 'x = 1 or x = 2. Sum: 3.'],
    fast: 'When one exponent is double another, substitute t for the smaller power and solve a quadratic.',
    alt: '12 and 27 are the sum and product of the values of 3ˣ, not of x. 1 and 2 each give only one root.',
  }),

  // ── Statistics ───────────────────────────────────────────────────────────
  stats('stat-mean-scores', 0, {
    stem: text('Five students scored 72, 85, 90, 68 and 95 on a quiz. What is the mean score?'),
    choices: ['27', '81.5', '82', '85', '410'],
    ans: C,
    steps: ['Sum: 72 + 85 + 90 + 68 + 95 = 410, and 410 ÷ 5 = 82.'],
    fast: 'Measure from 80: −8, +5, +10, −12, +15 sums to +10. 80 + 10/5 = 82.',
    alt: 'Each wrong choice is a different statistic: 85 is the median, 27 the range, 81.5 the midpoint of the extremes, and 410 the sum.',
  }),
  stats('stat-missing-median', 1, {
    stem: text('The six numbers 4, 7, 7, 10, 15 and x have a mean of 9. What is their median?'),
    choices: ['7', '8.5', '9', '10', '11'],
    ans: B,
    steps: ['The sum must be 6 × 9 = 54. The known numbers add to 43, so x = 11.', 'Sorted: 4, 7, 7, 10, 11, 15. The median is the mean of the middle two: (7 + 10) ÷ 2 = 8.5.'],
    fast: 'Find x from the sum, sort, average the 3rd and 4th values.',
    alt: '9 is the mean and 11 is x. 7 is the median of the five known numbers, and 10 takes the 4th value instead of averaging the middle pair.',
  }),
  stats('stat-mean-transform', 2, {
    stem: text('Ten numbers have a mean of 30. Each number is increased by 20%, and then 4 is subtracted from each result. What is the mean of the new numbers?'),
    choices: ['26', '31.2', '32', '36', '46'],
    ans: C,
    steps: ['Increasing every number by 20% multiplies the mean by 1.2: 36.', 'Subtracting 4 from every number lowers the mean by 4: 32.'],
    fast: 'The mean follows any operation applied to every value, in the same order: 30 × 1.2 − 4.',
    alt: '31.2 does the steps in the wrong order, 36 stops halfway, 26 skips the increase, and 46 treats 20% as adding 20.',
  }),
  stats('stat-sd-linear', 2, {
    stem: text('Data set S has a standard deviation of 4. Every value in S is multiplied by 3, and then 5 is added to each product. What is the standard deviation of the new set?'),
    choices: ['4', '7', '12', '17', '36'],
    ans: C,
    steps: ['Multiplying every value by 3 multiplies every distance from the mean by 3: 4 × 3 = 12.', 'Adding 5 shifts every value and the mean equally, so the spread is unchanged: 12.'],
    fast: 'SD scales with multiplication and ignores addition.',
    alt: '17 adds the 5, 7 adds the 3, and 36 multiplies by 3² (that is the rule for variance). Try S = {−4, 4}: it becomes {−7, 17}, still 12 from its mean of 5.',
  }),
  stats('stat-sd-greatest', 3, {
    stem: text('Which of these five data sets has the greatest standard deviation?'),
    choices: ['{100, 101, 102, 103, 104}', '{0, 6, 6, 6, 12}', '{1, 1, 6, 11, 11}', '{3, 3, 6, 9, 9}', '{2, 6, 6, 6, 10}'],
    ans: C,
    steps: ['The last four sets all have mean 6, so compare squared distances from 6.', '{0, 6, 6, 6, 12}: 36 + 36 = 72. {1, 1, 6, 11, 11}: 4 × 25 = 100. {3, 3, 6, 9, 9}: 4 × 9 = 36. {2, 6, 6, 6, 10}: 16 + 16 = 32.', '{100, …, 104} is spread like {4, 5, 6, 7, 8}: only 10. The winner is {1, 1, 6, 11, 11}.'],
    fast: 'SD measures typical distance from the mean, not the range. Four values 5 away beat two values 6 away.',
    alt: '{0, 6, 6, 6, 12} is the range trap: it has the widest range, but three of its values sit right on the mean. {100, …, 104} is the size trap: big numbers, tiny spread.',
  }),
  stats('stat-weighted-fraction', 3, {
    stem: text('At a firm, managers earn an average of $90,000 and all other staff earn an average of $50,000. If the average salary of all employees is $60,000, what fraction of the employees are managers?'),
    choices: ['1/6', '1/4', '1/3', '1/2', '3/4'],
    ans: B,
    steps: ['Let the fraction of managers be f: 90f + 50(1 − f) = 60.', '40f = 10, so f = 1/4.'],
    fast: 'Distances to the overall average: managers are 30 away, staff 10 away. The weights are inverse, 1 : 3, so managers are 1 of 4 parts.',
    alt: '3/4 assigns the larger weight to the wrong group. 1/3 is the ratio of managers to staff, not to all employees. 1/2 assumes equal groups (that would give $70,000), and 1/6 divides 10 by 60.',
  }),
  stats('stat-must-be-true', 4, {
    stem: text('A list of five positive integers has a mean of 10 and a median of 12. Which of the following must be true? I. The smallest integer is at most 7. II. The largest integer is greater than 12. III. The two largest integers have a sum of at least 24.'),
    choices: ['I only', 'II only', 'I and III only', 'II and III only', 'I, II and III'],
    ans: C,
    steps: ['Sorted a ≤ b ≤ 12 ≤ d ≤ e with sum 50. Since d and e are both at least 12, III is true.', 'Then a + b ≤ 50 − 12 − 24 = 14, and a ≤ b, so a ≤ 7. I is true.', 'II fails: 2, 12, 12, 12, 12 has mean 10 and median 12, and its largest value is 12.'],
    fast: 'For "must be true", hunt for one counterexample per statement. Push values to the extremes: make the top values as small as allowed.',
    alt: 'The trap is II: a mean below the median feels like it needs a big outlier, but it really needs a small one at the bottom.',
  }),

  // ── Counting & probability ───────────────────────────────────────────────
  counting('count-lunch-specials', 0, {
    stem: text("A diner's lunch special includes one soup, one sandwich and one dessert. With 4 soups, 6 sandwiches and 3 desserts to choose from, how many different specials are possible?"),
    choices: ['13', '18', '24', '72', '216'],
    ans: D,
    steps: ['Independent choices multiply: 4 × 6 × 3 = 72.'],
    fast: 'One from each group means multiply; one from any group means add.',
    alt: '13 adds the options. 24 leaves out the desserts and 18 the soups. 216 = 6³ treats every course as having 6 options.',
  }),
  counting('prob-coin-at-least-one', 1, {
    stem: text('A fair coin is tossed three times. What is the probability of getting at least one head?'),
    choices: ['1/8', '3/8', '1/2', '3/4', '7/8'],
    ans: E,
    steps: ['The only outcome with no head is TTT, with probability (1/2)³ = 1/8.', 'At least one head: 1 − 1/8 = 7/8.'],
    fast: '"At least one" means 1 minus "none".',
    alt: '1/8 is the probability of no heads, 3/8 is exactly one head, and 1/2 is a single toss. 3/4 treats 0, 1, 2 and 3 heads as equally likely, but they are not.',
  }),
  counting('count-level-letters', 2, {
    stem: text('How many distinct arrangements can be made using all the letters of the word LEVEL?'),
    choices: ['10', '20', '30', '60', '120'],
    ans: C,
    steps: ['5 letters give 5! = 120 orders if all were different.', 'The two Ls and the two Es can swap without changing the word: divide by 2! × 2!.', '120 ÷ 4 = 30.'],
    fast: 'n! ÷ (repeats)!: 5! ÷ (2! 2!) = 30.',
    alt: '120 ignores the repeats, 60 divides out only one pair, 20 divides by 3! as if three letters matched, and 10 places the Ls but then forgets to arrange E, E, V.',
  }),
  counting('prob-two-women', 2, {
    stem: text('From 5 women and 4 men, a committee of 3 is chosen at random. What is the probability that exactly 2 of the committee members are women?'),
    choices: ['10/63', '20/63', '10/21', '5/9', '100/243'],
    ans: C,
    steps: ['Total committees: 9C3 = 84.', 'Two women and one man: 5C2 × 4C1 = 10 × 4 = 40.', '40/84 = 10/21.'],
    fast: 'Favorable groups ÷ all groups, both counted with combinations.',
    alt: '10/63 is one specific order (woman, woman, man), and 20/63 counts only two of the three orders. 100/243 assumes replacement, and 5/9 is the chance for a single pick.',
  }),
  counting('count-round-table', 3, {
    stem: text('Six people, including Ana and Ben, sit at a round table. Seatings that differ only by rotation count as the same. If Ana and Ben must sit next to each other, how many seatings are possible?'),
    choices: ['24', '48', '120', '240', '720'],
    ans: B,
    steps: ['Glue Ana and Ben into one block: now 5 units go around the table.', 'n units in a circle: (n − 1)! = 4! = 24.', 'Ana and Ben can swap within the block: 24 × 2 = 48.'],
    fast: 'Circle = fix one person, arrange the rest. Glue, arrange, then unglue (× 2).',
    alt: '24 forgets that the pair can swap, 240 arranges in a line (5! × 2), and 120 and 720 drop the "next to each other" or rotation rules.',
  }),
  counting('count-team-junior', 3, {
    stem: text('A 4-person team is to be chosen from 6 seniors and 4 juniors. How many teams include at least one junior?'),
    choices: ['15', '84', '195', '210', '336'],
    ans: C,
    steps: ['All teams: 10C4 = 210.', 'Teams with no junior: 6C4 = 15.', 'At least one junior: 210 − 15 = 195.'],
    fast: 'At least one = total − none.',
    alt: '336 = 4 × 9C3 picks "the" junior first and then any three, counting a team with two juniors twice. 84 forgets the × 4, 210 is every team, and 15 is the teams with no junior.',
  }),
  counting('prob-defect-source', 4, {
    stem: text("Machine X makes 60% of a factory's parts and machine Y makes the rest. 2% of X's parts and 5% of Y's parts are defective. If a randomly chosen part is defective, what is the probability that it was made by machine Y?"),
    choices: ['1/50', '3/8', '2/5', '5/8', '5/7'],
    ans: D,
    steps: ['Picture 1,000 parts: X makes 600, of which 12 are defective; Y makes 400, of which 20 are defective.', 'Defective parts: 12 + 20 = 32.', 'From Y: 20/32 = 5/8.'],
    fast: 'Conditional probability = the slice you want ÷ everything that matches the condition. Use 1,000 parts to keep it whole.',
    alt: "2/5 ignores the defect information, and 5/7 ignores Y's smaller share of production. 1/50 is the chance a part is both from Y and defective, and 3/8 is the answer for X.",
  }),
  counting('count-cookies-cap', 4, {
    stem: text('Eight identical cookies are to be given to 3 children so that each child gets at least 1 cookie and no child gets more than 4. In how many ways can this be done?'),
    choices: ['9', '12', '15', '21', '45'],
    ans: B,
    steps: ['Give each child 1 first; 5 identical cookies remain for 3 children: 7C2 = 21 ways (stars and bars).', 'Remove cases where one child gets 5 or more: give that child 4 extra; the other 1 cookie goes anywhere: 3 ways per child, 3 children, 9 cases. Two children cannot both exceed 4.', '21 − 9 = 12.'],
    fast: 'List it: the shares are 4-3-1 (6 orders), 4-2-2 (3 orders) or 3-3-2 (3 orders). 6 + 3 + 3 = 12.',
    alt: '21 ignores the cap, 9 is the cases removed, 15 removes them for only two of the children, and 45 = 10C2 also lets a child get nothing.',
  }),
];
