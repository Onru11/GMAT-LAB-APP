// Data Insights bank: Data sufficiency and Table questions.
// Every answer is re-derived independently in data-insights.test.ts.

import { DS_CHOICES, type Question, type StemPart } from '../questions';

const [A, B, C, D, E] = [0, 1, 2, 3, 4];

const ds = (id: string, level: number, rest: Omit<Question, 'id' | 'section' | 'topic' | 'kind' | 'level' | 'choices'>): Question =>
  ({ id, section: 'Data Insights', topic: 'Data sufficiency', kind: 'Data sufficiency', level, choices: DS_CHOICES, ...rest });
const tableQ = (id: string, level: number, rest: Omit<Question, 'id' | 'section' | 'topic' | 'kind' | 'level'>): Question =>
  ({ id, section: 'Data Insights', topic: 'Tables', kind: 'Data Insights · Table', level, ...rest });
const text = (t: string): StemPart[] => [{ t }];

// ── Data sufficiency ────────────────────────────────────────────────────

const DS_BANK: Question[] = [
  // Level 1
  ds('ds-di-jacket-pct', 1, {
    stem: text('By what percent did the price of a jacket increase from last year to this year?'),
    st: [{ t: 'The price increased by $15.' }, { t: 'This year’s price is 125% of last year’s price.' }],
    ans: B,
    steps: [
      '(1) A $15 rise is 75% of a $20 jacket but 37.5% of a $40 jacket. Without the starting price, not sufficient.',
      '(2) New = 1.25 × old, so the increase is 25% whatever the price. Sufficient.',
      '(2) alone works and (1) alone does not: B.',
    ],
    fast: 'A percent change needs change ÷ base. (2) hands you that ratio directly; (1) gives only the change.',
    alt: 'The trap is C: combining gives the actual prices ($60 and $75), but the question never asked for them.',
  }),
  ds('ds-di-even-sum', 1, {
    stem: text('a and b are integers. Is a + b even?'),
    st: [{ t: 'a and b are both odd.' }, { t: 'a − b is even.' }],
    ans: D,
    steps: [
      '(1) odd + odd = even. Yes, sufficient.',
      '(2) a + b = (a − b) + 2b, an even number plus an even number. Yes, sufficient.',
      'Each alone works: D.',
    ],
    fast: 'a + b and a − b differ by 2b, which is even, so they always share their parity.',
    alt: 'Test (2) with numbers: 5 and 3 give 8; 6 and 2 give 8; −3 and 7 give 4. Every case is even.',
  }),
  ds('ds-di-tickets', 1, {
    stem: text('A theater sold only adult and child tickets for a show. What was the total revenue from ticket sales?'),
    st: [{ t: 'The theater sold 120 tickets.' }, { t: 'Adult tickets cost $12 each and child tickets cost $8 each.' }],
    ans: E,
    steps: [
      '(1) gives a count but no prices. Not sufficient.',
      '(2) gives prices but no counts. Not sufficient.',
      'Together: 120 adults give $1,440; 120 children give $960. The split is unknown, so revenue is not fixed: E.',
    ],
    fast: 'Revenue = 12a + 8c. Together you know a + c and nothing that fixes a alone, so there are two unknowns and one equation.',
    alt: 'C is the trap: it feels like "count × price" once you have both, but there are two prices and one total count.',
  }),

  // Level 2
  ds('ds-di-shirts-pct', 2, {
    stem: text('A store sold shirts only at full price or at a discount last week. What percent of the shirts it sold were discounted?'),
    st: [{ t: 'For every 5 full-price shirts sold, the store sold 3 discounted shirts.' }, { t: 'The store sold 30 more full-price shirts than discounted shirts.' }],
    ans: A,
    steps: [
      '(1) Discounted : total = 3 : 8 = 37.5%. Sufficient.',
      '(2) 10 discounted and 40 full-price give 20%; 30 and 60 give 33.3%. Not sufficient.',
      'A.',
    ],
    fast: 'A percent of a whole is a ratio. (1) is a ratio; (2) is a difference, which needs a size to become a ratio.',
    alt: 'C is the trap: together you can find 45 and 75, but (1) already gave the percent.',
  }),
  ds('ds-di-median-five', 2, {
    stem: text('What is the median of the list 2, 9, 4, x, 7?'),
    st: [{ t: 'x > 8' }, { t: 'x < 9' }],
    ans: A,
    steps: [
      'Sorted without x: 2, 4, 7, 9. With five numbers the median is the 3rd.',
      '(1) x > 8 puts x after 7 (either before or after 9), so 7 stays third. Median 7: sufficient.',
      '(2) x = 5 gives 2, 4, 5, 7, 9 with median 5; x = 8 gives median 7. Not sufficient. A.',
    ],
    fast: 'Only ask where x lands relative to 7: above 7 the median is 7, below 4 it is 4, between it is x.',
    alt: 'Many pick C because (1) and (2) together pin x to between 8 and 9. You never needed x itself, only its side of 7.',
  }),
  ds('ds-di-consec-8', 2, {
    stem: text('n is a positive integer. Is n(n + 1)(n + 2) divisible by 8?'),
    st: [{ t: 'n is a multiple of 3.' }, { t: 'n is even.' }],
    ans: B,
    steps: [
      '(1) n = 3 gives 3 × 4 × 5 = 60 (no); n = 6 gives 6 × 7 × 8 = 336 (yes). Not sufficient.',
      '(2) n and n + 2 are consecutive even numbers, so one is a multiple of 4. The product has 2 × 4 = 8 as a factor. Yes: sufficient.',
      'B.',
    ],
    fast: 'Two consecutive evens always contain a multiple of 4, giving at least 2³.',
    alt: 'C is the trap: combining gives n = 6, 12, … and yes every time, but (2) alone already guarantees it. (1) fails because an odd n leaves only n + 1 even, and 4 alone is not 8.',
  }),
  ds('ds-di-speed', 2, {
    stem: text('Maria drove from town P to town Q at a constant speed. What was her speed, in miles per hour?'),
    st: [{ t: 'Had she driven 20 miles per hour faster, the trip would have taken 1 hour less.' }, { t: 'The trip took 3 hours.' }],
    ans: C,
    steps: [
      '(1) d = vt and d = (v + 20)(t − 1) give v = 20t − 20. 20 mph for 2 hours and 40 mph for 3 hours both fit. Not sufficient.',
      '(2) gives time but no distance. Not sufficient.',
      'Together: v = 20 × 3 − 20 = 40 mph. C.',
    ],
    fast: 'Count unknowns: v, t, d. (1) is one equation linking them; the stem fixes nothing. You need one more fact, and (2) supplies it.',
    alt: 'Check with numbers: 120 miles at 40 mph is 3 hours; at 60 mph it is 2 hours, one hour less.',
  }),
  ds('ds-di-mixture', 2, {
    stem: text('A 40-liter solution contains only acid and water. How many liters of acid does it contain?'),
    st: [{ t: 'The solution is 30% acid.' }, { t: 'Adding 10 liters of water would make the solution 24% acid.' }],
    ans: D,
    steps: [
      '(1) 30% of 40 = 12 liters. Sufficient.',
      '(2) The acid stays the same while the volume becomes 50: acid = 24% of 50 = 12 liters. Sufficient.',
      'Each alone works: D.',
    ],
    fast: 'Adding water changes the volume, not the acid. So (2) is just 0.24 × 50.',
    alt: 'Dividing 24% by 40 instead of 50 is the slip: it gives 9.6 liters and makes (2) look inconsistent.',
  }),
  ds('ds-di-mean-groups', 2, {
    stem: text('Groups X and Y have no members in common. What is the mean age of all the members of X and Y combined?'),
    st: [{ t: 'The mean age of X is 30 and the mean age of Y is 40.' }, { t: 'X has 10 more members than Y.' }],
    ans: E,
    steps: [
      '(1) The combined mean lies between 30 and 40 but depends on the group sizes. Not sufficient.',
      '(2) gives a difference in size, no ages. Not sufficient.',
      'Together: 20 and 10 members give (600 + 400) ÷ 30 = 33.3; 15 and 5 give (450 + 200) ÷ 20 = 32.5. Not sufficient: E.',
    ],
    fast: 'A weighted mean needs the ratio of the weights. A difference of 10 does not fix the ratio.',
    alt: 'C is the trap. It would be right if (2) gave a ratio, such as "X has twice as many members as Y".',
  }),

  // Level 3
  ds('ds-di-div6-no', 3, {
    stem: text('Is the integer n divisible by 6?'),
    st: [{ t: 'n + 1 is divisible by 3.' }, { t: 'n is divisible by 4.' }],
    ans: A,
    steps: [
      '(1) n + 1 is a multiple of 3, so n leaves remainder 2 when divided by 3. n is not divisible by 3, so not by 6. A definite no: sufficient.',
      '(2) n = 12 gives yes; n = 4 gives no. Not sufficient.',
      'A.',
    ],
    fast: 'A sure "no" is sufficient. Divisibility by 6 needs divisibility by 3, and (1) rules that out.',
    alt: 'The trap is reading "no" as "not enough information" and choosing E, or combining to get n = 8, 20, … and calling it C.',
  }),
  ds('ds-di-pumps', 3, {
    stem: text('Working together at constant rates, pumps A and B fill an empty tank in 6 hours. How many hours would pump A, working alone, take to fill the tank?'),
    st: [{ t: 'Pump B alone takes three times as long as pump A alone to fill the tank.' }, { t: 'Pump A pumps 50 more gallons per hour than pump B.' }],
    ans: A,
    steps: [
      '(1) If A takes a hours, B takes 3a: 1/a + 1/(3a) = 1/6, so 4/(3a) = 1/6 and a = 8. Sufficient.',
      '(2) Without the tank size, gallons do not convert to hours. A 600-gallon tank with A at 75 and B at 25 gallons per hour gives a = 8; a 420-gallon tank with A at 60 and B at 10 gives a = 7. Not sufficient.',
      'A.',
    ],
    fast: 'In work problems only rates relative to the job matter. (1) is a ratio of times; (2) is in gallons with no tank size.',
    alt: 'C is the trap: together you find a 600-gallon tank, but (1) alone already gave a = 8.',
  }),
  ds('ds-di-range-median', 3, {
    stem: text('What is the range of the list 6, 11, 3, x?'),
    st: [{ t: 'x > 4' }, { t: 'x equals the median of the list.' }],
    ans: B,
    steps: [
      '(1) x = 5 gives range 11 − 3 = 8; x = 20 gives 20 − 3 = 17. Not sufficient.',
      '(2) Test where x sits. Between 3 and 6: median (x + 6)/2 = x gives x = 6. Between 6 and 11: median (6 + x)/2 = x gives x = 6. Below 3 the median is 4.5 and above 11 it is 8.5, both contradictions. So x = 6 and the range is 8. Sufficient.',
      'B.',
    ],
    fast: 'If x is the median of an even-sized list, it must equal the other middle value, and here that is 6.',
    alt: 'Even without solving, any x between 3 and 11 gives range 8, and the median can never fall outside 3–11.',
  }),
  ds('ds-di-rem12', 3, {
    stem: text('n is a positive integer. What is the remainder when n is divided by 12?'),
    st: [{ t: 'When n is divided by 4, the remainder is 3.' }, { t: 'When n is divided by 6, the remainder is 5.' }],
    ans: C,
    steps: [
      '(1) n = 3, 7, 11, 15 … leave remainders 3, 7, 11 on division by 12. Not sufficient.',
      '(2) n = 5, 11, 17, 23 … leave remainders 5 or 11. Not sufficient.',
      'Together n is 1 less than a multiple of 4 and of 6, so 1 less than a multiple of 12: n = 11, 23, 35 … Remainder 11. C.',
    ],
    fast: 'Both remainders are "divisor − 1". So n + 1 is a multiple of LCM(4, 6) = 12.',
    alt: 'List both sequences and find the first common term (11); after that it repeats every 12.',
  }),
  ds('ds-di-sets-both', 3, {
    stem: text('Each of the 100 members of a club plays tennis, golf, both or neither. How many members play both?'),
    st: [{ t: '60 members play tennis and 50 play golf.' }, { t: '10 members play neither.' }],
    ans: C,
    steps: [
      '(1) Both could be anywhere from 10 (if no one plays neither) to 50. Not sufficient.',
      '(2) Without the group sizes, both is unknown. Not sufficient.',
      'Together: 90 play at least one, so 60 + 50 − both = 90 and both = 20. C.',
    ],
    fast: 'Total = A + B − both + neither. You need all four of the other numbers.',
    alt: 'A is the trap: 60 + 50 − 100 = 10 assumes no one plays neither.',
  }),
  ds('ds-di-ineq-shift', 3, {
    stem: text('Is 3x − 2 > 2x + y?'),
    st: [{ t: 'x > y + 3' }, { t: '2x − 2y > 5' }],
    ans: D,
    steps: [
      'Rearrange the question: is x − y > 2?',
      '(1) x − y > 3, so certainly greater than 2. Yes: sufficient.',
      '(2) x − y > 2.5, so greater than 2. Yes: sufficient. D.',
    ],
    fast: 'Simplify the question before reading the statements. Then each statement is one line.',
    alt: 'Picking numbers without rearranging is slow and invites mistakes on the boundary.',
  }),
  ds('ds-di-prime-count', 3, {
    stem: text('k is a positive integer. How many different prime factors does k have?'),
    st: [{ t: '2k has exactly 3 different prime factors.' }, { t: 'k is divisible by 15.' }],
    ans: E,
    steps: [
      '(1) If k is odd, doubling adds the prime 2, so k has 2. If k is even, doubling adds nothing new, so k has 3. Not sufficient.',
      '(2) k = 15 has 2; k = 30 has 3. Not sufficient.',
      'Together: k = 15 (2k = 30 = 2 × 3 × 5) gives 2; k = 30 (2k = 60) gives 3. Not sufficient: E.',
    ],
    fast: 'Doubling adds a new prime only when k is odd. Neither statement settles whether k is odd.',
    alt: 'C is the trap: it assumes 15 already uses up two primes and the third must come from doubling. k = 30 breaks it.',
  }),

  // Level 4
  ds('ds-di-recip', 4, {
    stem: text('If x ≠ 0, is x < 1/x?'),
    st: [{ t: 'x(x', s: '2', t2: ' − 1) < 0' }, { t: 'x < 1' }],
    ans: A,
    steps: [
      'Multiply the question by x², which is positive: is x³ < x, that is, is x(x² − 1) < 0?',
      '(1) is exactly that inequality. Yes: sufficient.',
      '(2) x = 0.5 gives 0.5 < 2, yes; x = −0.5 gives −0.5 < −2, no. Not sufficient. A.',
    ],
    fast: 'To clear a fraction from an inequality without knowing the sign, multiply by the square, never by x itself.',
    alt: 'Without the trick, solve (1) by sign chart: x < −1 or 0 < x < 1. Check both regions in x < 1/x: −2 < −0.5 and 0.5 < 2. Always yes.',
  }),
  ds('ds-di-pow7-rem5', 4, {
    stem: [{ t: 'n is a positive integer. What is the remainder when 7', s: 'n' }, { t: ' is divided by 5?' }],
    st: [{ t: 'n is a multiple of 3.' }, { t: 'n', s: '2', t2: ' leaves a remainder of 4 when divided by 8.' }],
    ans: B,
    steps: [
      'Powers of 7 mod 5 cycle every 4: 7 → 2, 7² → 4, 7³ → 3, 7⁴ → 1. So you need n mod 4.',
      '(1) n = 3 gives 3; n = 6 (≡ 2 mod 4) gives 4. Not sufficient.',
      '(2) Odd squares leave 1 mod 8, multiples of 4 leave 0, and n ≡ 2 mod 4 leaves 4. So n ≡ 2 mod 4 and the remainder is 4. Sufficient. B.',
    ],
    fast: 'Reduce the question to n mod 4, then test (2) with n = 1, 2, 3, 4: only n = 2 (and 6, 10 …) gives 4 mod 8.',
    alt: 'C is the trap: combining gives n = 6, 18, 30 …, all with remainder 4, but (2) already did that alone.',
  }),
  ds('ds-di-abs-lt1', 4, {
    stem: text('Is |x| < 1?'),
    st: [{ t: 'x', s: '2', t2: ' < 2x' }, { t: 'x', s: '3', t2: ' < x' }],
    ans: C,
    steps: [
      '(1) x² − 2x < 0 means x(x − 2) < 0, so 0 < x < 2. x = 0.5 says yes; x = 1.5 says no. Not sufficient.',
      '(2) x³ − x < 0 means x(x − 1)(x + 1) < 0, so x < −1 or 0 < x < 1. x = −2 says no; x = 0.5 says yes. Not sufficient.',
      'Together: 0 < x < 1, so |x| < 1. Yes: C.',
    ],
    fast: 'Never divide an inequality by x. Factor and draw a sign chart for each statement, then overlap the intervals.',
    alt: 'Dividing (1) by x gives x < 2 and dividing (2) by x gives x² < 1, which makes (2) look sufficient. Both divisions assume x > 0.',
  }),
  ds('ds-di-median-mean', 4, {
    stem: text('The list 10, 4, 8, x contains four numbers. What is the value of x?'),
    st: [{ t: 'The median of the list is 9.' }, { t: 'The mean of the list equals its median.' }],
    ans: C,
    steps: [
      '(1) If x ≥ 10, the middle values are 8 and 10, median 9. Any x ≥ 10 works. Not sufficient.',
      '(2) x ≤ 4: median 6 = (22 + x)/4 gives x = 2. 4 ≤ x ≤ 8: (x + 8)/2 = (22 + x)/4 gives x = 6. 8 ≤ x ≤ 10: x = 6, outside the case. x ≥ 10: 9 = (22 + x)/4 gives x = 14. So x is 2, 6 or 14. Not sufficient.',
      'Together: x ≥ 10 and x ∈ {2, 6, 14}, so x = 14. C.',
    ],
    fast: 'Split by where x sorts. In each case the median is a fixed formula; set it equal to the mean and keep only answers inside the case.',
    alt: 'B is the trap: solving only the case x ≥ 10 for (2) finds 14 and misses 2 and 6.',
  }),
  ds('ds-di-abs-no', 4, {
    stem: text('Is |x − 3| < |x + 3|?'),
    st: [{ t: 'x', s: '2', t2: ' + x < 0' }, { t: 'x + 1/x < −2' }],
    ans: D,
    steps: [
      'x is closer to 3 than to −3 exactly when x > 0. So the question is: is x > 0?',
      '(1) x(x + 1) < 0 gives −1 < x < 0. Always no: sufficient.',
      '(2) For x > 0, x + 1/x ≥ 2, so x must be negative (and x ≠ −1). Always no: sufficient. D.',
    ],
    fast: 'Read absolute values as distances: the question asks whether x is on the positive side of 0.',
    alt: 'The trap is treating a consistent "no" as insufficient. Both statements answer no every time, so each is sufficient.',
  }),
  ds('ds-di-divide-x', 4, {
    stem: text('What is the value of x?'),
    st: [{ t: 'x', s: '2', t2: ' = 4x' }, { t: 'x', s: '3', t2: ' = 16x' }],
    ans: E,
    steps: [
      '(1) x² − 4x = 0, so x = 0 or x = 4. Not sufficient.',
      '(2) x³ − 16x = 0, so x = 0, 4 or −4. Not sufficient.',
      'Together x is 0 or 4. Not sufficient: E.',
    ],
    fast: 'Move everything to one side and factor; x = 0 survives every equation of this shape.',
    alt: 'Dividing by x gives x = 4 from (1) alone and makes A look right. It silently throws away x = 0.',
  }),
];

// ── Tables ───────────────────────────────────────────────────────────────

const BRANCHES = {
  head: ['Branch', 'Employees 2023', 'Employees 2024', 'Revenue 2024 ($k)'],
  rows: [['Alder', '40', '50', '2,000'], ['Birch', '60', '54', '2,700'], ['Cedar', '25', '30', '1,350'], ['Delta', '75', '90', '3,150']],
};
const CHANNELS = {
  head: ['Channel', 'Spend ($k)', 'Leads', 'Conversion rate (%)'],
  rows: [['Search', '120', '2,400', '5'], ['Social', '80', '2,000', '3'], ['Email', '40', '800', '10'], ['Events', '60', '600', '15']],
};
const CITIES = {
  head: ['City', 'Population (thousands)', 'Registered cars (thousands)', 'Electric share of cars (%)'],
  rows: [['Avon', '500', '200', '4'], ['Brill', '800', '400', '2.5'], ['Corin', '250', '150', '6'], ['Dunmore', '1,200', '360', '5']],
};
const PAYROLL = {
  head: ['Department', 'Employees', 'Average salary 2023 ($k)', 'Change in average salary, 2024 (%)'],
  rows: [['Sales', '50', '60', '+10'], ['Engineering', '30', '100', '+8'], ['Support', '20', '40', '−5']],
};
const HOTELS = {
  head: ['Hotel', 'Rooms', 'Q1 occupancy (%)', 'Q2 occupancy (%)', 'Nightly rate ($)'],
  rows: [['Harbor', '200', '70', '80', '150'], ['Summit', '100', '60', '85', '220'], ['Garden', '80', '50', '70', '120'], ['Plaza', '400', '80', '60', '180']],
};

const TABLE_BANK: Question[] = [
  tableQ('tbl-di-branch-rpe', 2, {
    table: BRANCHES,
    stem: text('Which branch had the highest 2024 revenue per 2024 employee?'),
    choices: ['Alder', 'Birch', 'Cedar', 'Delta', 'Birch and Cedar are tied'],
    ans: B,
    steps: ['Revenue ÷ 2024 employees: Alder 2,000 ÷ 50 = 40; Birch 2,700 ÷ 54 = 50.', 'Cedar 1,350 ÷ 30 = 45; Delta 3,150 ÷ 90 = 35.', 'Birch is highest at $50k per employee.'],
    fast: 'Scale to round numbers: Birch is 2,700 on 54, i.e. 50 per head; only Cedar comes close at 45.',
    alt: 'Dividing by the 2023 column makes Cedar win (54); the biggest revenue, Delta, actually has the lowest revenue per employee.',
  }),
  tableQ('tbl-di-branch-headcount', 3, {
    table: BRANCHES,
    stem: text('By what percent did the total number of employees at the four branches change from 2023 to 2024?'),
    choices: ['+10.7%', '+12.0%', '+13.8%', '+20.0%', '+24.0%'],
    ans: B,
    steps: ['2023 total: 40 + 60 + 25 + 75 = 200.', '2024 total: 50 + 54 + 30 + 90 = 224.', '24 ÷ 200 = 12.0%.'],
    fast: 'Total each column first; a gain of 24 on 200 is 12%.',
    alt: '+13.8% averages the four branch changes (25%, −10%, 20%, 20%), ignoring size. +10.7% divides by the 2024 total. +24.0% reads the raw gain as a percent.',
  }),
  tableQ('tbl-di-chan-cpl', 1, {
    table: CHANNELS,
    stem: text('Which channel had the lowest spend per lead?'),
    choices: ['Search', 'Social', 'Email', 'Events', 'Search and Email are tied'],
    ans: B,
    steps: ['Spend per lead = spend ÷ leads.', 'Search $120k ÷ 2,400 = $50; Social $80k ÷ 2,000 = $40.', 'Email $40k ÷ 800 = $50; Events $60k ÷ 600 = $100. Social is lowest.'],
    fast: 'Compare leads per $1k: Social 25, Search and Email 20, Events 10.',
    alt: 'Search and Email do tie, but for second place. Email is the trap if you think in customers rather than leads.',
  }),
  tableQ('tbl-di-chan-cpc', 2, {
    table: CHANNELS,
    stem: text('Customers = leads × conversion rate. Which channel had the lowest spend per customer?'),
    choices: ['Search', 'Social', 'Email', 'Events', 'Social and Email are tied'],
    ans: C,
    steps: ['Customers: Search 120, Social 60, Email 80, Events 90.', 'Spend per customer: Search $1,000, Social ≈ $1,333, Email $500, Events ≈ $667.', 'Email is lowest.'],
    fast: 'Spend per customer = spend per lead ÷ conversion rate: Email 50 ÷ 0.10 = 500 beats Events 100 ÷ 0.15 ≈ 667 and Search 50 ÷ 0.05 = 1,000.',
    alt: 'Social is cheapest per lead but converts worst; Events converts best but leads cost the most. Combine both factors.',
  }),
  tableQ('tbl-di-chan-shift', 4, {
    table: CHANNELS,
    stem: text('Suppose $20k of spend moves from Social to Email, and each channel keeps its spend per lead and its conversion rate. By how much does the total number of customers change?'),
    choices: ['−15', '+7', '+25', '+40', '+55'],
    ans: C,
    steps: ['Social loses $20k ÷ $40 = 500 leads; at 3% that is 15 customers.', 'Email gains $20k ÷ $50 = 400 leads; at 10% that is 40 customers.', 'Net change: 40 − 15 = +25.'],
    fast: 'Customers per $1k: Social 25 × 0.03 = 0.75, Email 20 × 0.10 = 2. The shift gains 20 × (2 − 0.75) = 25.',
    alt: '+40 forgets Social’s loss; +55 adds the loss instead of subtracting it; +7 compares conversion rates while ignoring how many leads a dollar buys.',
  }),
  tableQ('tbl-di-city-ev', 1, {
    table: CITIES,
    stem: text('Which city has the largest number of electric cars?'),
    choices: ['Avon', 'Brill', 'Corin', 'Dunmore', 'Brill and Corin are tied'],
    ans: D,
    steps: ['Electric cars = registered cars × share.', 'Avon 200 × 4% = 8k; Brill 400 × 2.5% = 10k.', 'Corin 150 × 6% = 9k; Dunmore 360 × 5% = 18k. Dunmore has the most.'],
    fast: 'Dunmore has nearly the most cars and the second-highest share, so its product is far ahead.',
    alt: 'Corin has the highest share and Brill the most cars; neither wins on the product.',
  }),
  tableQ('tbl-di-city-ratio', 3, {
    table: CITIES,
    stem: text('The number of electric cars per 1,000 residents in Corin is approximately how many times that in Dunmore?'),
    choices: ['0.5', '1.2', '2.0', '2.4', '4.8'],
    ans: D,
    steps: ['Corin: 9,000 electric cars ÷ 250,000 residents = 36 per 1,000.', 'Dunmore: 18,000 ÷ 1,200,000 = 15 per 1,000.', '36 ÷ 15 = 2.4.'],
    fast: 'Ratio of ratios: (cars per resident ratio) × (share ratio) = (0.6 ÷ 0.3) × (6 ÷ 5) = 2 × 1.2 = 2.4.',
    alt: '1.2 compares only the shares; 2.0 compares only cars per resident; 0.5 compares raw counts; 4.8 is the population ratio.',
  }),
  tableQ('tbl-di-pay-dollar', 2, {
    table: PAYROLL,
    stem: text('Which department’s average salary rose by the greatest number of dollars from 2023 to 2024?'),
    choices: ['Sales', 'Engineering', 'Support', 'Sales and Engineering are tied', 'It cannot be determined from the table'],
    ans: B,
    steps: ['Dollar change = 2023 average × percent change.', 'Sales 60 × 10% = $6k; Engineering 100 × 8% = $8k; Support 40 × −5% = −$2k.', 'Engineering rose the most.'],
    fast: 'A smaller percent of a much larger base can still be more dollars: 8% of 100 beats 10% of 60.',
    alt: 'Sales has the biggest percent rise, which is the trap. The table gives both base and percent, so the answer can be determined.',
  }),
  tableQ('tbl-di-pay-total', 4, {
    table: PAYROLL,
    stem: text('Assuming the number of employees in each department did not change, by approximately what percent did total payroll change from 2023 to 2024?'),
    choices: ['+4.3%', '+6.4%', '+6.8%', '+7.4%', '+13.0%'],
    ans: D,
    steps: ['2023 payroll ($k): Sales 50 × 60 = 3,000; Engineering 30 × 100 = 3,000; Support 20 × 40 = 800; total 6,800.', 'Changes: +300, +240, −40; total +500.', '500 ÷ 6,800 ≈ 7.4%.'],
    fast: 'Weight each percent by payroll, not headcount: Sales and Engineering each carry 3,000 of 6,800.',
    alt: '+4.3% is the plain average of the three percents; +6.4% weights them by employees; +6.8% divides by the 2024 payroll; +13.0% adds the percents.',
  }),
  tableQ('tbl-di-hotel-points', 0, {
    table: HOTELS,
    stem: text('Which hotel’s occupancy rate rose by the most percentage points from Q1 to Q2?'),
    choices: ['Harbor', 'Summit', 'Garden', 'Plaza', 'Summit and Garden are tied'],
    ans: B,
    steps: ['Harbor +10, Summit +25, Garden +20, Plaza −20 points.', 'Summit rose the most.'],
    fast: 'Subtract the two occupancy columns row by row.',
    alt: 'Plaza moved by 20 points too, but downward. Percentage points are a difference, not a percent change.',
  }),
  tableQ('tbl-di-hotel-combined', 3, {
    table: HOTELS,
    stem: text('What was the combined Q2 occupancy rate of the four hotels, that is, occupied rooms as a percent of all rooms?'),
    choices: ['65.0%', '69.4%', '71.8%', '73.8%', '75.0%'],
    ans: B,
    steps: ['Occupied rooms in Q2: Harbor 160, Summit 85, Garden 56, Plaza 240; total 541.', 'All rooms: 200 + 100 + 80 + 400 = 780.', '541 ÷ 780 ≈ 69.4%.'],
    fast: 'Plaza holds over half the rooms at 60%, so the combined rate sits well below the simple average of 73.75%.',
    alt: '73.8% is the unweighted average of the Q2 rates; 71.8% is the combined Q1 rate; 65.0% is the unweighted Q1 average.',
  }),
  tableQ('tbl-di-hotel-true', 4, {
    table: HOTELS,
    stem: text('The nightly rate was the same in both quarters. Based on the table, which of the following statements is true?'),
    choices: [
      'The combined occupancy rate of the four hotels was higher in Q2 than in Q1.',
      'In Q2, Plaza had more occupied rooms per night than Harbor and Summit combined.',
      'In Q2, Plaza earned more room revenue per night than Harbor and Summit combined.',
      'In Q2, Summit earned more room revenue per night than Harbor.',
      'In Q2, Plaza had the lowest revenue per available room of the four hotels.',
    ],
    ans: C,
    steps: [
      'Combined occupancy: Q1 560 of 780 rooms, Q2 541 of 780. It fell, so the first is false.',
      'Q2 occupied rooms: Plaza 240 vs Harbor 160 + Summit 85 = 245. False.',
      'Q2 revenue per night: Plaza 240 × 180 = $43,200; Harbor 160 × 150 = $24,000; Summit 85 × 220 = $18,700. 43,200 > 42,700: true. Summit < Harbor: false.',
      'Revenue per available room: Harbor $120, Summit $187, Garden $84, Plaza $108. Garden is lowest, so the last is false.',
    ],
    fast: 'Check the close calls with exact products; the third statement wins by only $500.',
    alt: 'The first statement is the trap: the average of the four rates rises from 65% to 73.75%, but Plaza’s 400 rooms dominate the combined rate.',
  }),
];

export const DATA_INSIGHTS: Question[] = [...DS_BANK, ...TABLE_BANK];
