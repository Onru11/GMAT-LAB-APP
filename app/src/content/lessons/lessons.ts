// Two short lessons per topic: order 1 teaches the core method, order 2 the
// most common trap or a second key technique. Every number-kind answer is
// recomputed in lessons.test.ts from the numbers in its prompt.

import type { Guided, Lesson } from './types';
import { DS_CHOICES } from '../questions';

const G1 = 'Guided question 1 of 2';
const G2 = 'Guided question 2 of 2';

const num = (label: string, prompt: string, ans: number, unit: string, ok: string, bad: string): Guided => ({
  kind: 'number',
  label,
  prompt,
  ans,
  unit,
  ok,
  bad,
});

const choice = (label: string, prompt: string, choices: string[], ans: number, ok: string, bad: string): Guided => ({
  kind: 'choice',
  label,
  prompt,
  choices,
  ans,
  ok,
  bad,
});

// DS_CHOICES indexes: A 0, B 1, C 2, D 3, E 4.
const [A, B, C] = [0, 1, 2];

export const LESSONS: Lesson[] = [
  // ── Percents ──────────────────────────────────────────────────────────
  {
    id: 'percents-1',
    topic: 'Percents',
    order: 1,
    title: 'Percent change',
    rule: {
      headline: 'Divide the change by where you started.',
      body: 'Percent change is the change over the original value. The original is the “from” number, never the “to” number.',
      formula: '% change = (New − Old) ÷ Old × 100',
      note: 'From 50 to 60 is +20%. From 60 back to 50 is only −16.7%.',
    },
    example: {
      prompt: 'A price goes from $80 to $100. What is the percent increase?',
      lines: ['Change = 100 − 80 = 20', '20 ÷ 80 = 0.25', 'Increase = +25%'],
      note: 'The same $20 is 25% of 80 but only 20% of 100, and both numbers sit in the answer choices.',
    },
    trap: {
      title: 'Dividing by the new value',
      body: 'From 80 to 100, 20 ÷ 100 gives 20%, which is wrong. Always ask “percent of what?” and divide by the starting value.',
    },
    guided: [
      num(G1, 'A town grows from 40,000 to 46,000 people. By what percent did it grow?', 15, '%',
        '6,000 ÷ 40,000 = 0.15, so the town grew 15%.',
        'Find the change in people first, then divide by the starting population.'),
      num(G2, 'A price drops from $250 to $200. By what percent did it drop?', 20, '%',
        '50 ÷ 250 = 0.2, so a 20% drop. Dividing by 200 gives 25%, the trap.',
        'Divide the drop by the original price, not the new one.'),
    ],
  },
  {
    id: 'percents-2',
    topic: 'Percents',
    order: 2,
    title: 'Two changes in a row',
    rule: {
      headline: 'Percent changes multiply. They never add.',
      body: 'Turn each change into a multiplier, then multiply the multipliers.',
      formula: 'New = Old × (1 + a) × (1 + b)',
      note: 'A rise of 20% is ×1.2. A fall of 15% is ×0.85.',
    },
    example: {
      prompt: 'A price rises 10%, then rises another 10%. What is the total change?',
      lines: ['+10% → ×1.1, twice', '1.1 × 1.1 = 1.21', 'Total change = +21%, not +20%'],
      note: 'The second 10% is taken on 110, not 100. That extra 1% is where the points hide.',
    },
    trap: {
      title: '+20% then −20% is not 0%',
      body: 'The second change acts on a new, bigger base. 1.2 × 0.8 = 0.96, so you end 4% down. Answer choice “no change” is there to catch you.',
    },
    guided: [
      num(G1, 'A stock rises 50%, then falls 50%. Its final value is what percent of the original?', 75, '%',
        '1.5 × 0.5 = 0.75. Down 25% overall.',
        'Multiply the multipliers: 1.5 × 0.5.'),
      num('Guided question 2 of 2 · Watch the question word', 'A salary rises 10%, then rises another 20%. By what percent did it increase in total?', 32, '%',
        '1.1 × 1.2 = 1.32, so +32%. The question asks for the increase, not the final percent.',
        'Not 30%. Try 1.1 × 1.2, then subtract 100%.'),
    ],
  },

  // ── Fractions ─────────────────────────────────────────────────────────
  {
    id: 'fractions-1',
    topic: 'Fractions',
    order: 1,
    title: '“Of” means multiply',
    rule: {
      headline: '“Of” means multiply. Cancel before you multiply.',
      body: 'Write the chain as one product of fractions. Cross-cancel first so the numbers stay small.',
      formula: 'a/b of c/d of N = (a × c × N) ÷ (b × d)',
    },
    example: {
      prompt: 'What is 2/3 of 3/4 of 120?',
      lines: ['2/3 × 3/4: the 3s cancel → 2/4 = 1/2', '1/2 × 120 = 60'],
      note: 'Cancelling turns a messy product into “half of 120” in one step.',
    },
    trap: {
      title: 'Multiplying out before cancelling',
      body: 'Computing 2 × 3 × 120 = 720 and then dividing by 12 works, but it costs time and invites slips. Cancel across the whole chain first.',
    },
    guided: [
      num(G1, 'What is 3/5 of 5/8 of 160?', 60, '',
        'The 5s cancel: 3/8 × 160 = 60.',
        'Multiply the two fractions first; look for a factor that cancels.'),
      num(G2, 'What is 4/9 of 3/4 of 72?', 24, '',
        '4/9 × 3/4 = 3/9 = 1/3, and 1/3 of 72 is 24.',
        'Cancel the 4s, simplify what is left, then take that fraction of 72.'),
    ],
  },
  {
    id: 'fractions-2',
    topic: 'Fractions',
    order: 2,
    title: 'Fraction of the rest',
    rule: {
      headline: 'Take each new fraction of what is left.',
      body: 'When a problem says “of the remainder”, the base shrinks. Find what is left after each step before applying the next fraction.',
    },
    example: {
      prompt: 'Ana spends 1/3 of her money on rent and 1/4 of the rest on food. What fraction is left?',
      lines: ['After rent: 2/3 left', 'Food: 1/4 × 2/3 = 1/6', 'Left: 2/3 − 1/6 = 1/2'],
      note: 'Food takes 1/4 of 2/3, not 1/4 of the whole, so the answer is 1/2, not 5/12.',
    },
    trap: {
      title: 'Adding the fractions directly',
      body: '1/3 + 1/4 = 7/12 spent only if both fractions are of the original. “Of the rest” means the second fraction acts on a smaller amount.',
    },
    guided: [
      num(G1, 'A tank holds 120 liters. 1/4 is used on Monday and 1/3 of the remainder on Tuesday. How many liters are left?', 60, 'liters',
        'Monday leaves 90. Tuesday uses 1/3 of 90 = 30, so 60 liters are left.',
        'Monday leaves 3/4 of the tank. Take Tuesday’s fraction of that amount, not of 120.'),
      num(G2, 'Of a $600 budget, 1/2 goes to rent and 2/5 of the remainder goes to food. How many dollars are left?', 180, '$',
        'Rent leaves $300. Food takes 2/5 of 300 = $120, leaving $180.',
        'After rent, find 2/5 of what remains, then subtract it from what remains.'),
    ],
  },

  // ── Ratios & mixtures ─────────────────────────────────────────────────
  {
    id: 'ratios-mixtures-1',
    topic: 'Ratios & mixtures',
    order: 1,
    title: 'Ratios are parts',
    rule: {
      headline: 'Add the parts, find one part, then scale.',
      body: 'A ratio of 2 : 7 means 9 equal parts. Divide the total by the number of parts to get the size of one part.',
      formula: 'One part = Total ÷ (sum of ratio terms)',
    },
    example: {
      prompt: 'Red to blue marbles is 2 : 7, with 54 marbles in all. How many are blue?',
      lines: ['2 + 7 = 9 parts', '54 ÷ 9 = 6 per part', 'Blue = 7 × 6 = 42'],
      note: 'Once you know one part, every quantity in the problem is a quick multiplication.',
    },
    trap: {
      title: 'Answering for the wrong part',
      body: 'The choice for the other group (here 12 red) is always offered. Reread which part the question asks for before you commit.',
    },
    guided: [
      num(G1, 'The ratio of cats to dogs at a shelter is 4 : 5. There are 72 animals in all. How many are dogs?', 40, 'dogs',
        '4 + 5 = 9 parts, 72 ÷ 9 = 8 per part, so 5 × 8 = 40 dogs.',
        'Add the ratio terms to find how many animals make one part.'),
      num(G2, 'Profit is split 3 : 5 between two partners. The smaller share is $1,200. What is the total profit, in dollars?', 3200, '$',
        'The smaller share is 3 parts, so one part is $400. Total = 8 × 400 = $3,200.',
        'The smaller share is 3 parts. Find one part, then count all the parts.'),
    ],
  },
  {
    id: 'ratios-mixtures-2',
    topic: 'Ratios & mixtures',
    order: 2,
    title: 'Mixtures: track the pure stuff',
    rule: {
      headline: 'Track the pure ingredient, not the mixture.',
      body: 'Convert each solution into an amount of the pure ingredient. Add amounts, then divide by the total volume.',
      formula: 'Amount = concentration × volume',
    },
    example: {
      prompt: '10 L of 20% salt water is mixed with 10 L of 50% salt water. What is the new concentration?',
      lines: ['0.2 × 10 = 2 L salt', '0.5 × 10 = 5 L salt', '7 ÷ 20 = 35%'],
      note: 'Working in liters of salt turns every mixture question into simple addition.',
    },
    trap: {
      title: 'Averaging the percents',
      body: 'The simple average of 20% and 50% is right only when the volumes are equal. With unequal volumes, the bigger batch pulls the result toward its own concentration.',
    },
    guided: [
      num(G1, 'Mix 30 liters of 10% juice with 10 liters of 50% juice. What percent of the mix is juice?', 20, '%',
        '3 + 5 = 8 liters of juice in 40 liters, so 20%.',
        'Find the liters of pure juice in each part, then divide by the total volume.'),
      num(G2, 'How many liters of water must be added to 20 liters of 40% acid to make a 25% acid solution?', 12, 'liters',
        'Acid stays at 8 liters. 8 ÷ 0.25 = 32 liters total, so add 12 liters of water.',
        'The amount of acid does not change. Find the total volume that makes it 25%, then subtract what you already have.'),
    ],
  },

  // ── Rates & work ──────────────────────────────────────────────────────
  {
    id: 'rates-work-1',
    topic: 'Rates & work',
    order: 1,
    title: 'Distance, rate, time',
    rule: {
      headline: 'Distance equals rate times time. Match the units.',
      body: 'Every motion problem is D = R × T. Convert minutes to hours (or the reverse) before you multiply.',
      formula: 'D = R × T',
      note: '20 minutes is 1/3 of an hour, not 0.2.',
    },
    example: {
      prompt: 'A train travels at 75 mph for 1 hour 40 minutes. How far does it go?',
      lines: ['1 h 40 min = 1 + 40/60 = 5/3 h', '75 × 5/3 = 125', 'Distance = 125 miles'],
      note: 'Writing minutes as a fraction of 60 keeps the arithmetic exact.',
    },
    trap: {
      title: 'Treating minutes as decimals',
      body: '1 hour 40 minutes is not 1.4 hours. Divide minutes by 60 every time.',
    },
    guided: [
      num(G1, 'A cyclist rides at 18 miles per hour for 2 hours 20 minutes. How many miles does she ride?', 42, 'miles',
        '2 h 20 min = 7/3 h, and 18 × 7/3 = 42 miles.',
        'Convert the minutes to a fraction of an hour first, then multiply by the rate.'),
      num(G2, 'A car covers 150 miles in 2 hours 30 minutes. What is its average speed, in miles per hour?', 60, 'mph',
        '2 h 30 min = 2.5 h, and 150 ÷ 2.5 = 60 mph.',
        'Rate is distance divided by time, with the time written in hours.'),
    ],
  },
  {
    id: 'rates-work-2',
    topic: 'Rates & work',
    order: 2,
    title: 'Working together',
    rule: {
      headline: 'Add rates, never times.',
      body: 'Turn each “job in t hours” into a rate of 1/t job per hour. Add the rates, then flip the total to get the time.',
      formula: '1/a + 1/b = 1/T',
    },
    example: {
      prompt: 'Hose A fills a pool in 3 hours and hose B in 6 hours. How long together?',
      lines: ['1/3 + 1/6 = 1/2 pool per hour', 'Time = 1 ÷ 1/2 = 2 hours'],
      note: 'Together must be faster than the faster worker alone, a quick sanity check.',
    },
    trap: {
      title: 'Averaging or adding the times',
      body: 'Averaging 3 and 6 gives 4.5 hours, slower than hose A alone. Times do not combine; rates do.',
    },
    guided: [
      num(G1, 'Pipe A fills a tank in 4 hours and pipe B fills it in 12 hours. Working together, how many hours do they take?', 3, 'hours',
        '1/4 + 1/12 = 4/12 = 1/3 tank per hour, so 3 hours.',
        'Turn each time into a rate per hour, add the rates, then flip the sum.'),
      num(G2, 'Together, Ann and Ben paint a fence in 6 hours. Ann alone takes 10 hours. How many hours would Ben take alone?', 15, 'hours',
        '1/6 − 1/10 = 5/30 − 3/30 = 1/15, so Ben takes 15 hours.',
        'Subtract Ann’s rate from the combined rate, then flip the result.'),
    ],
  },

  // ── Number properties ─────────────────────────────────────────────────
  {
    id: 'number-properties-1',
    topic: 'Number properties',
    order: 1,
    title: 'Prime factors first',
    rule: {
      headline: 'Break it into primes, then read everything off.',
      body: 'Every integer above 1 is a unique product of primes. Factor counts, perfect squares and divisibility all come from that list.',
      formula: 'n = pᵃ · qᵇ → (a + 1)(b + 1) factors',
    },
    example: {
      prompt: 'How many positive factors does 72 have?',
      lines: ['72 = 2³ · 3²', '(3 + 1)(2 + 1) = 12', '72 has 12 positive factors'],
      note: 'Listing factors by hand is slow and easy to get wrong; the exponents never miss one.',
    },
    trap: {
      title: 'Forgetting the +1',
      body: 'Each exponent can be used from 0 up to its value, so it gives exponent + 1 options. Multiplying the bare exponents (3 × 2) undercounts.',
    },
    guided: [
      num(G1, 'How many positive factors does 180 have?', 18, 'factors',
        '180 = 2² · 3² · 5, so (2 + 1)(2 + 1)(1 + 1) = 18.',
        'Write 180 as a product of prime powers, add 1 to each exponent, and multiply.'),
      num(G2, 'What is the smallest positive integer k such that 24k is a perfect square?', 6, '',
        '24 = 2³ · 3. Multiplying by 2 · 3 = 6 makes it 2⁴ · 3² = 144.',
        'Factor 24 into primes. A perfect square needs every exponent to be even.'),
    ],
  },
  {
    id: 'number-properties-2',
    topic: 'Number properties',
    order: 2,
    title: 'Remainders',
    rule: {
      headline: 'Pick the smallest number that fits, then test.',
      body: 'If n leaves remainder r when divided by d, then n = dq + r. Picking n = r (or r + d) makes remainder questions concrete.',
      formula: 'n = d · q + r, with 0 ≤ r < d',
    },
    example: {
      prompt: 'n leaves remainder 3 when divided by 7. What is the remainder when 2n is divided by 7?',
      lines: ['Pick n = 3', '2n = 6', '6 ÷ 7 leaves remainder 6'],
      note: 'One clean example answers a question that looks abstract.',
    },
    trap: {
      title: 'A remainder bigger than the divisor',
      body: 'If n leaves 5 when divided by 7, then 2n does not leave 10. Reduce: 10 − 7 = 3. A remainder is always smaller than the divisor.',
    },
    guided: [
      num(G1, 'When n is divided by 6, the remainder is 4. What is the remainder when 5n is divided by 6?', 2, '',
        'Pick n = 4: 5n = 20, and 20 = 3 × 6 + 2.',
        'Pick the smallest n that works, multiply, then divide by 6 again.'),
      num(G2, 'When n is divided by 9, the remainder is 7. What is the remainder when n + 15 is divided by 9?', 4, '',
        '7 + 15 = 22, and 22 = 2 × 9 + 4.',
        'Add 15 to the remainder, then take away full 9s until you are below 9.'),
    ],
  },

  // ── Exponents & roots ─────────────────────────────────────────────────
  {
    id: 'exponents-roots-1',
    topic: 'Exponents & roots',
    order: 1,
    title: 'Same base first',
    rule: {
      headline: 'Rewrite everything with the same base.',
      body: 'Once both sides share a base, multiplying adds exponents and a power of a power multiplies them. Then compare exponents.',
      formula: 'aᵐ · aⁿ = aᵐ⁺ⁿ    (aᵐ)ⁿ = aᵐⁿ',
    },
    example: {
      prompt: 'If 2ˣ = 8², what is x?',
      lines: ['8 = 2³', '8² = (2³)² = 2⁶', 'x = 6'],
      note: 'Spotting 4, 8, 16 and 32 as powers of 2 (and 9, 27, 81 as powers of 3) unlocks most exponent questions.',
    },
    trap: {
      title: 'Comparing exponents on different bases',
      body: '2ˣ = 8² does not give x = 2. Exponents can be compared only after the bases match.',
    },
    guided: [
      num(G1, 'If 9⁴ = 3ˣ, what is x?', 8, '',
        '9⁴ = (3²)⁴ = 3⁸, so x = 8.',
        'Rewrite 9 as a power of 3, then multiply the exponents.'),
      num(G2, 'If 2ˣ · 4³ = 2¹¹, what is x?', 5, '',
        '4³ = 2⁶, so x + 6 = 11 and x = 5.',
        'Write 4 as a power of 2, then add the exponents on the left.'),
    ],
  },
  {
    id: 'exponents-roots-2',
    topic: 'Exponents & roots',
    order: 2,
    title: 'Adding powers',
    rule: {
      headline: 'You cannot add powers. Factor out the smallest.',
      body: 'The exponent rules work for multiplying, not adding. With a sum or difference of powers, pull out the smallest power as a common factor.',
      formula: 'aⁿ + aⁿ = 2 · aⁿ    aᵐ − aⁿ = aⁿ(aᵐ⁻ⁿ − 1)',
    },
    example: {
      prompt: 'What is 2¹⁰ + 2¹⁰?',
      lines: ['2¹⁰ + 2¹⁰ = 2 · 2¹⁰', '= 2¹¹'],
      note: 'Two copies of a power of 2 bump the exponent by just one.',
    },
    trap: {
      title: 'aᵐ + aⁿ is not aᵐ⁺ⁿ',
      body: '2¹⁰ + 2¹⁰ is not 2²⁰. That choice is always there. Factor, then simplify.',
    },
    guided: [
      num(G1, 'If 3⁸ + 3⁸ + 3⁸ = 3ⁿ, what is n?', 9, '',
        'Three copies of 3⁸ is 3 · 3⁸ = 3⁹.',
        'Three copies of the same power is that power times three. Then combine exponents.'),
      num(G2, 'What is (2¹² − 2¹⁰) ÷ 2¹⁰?', 3, '',
        '2¹² − 2¹⁰ = 2¹⁰(2² − 1) = 2¹⁰ · 3, and dividing by 2¹⁰ leaves 3.',
        'Factor 2¹⁰ out of the top first, then cancel.'),
    ],
  },

  // ── Algebra ───────────────────────────────────────────────────────────
  {
    id: 'algebra-1',
    topic: 'Algebra',
    order: 1,
    title: 'Two equations, two unknowns',
    rule: {
      headline: 'Stack the equations and eliminate one variable.',
      body: 'Add or subtract the equations so one variable drops out. Solve for the other, then substitute back only if you need it.',
    },
    example: {
      prompt: 'x + y = 10 and x − y = 4. Find x and y.',
      lines: ['Add: 2x = 14', 'x = 7', 'y = 10 − 7 = 3'],
      note: 'Elimination is usually faster than substitution when coefficients line up.',
    },
    trap: {
      title: 'Solving for more than you need',
      body: 'If the question asks for x + y, adding or subtracting the equations often gives it directly. Check what is asked before solving fully.',
    },
    guided: [
      num(G1, '2x + 3y = 23 and 2x − y = 7. What is y?', 4, '',
        'Subtracting gives 4y = 16, so y = 4.',
        'Subtract the second equation from the first so x drops out.'),
      num(G2, '3a + b = 17 and a + 3b = 19. What is a + b?', 9, '',
        'Adding gives 4a + 4b = 36, so a + b = 9. No need for a or b alone.',
        'You do not need a and b separately. Add the equations and look at what you get.'),
    ],
  },
  {
    id: 'algebra-2',
    topic: 'Algebra',
    order: 2,
    title: 'Never divide by a variable',
    rule: {
      headline: 'Never divide by a variable. Factor instead.',
      body: 'Move everything to one side and factor. Each factor equal to zero gives a solution, and none of them get lost.',
      formula: 'ab = 0 → a = 0 or b = 0',
    },
    example: {
      prompt: 'Solve x² = 5x.',
      lines: ['x² − 5x = 0', 'x(x − 5) = 0', 'x = 0 or x = 5'],
      note: 'Dividing both sides by x would have thrown away x = 0.',
    },
    trap: {
      title: 'Losing the zero root',
      body: 'Dividing by x assumes x ≠ 0. On data sufficiency that lost root turns a “not sufficient” into a wrong “sufficient”.',
    },
    guided: [
      num(G1, 'x² = 7x and x ≠ 7. What is x?', 0, '',
        'x² − 7x = x(x − 7) = 0. Since x ≠ 7, x = 0.',
        'Move everything to one side and factor. Then use the condition to rule one root out.'),
      num(G2, 'x² − 2x − 15 = 0. What is the sum of all possible values of x?', 2, '',
        '(x − 5)(x + 3) = 0, so x = 5 or x = −3. The sum is 2.',
        'Factor into two brackets, find both roots, and add them.'),
    ],
  },

  // ── Inequalities & absolute value ─────────────────────────────────────
  {
    id: 'inequalities-absolute-value-1',
    topic: 'Inequalities & absolute value',
    order: 1,
    title: 'Flip on a negative',
    rule: {
      headline: 'Multiply or divide by a negative: flip the sign.',
      body: 'Solve an inequality like an equation, with one extra rule. Any time you multiply or divide both sides by a negative number, reverse the inequality.',
    },
    example: {
      prompt: 'Solve −3x + 5 > 17.',
      lines: ['−3x > 12', 'Divide by −3 and flip', 'x < −4'],
      note: 'Plug in x = −5 to check: 15 + 5 = 20 > 17. It works.',
    },
    trap: {
      title: 'Forgetting the flip',
      body: 'Without the flip you get x > −4, the exact opposite set. Test one value from your answer in the original inequality.',
    },
    guided: [
      num(G1, 'If −2x + 7 ≥ 1, what is the greatest possible value of x?', 3, '',
        '−2x ≥ −6, then dividing by −2 flips it: x ≤ 3. The greatest value is 3.',
        'Subtract 7, then divide by −2 and remember what that does to the sign.'),
      num(G2, 'If 5 − 3x < −10, what is the least integer value of x?', 6, '',
        '−3x < −15, so x > 5. The endpoint is not allowed, so the least integer is 6.',
        'Isolate the x term, divide by −3, flip the sign, then check whether the endpoint itself is allowed.'),
    ],
  },
  {
    id: 'inequalities-absolute-value-2',
    topic: 'Inequalities & absolute value',
    order: 2,
    title: 'Absolute value: two cases',
    rule: {
      headline: 'Absolute value means two cases. Solve both.',
      body: '|x − a| is the distance from x to a. For |x − a| = b, solve x − a = b and x − a = −b.',
      formula: '|x − a| < b ⇔ a − b < x < a + b',
    },
    example: {
      prompt: 'Solve |x − 3| = 5.',
      lines: ['x − 3 = 5 → x = 8', 'x − 3 = −5 → x = −2', 'Two solutions: 8 and −2'],
      note: 'On a number line: both points sit 5 away from 3.',
    },
    trap: {
      title: 'Dropping the negative case',
      body: 'Most wrong answers keep only x = 8. Questions about the sum or product of solutions are built to punish that.',
    },
    guided: [
      num(G1, 'What is the sum of all solutions of |2x + 1| = 9?', -1, '',
        '2x + 1 = 9 gives x = 4; 2x + 1 = −9 gives x = −5. Sum = −1.',
        'Split into two equations, one equal to 9 and one equal to −9. Solve each, then add.'),
      num(G2, 'How many integers x satisfy |x − 4| < 3?', 5, 'integers',
        '−3 < x − 4 < 3, so 1 < x < 7: the integers 2, 3, 4, 5, 6.',
        'Rewrite as −3 < x − 4 < 3, then count the integers strictly inside.'),
    ],
  },

  // ── Statistics ────────────────────────────────────────────────────────
  {
    id: 'statistics-1',
    topic: 'Statistics',
    order: 1,
    title: 'Think in sums',
    rule: {
      headline: 'Work with the sum, not the average.',
      body: 'Turn every average into a total right away. Adding, removing or replacing values is easy with totals and messy with averages.',
      formula: 'Sum = Average × Count',
    },
    example: {
      prompt: 'The average of 4 tests is 80. What score on a 5th test makes the average 84?',
      lines: ['Now: 4 × 80 = 320', 'Needed: 5 × 84 = 420', '5th test = 420 − 320 = 100'],
      note: 'Two multiplications and a subtraction replace any guess-and-check.',
    },
    trap: {
      title: 'Adjusting the average directly',
      body: 'Raising an average by 4 points needs more than 4 extra points: every test, old and new, must rise by 4. The sum method counts all of them.',
    },
    guided: [
      num(G1, 'The average of 6 numbers is 15. One number is removed and the average of the rest is 14. What number was removed?', 20, '',
        '6 × 15 = 90 and 5 × 14 = 70, so the removed number is 20.',
        'Turn both averages into sums, then subtract.'),
      num(G2, 'The average of 4 numbers is 10. The number 25 is added to the list. What is the new average?', 13, '',
        '4 × 10 = 40, plus 25 is 65, and 65 ÷ 5 = 13.',
        'Get the sum first, add the new number, then divide by the new count.'),
    ],
  },
  {
    id: 'statistics-2',
    topic: 'Statistics',
    order: 2,
    title: 'Weighted averages',
    rule: {
      headline: 'Bigger groups pull the average toward them.',
      body: 'To combine groups, add their totals and divide by everyone. The result always lands between the group averages, closer to the larger group.',
      formula: 'Combined = (n₁a₁ + n₂a₂) ÷ (n₁ + n₂)',
    },
    example: {
      prompt: '10 students average 60 and 30 students average 80. What is the overall average?',
      lines: ['10 × 60 + 30 × 80 = 600 + 2400 = 3000', '3000 ÷ 40 = 75'],
      note: 'The 30 students outweigh the 10, so the result sits nearer 80.',
    },
    trap: {
      title: 'Averaging the averages',
      body: '(60 + 80) ÷ 2 = 70 is right only for equal-size groups. When sizes differ, that tempting midpoint is the trap answer.',
    },
    guided: [
      num(G1, 'A class of 20 averages 70 points and a class of 30 averages 80 points. What is the combined average?', 76, 'points',
        '20 × 70 + 30 × 80 = 1400 + 2400 = 3800, and 3800 ÷ 50 = 76.',
        'Find each class’s total, add them, and divide by all the students.'),
      num(G2, 'A trader buys 3 kg of tea at $4 per kg and 1 kg at $8 per kg. What is the average price per kg, in dollars?', 5, '$',
        '3 × 4 + 1 × 8 = 20 dollars for 4 kg, so $5 per kg.',
        'Weight each price by its kilograms. The simple average of the two prices is the trap.'),
    ],
  },

  // ── Counting & probability ────────────────────────────────────────────
  {
    id: 'counting-probability-1',
    topic: 'Counting & probability',
    order: 1,
    title: 'Choices multiply',
    rule: {
      headline: 'Independent choices multiply.',
      body: 'Draw one slot per decision and write how many options each slot has. Multiply the slots.',
      formula: 'Ways = n₁ × n₂ × … × nₖ',
      note: 'Arranging n different items in a row: n! = n × (n − 1) × … × 1.',
    },
    example: {
      prompt: 'An outfit is 1 of 3 shirts, 1 of 4 pants and 1 of 2 pairs of shoes. How many outfits?',
      lines: ['Slots: shirt, pants, shoes', '3 × 4 × 2 = 24 outfits'],
      note: 'Slots make it obvious when an option is used up and the next slot shrinks.',
    },
    trap: {
      title: 'Adding instead of multiplying',
      body: '3 + 4 + 2 = 9 counts items, not outfits. Use “and” → multiply, “or” → add.',
    },
    guided: [
      num(G1, 'A code is 2 letters, each from {A, B, C}, followed by 3 digits, each from 0 to 9. Repeats are allowed. How many codes are possible?', 9000, 'codes',
        '3 × 3 × 10 × 10 × 10 = 9 × 1,000 = 9,000.',
        'Count the options for each of the five positions and multiply them all.'),
      num(G2, 'In how many ways can 5 people stand in a line?', 120, 'ways',
        '5 × 4 × 3 × 2 × 1 = 120.',
        'Fill the spots one at a time: how many choices for the first, then the second, and so on?'),
    ],
  },
  {
    id: 'counting-probability-2',
    topic: 'Counting & probability',
    order: 2,
    title: '“At least one”',
    rule: {
      headline: '“At least one” means one minus none.',
      body: 'Counting every way to get at least one is slow. Find the probability of none, then subtract from 1.',
      formula: 'P(at least one) = 1 − P(none)',
    },
    example: {
      prompt: 'A coin is flipped 3 times. What is the probability of at least one head?',
      lines: ['P(no heads) = (1/2)³ = 1/8', 'P(at least one) = 1 − 1/8 = 7/8'],
      note: 'One case to compute instead of seven.',
    },
    trap: {
      title: 'Adding the single-event chances',
      body: '1/2 + 1/2 + 1/2 is more than 1, which no probability can be. Events overlap, so use the complement.',
    },
    guided: [
      num(G1, 'Two independent alarms each fail with probability 0.1. What is the probability that at least one works?', 0.99, '',
        'Both fail with probability 0.1 × 0.1 = 0.01, so at least one works with probability 0.99.',
        'Find the chance that both fail, then subtract it from 1.'),
      num(G2, 'A bag has 3 red and 2 blue balls. Two are drawn without replacement. What is the probability that at least one is blue?', 0.7, '',
        'Both red: 3/5 × 2/4 = 0.3. At least one blue: 1 − 0.3 = 0.7.',
        'Find the chance both are red, then subtract from 1. The bag shrinks after the first draw.'),
    ],
  },

  // ── Data sufficiency ──────────────────────────────────────────────────
  {
    id: 'data-sufficiency-1',
    topic: 'Data sufficiency',
    order: 1,
    title: 'One statement at a time',
    rule: {
      headline: 'Sufficient means exactly one answer. Don’t solve it.',
      body: 'Test (1) alone, then (2) alone, then together only if both fail. You only need to know whether a single answer exists.',
      note: 'For a yes/no question, “always yes” and “always no” are both sufficient.',
    },
    example: {
      prompt: 'What is x? (1) 2x + 3 = 11. (2) x² = 16.',
      lines: ['(1): x = 4, one value → sufficient', '(2): x = 4 or −4 → not sufficient', 'Answer: (1) alone'],
      note: 'You never needed the number itself, just whether it was unique.',
    },
    trap: {
      title: 'Calculating to the end',
      body: 'Once you see a statement pins down one value, stop. Finishing the arithmetic costs time that DS never rewards.',
    },
    guided: [
      choice(G1, 'What is the value of the integer n? (1) n² = 25. (2) n > 0.', DS_CHOICES, C,
        '(1) allows 5 or −5. (2) allows any positive integer. Together only n = 5 works.',
        'Test each statement alone: can n still take more than one value? Only then combine.'),
      choice(G2, 'Is x > 5? (1) x > 7. (2) x < 9.', DS_CHOICES, A,
        '(1) always answers yes. (2) allows 6 (yes) or 3 (no), so it is not enough.',
        'For a yes/no question, a statement is enough if it always gives the same answer. Try two values for each.'),
    ],
  },
  {
    id: 'data-sufficiency-2',
    topic: 'Data sufficiency',
    order: 2,
    title: 'Keep the statements apart',
    rule: {
      headline: 'Judge statement (2) as if (1) never existed.',
      body: 'After testing (1), clear it from your mind. Information from one statement may be used only in the “together” step.',
    },
    example: {
      prompt: 'Is n > 0? (1) n² = 4. (2) n³ = 8.',
      lines: ['(1): n = 2 or −2 → not sufficient', '(2) alone: n = 2 → sufficient', 'Answer: (2) alone'],
      note: 'Reading (2) with (1) still in mind adds nothing here, but often it makes a weak statement look strong.',
    },
    trap: {
      title: 'Leaking (1) into (2)',
      body: 'After reading (1), it is easy to treat its facts as known while judging (2). That turns “together” answers into false “(2) alone” answers.',
    },
    guided: [
      choice(G1, 'Is y odd? (1) y > 10. (2) y = 4k for some integer k.', DS_CHOICES, B,
        '(1) allows 11 or 12. (2) makes y a multiple of 4, so the answer is always no, which is sufficient.',
        'A firm “no” counts. Ask whether each statement, on its own, always gives the same answer.'),
      choice(G2, 'What is x? (1) x(x − 2) = 0. (2) x > 1.', DS_CHOICES, C,
        '(1) gives 0 or 2. (2) allows many values. Together, x = 2.',
        'Judge (2) as if (1) were never written. Combine only if each fails alone.'),
    ],
  },

  // ── Tables ────────────────────────────────────────────────────────────
  {
    id: 'tables-1',
    topic: 'Tables',
    order: 1,
    title: 'Sort before you read',
    rule: {
      headline: 'Find the right column, then sort it.',
      body: 'Most table questions use one column. Sort it (on screen or in your head) before looking for a median, rank or count.',
      note: 'With an even number of rows, the median is the average of the middle two.',
    },
    example: {
      prompt: 'Sales ($K): North 120, South 95, East 140, West 85, Central 110. What is the median?',
      lines: ['Sorted: 85, 95, 110, 120, 140', 'Middle value = 110', 'Median = $110K'],
      note: 'Sorting takes seconds and prevents picking the middle row of an unsorted table.',
    },
    trap: {
      title: 'Taking the middle row as listed',
      body: 'The middle row of the table is South (95), not the median. Order the values first.',
    },
    guided: [
      num(G1, 'Sales ($K): North 120, South 95, East 140, West 85. What is the median, in $K?', 107.5, '$K',
        'Sorted: 85, 95, 120, 140. The median is (95 + 120) ÷ 2 = 107.5.',
        'Sort the four values, then average the middle two.'),
      num(G2, 'Units sold: Mon 30, Tue 45, Wed 25, Thu 50, Fri 40. On how many days were units above the daily average?', 3, 'days',
        'The total is 190, so the average is 38. Tue, Thu and Fri beat it.',
        'Find the mean first, then count the days that beat it.'),
    ],
  },
  {
    id: 'tables-2',
    topic: 'Tables',
    order: 2,
    title: 'Amount or percent?',
    rule: {
      headline: 'Check whether it asks for amount or percent.',
      body: 'The largest increase and the largest percent increase are often different rows. Underline which one the question wants.',
      formula: '% increase = change ÷ starting value',
    },
    example: {
      prompt: 'Store A: 200 → 240. Store B: 50 → 75. Which grew more?',
      lines: ['A: +40, or +20%', 'B: +25, or +50%', 'Larger amount: A. Larger percent: B.'],
      note: 'Both answers are defensible, so the wording decides.',
    },
    trap: {
      title: 'Turning percents into counts without the base',
      body: 'Percents from different rows have different bases. Convert each to a count with its own base before adding or comparing.',
    },
    guided: [
      num(G1, 'Revenue ($M), 2022 → 2023: Alpha 80 → 92, Beta 40 → 50, Gamma 120 → 132. What is the largest percent increase among the three?', 25, '%',
        'Alpha +15%, Beta +25%, Gamma +10%. Beta has the smallest dollar gain but the biggest percent.',
        'Divide each change by its 2022 value. The biggest dollar gain is not what is asked.'),
      num(G2, 'Staff by office: Paris 40 (25% remote), Oslo 60 (10% remote), Rome 100 (12% remote). How many remote staff are there in total?', 28, 'people',
        '10 + 6 + 12 = 28 remote staff.',
        'Turn each percent into a head count for its own office, then add. Do not average the percents.'),
    ],
  },

  // ── Assumption ────────────────────────────────────────────────────────
  {
    id: 'assumption-1',
    topic: 'Assumption',
    order: 1,
    title: 'Find the gap',
    rule: {
      headline: 'The assumption bridges evidence and conclusion.',
      body: 'Split the argument into evidence and conclusion. Spot the new idea in the conclusion; the assumption links it to the evidence.',
    },
    example: {
      prompt: 'Sales of our app rose after we added dark mode, so dark mode caused the rise.',
      lines: ['Evidence: sales rose after dark mode', 'Conclusion: dark mode caused it', 'Gap: nothing else caused the rise'],
      note: 'Before and after is not cause and effect. The assumption is what makes it so.',
    },
    trap: {
      title: 'Picking a choice that repeats the evidence',
      body: 'A choice that restates a premise feels safe but adds nothing. The right answer always mentions the new idea in the conclusion.',
    },
    guided: [
      choice(G1, 'Maria trains every day, so she will win the race. Which is assumed?', [
        'Maria enjoys running.',
        'Daily training is enough to win the race.',
        'Maria trained last year as well.',
        'The race is longer than 10 kilometers.',
      ], 1,
        'The evidence is about training; the conclusion is about winning. This choice links the two.',
        'Name the new idea in the conclusion, then pick the choice that connects it to the evidence about training.'),
      choice(G2, 'This plant needs little water, so it will thrive in the desert. Which is assumed?', [
        'Low water is the only challenge the desert poses to this plant.',
        'Desert plants are usually green.',
        'The plant was first found in a rainforest.',
        'Most gardeners overwater their plants.',
      ], 0,
        'If heat or poor soil also kills the plant, needing little water is not enough to thrive.',
        'Ask what else would have to be true for “thrive” to follow from “needs little water”.'),
    ],
  },
  {
    id: 'assumption-2',
    topic: 'Assumption',
    order: 2,
    title: 'The negation test',
    rule: {
      headline: 'Negate it. If the argument collapses, it is required.',
      body: 'Flip a choice into its opposite. If the conclusion no longer follows, the choice is a necessary assumption.',
    },
    example: {
      prompt: 'Our new filter removes lead, so water from this tap is now safe.',
      lines: ['Choice: lead was the only hazard in the water', 'Negated: there were other hazards too', 'Then “safe” no longer follows → required'],
      note: 'The test turns a judgment call into a yes/no check.',
    },
    trap: {
      title: 'Choosing the strongest-sounding choice',
      body: 'A necessary assumption is often modest. Extreme words such as “all”, “never” or “most” usually say more than the argument needs.',
    },
    guided: [
      choice(G1, 'The museum will draw more visitors next year because it is opening a new dinosaur hall. Which is required?', [
        'Every visitor loves dinosaurs.',
        'The museum is the largest in the city.',
        'The dinosaur hall will not replace an equally popular exhibit.',
        'Ticket prices will fall next year.',
      ], 2,
        'Negated, the hall replaces an equally popular exhibit, and the visitor gain disappears.',
        'Negate each choice. Pick the one whose opposite breaks the link between a new hall and more visitors.'),
      choice(G2, 'Moving the meeting online will save the firm money, since no one will need to travel. Which is required?', [
        'Online meetings are always shorter.',
        'The online setup does not cost more than the travel it replaces.',
        'Most employees prefer to work from home.',
      ], 1,
        'Negate it: if the setup costs more than the travel, there is no saving.',
        'Negate each choice. Extreme or off-topic ones do not break the argument.'),
    ],
  },

  // ── Strengthen ────────────────────────────────────────────────────────
  {
    id: 'strengthen-1',
    topic: 'Strengthen',
    order: 1,
    title: 'Support the gap',
    rule: {
      headline: 'Strengthen the link, not the facts.',
      body: 'Find the gap between evidence and conclusion. The right answer makes that gap smaller; it does not need to prove the conclusion.',
    },
    example: {
      prompt: 'Students who eat breakfast score higher on tests, so breakfast improves scores.',
      lines: ['Gap: maybe better students also tend to eat breakfast', 'Strengthener: students scored higher on days they ate breakfast', 'Same students, different days → link is stronger'],
      note: 'A good strengthener closes an escape route the argument left open.',
    },
    trap: {
      title: 'Choosing a choice that is merely on topic',
      body: 'A fact about breakfast or about tests is not enough. It must make breakfast causing higher scores more likely.',
    },
    guided: [
      choice(G1, 'A city added bike lanes and bike accidents fell, so the lanes made cycling safer. Which most strengthens this?', [
        'Bike sales in the city rose last year.',
        'The number of cyclists did not fall after the lanes were added.',
        'Some drivers dislike the new lanes.',
        'Bike lanes are common in European cities.',
      ], 1,
        'If cyclist numbers held steady, fewer accidents cannot be explained by fewer riders.',
        'Look for the other explanation of fewer accidents, then pick the choice that rules it out.'),
      choice(G2, 'A fertilizer was used on Field A but not Field B, and Field A had a bigger harvest. So the fertilizer increased yield. Which most strengthens this?', [
        'The fertilizer is expensive.',
        'Field A is larger than Field B.',
        'Both fields got the same rain, sun and seed.',
        'Farmers in the region often use fertilizer.',
      ], 2,
        'With other conditions equal, the fertilizer is left as the likeliest cause.',
        'Ask what other difference between the fields could explain the harvest, and pick the choice that removes it.'),
    ],
  },
  {
    id: 'strengthen-2',
    topic: 'Strengthen',
    order: 2,
    title: 'Rule out other causes',
    rule: {
      headline: 'For a cause, eliminate the alternative explanations.',
      body: 'Causal conclusions are strengthened by showing other causes did not act, or that the effect appears whenever the cause does.',
    },
    example: {
      prompt: 'After a new manager arrived, the team’s output rose 20%. So the manager boosted output.',
      lines: ['Alternative: the team also got new software', 'Strengthener: no tools or staff changed that year', 'The manager is left as the likely cause'],
      note: 'Each alternative you remove makes the stated cause more likely.',
    },
    trap: {
      title: 'Choices that compare to the wrong group',
      body: 'A fact about other teams or other years only helps if it removes an alternative cause for this team. Check that the comparison matters.',
    },
    guided: [
      choice(G1, 'Since the café started playing jazz, its sales have risen. The owner concludes the music raised sales. Which most strengthens this?', [
        'Jazz is the owner’s favorite music.',
        'Sales at nearby cafés without jazz stayed flat over the same period.',
        'The café also sells tea.',
      ], 1,
        'Flat sales nearby rule out a general rise in local demand.',
        'Find a choice that removes another reason sales might have risen at the same time.'),
      choice(G2, 'Patients given a new drug recovered faster than patients who were not. So the drug speeds recovery. Which most strengthens this?', [
        'The drug is easy to take.',
        'Patients were randomly assigned to receive the drug or not.',
        'Some patients disliked the drug’s taste.',
        'The drug was developed over ten years.',
      ], 1,
        'Random assignment makes the two groups alike, so the drug is the only systematic difference.',
        'Ask whether the two groups differed in some other way, and pick the choice that rules that out.'),
    ],
  },

  // ── Weaken ────────────────────────────────────────────────────────────
  {
    id: 'weaken-1',
    topic: 'Weaken',
    order: 1,
    title: 'Attack the link',
    rule: {
      headline: 'Accept the facts. Attack the link to the conclusion.',
      body: 'The premises are true by rule. A weakener shows that the conclusion does not follow from them as well as it seems.',
    },
    example: {
      prompt: 'Online reviews of Hotel X are mostly five stars, so guests are very satisfied.',
      lines: ['Link: reviews reflect all guests', 'Weakener: the hotel pays guests for five-star reviews', 'Reviews no longer show satisfaction'],
      note: 'The facts still stand; the inference from them breaks.',
    },
    trap: {
      title: 'Denying a premise',
      body: 'A choice claiming the reviews are not mostly five stars contradicts a given fact. GMAT never asks you to do that.',
    },
    guided: [
      choice(G1, 'Town A has more doctors per person than Town B, so Town A’s residents are healthier. Which most weakens this?', [
        'Town A has a larger park.',
        'Many doctors moved to Town A because its residents are often ill.',
        'Town B has a lower cost of living.',
        'Doctors in both towns trained at the same school.',
      ], 1,
        'It reverses the direction: illness attracts doctors, so more doctors may mean less health.',
        'Accept the doctor numbers. Look for a reason the link to health could run another way.'),
      choice(G2, 'Our ad ran in March and March sales hit a record, so the ad worked. Which most weakens this?', [
        'The ad won a design award.',
        'March sales hit a record every year because of a holiday.',
        'The ad was shown on two channels.',
      ], 1,
        'If March always sets records, the ad is not needed to explain this one.',
        'Look for something other than the ad that could explain the record.'),
    ],
  },
  {
    id: 'weaken-2',
    topic: 'Weaken',
    order: 2,
    title: 'Another cause',
    rule: {
      headline: 'For a cause, offer another explanation.',
      body: 'When an argument says X caused Y, the strongest weakener shows something else could have caused Y.',
    },
    example: {
      prompt: 'Since the school switched to tablets, test scores rose. So tablets improved learning.',
      lines: ['Cause claimed: tablets', 'Alternative: the school also hired more teachers', 'Scores could rise without tablets helping'],
      note: 'One plausible alternative is enough to weaken; it need not disprove.',
    },
    trap: {
      title: 'Choices that only sound negative',
      body: 'A choice saying tablets are expensive or that some students dislike them is negative but leaves the causal claim intact.',
    },
    guided: [
      choice(G1, 'Crime fell after the city installed more street lights, so the lights reduced crime. Which most weakens this?', [
        'The lights use a lot of electricity.',
        'In the same period, the city doubled its police patrols.',
        'Some residents find the lights too bright.',
        'Street lights are cheap to maintain.',
      ], 1,
        'More patrols offer another cause for the fall in crime.',
        'Look for something else that changed at the same time and could explain the drop.'),
      choice(G2, 'People who drink green tea live longer, so green tea extends life. Which most weakens this?', [
        'Green tea is popular in many countries.',
        'Green tea has a mild taste.',
        'Green tea drinkers also tend to exercise more and smoke less.',
      ], 2,
        'Healthier habits could explain the longer lives, not the tea.',
        'Ask what else green tea drinkers might have in common that affects lifespan.'),
    ],
  },

  // ── Inference ─────────────────────────────────────────────────────────
  {
    id: 'inference-1',
    topic: 'Inference',
    order: 1,
    title: 'Must be true',
    rule: {
      headline: 'Pick only what the text forces to be true.',
      body: 'An inference is not a guess about what is likely. Combine the statements and choose what cannot be false if they are true.',
    },
    example: {
      prompt: 'All of the firm’s managers have MBAs. Some of its engineers are managers.',
      lines: ['Some engineers are managers', 'Every manager has an MBA', 'So some engineers have MBAs'],
      note: 'Linking two statements is usually how the right inference appears.',
    },
    trap: {
      title: 'Plausible but unsupported',
      body: 'A choice like “Most engineers have MBAs” sounds reasonable but goes beyond the text. If you could imagine it false, eliminate it.',
    },
    guided: [
      choice(G1, 'Every café on Main Street sells coffee. Bean Box is on Main Street. Which must be true?', [
        'Bean Box sells tea.',
        'Bean Box sells coffee.',
        'Bean Box is the most popular café on Main Street.',
        'Every café that sells coffee is on Main Street.',
      ], 1,
        'Bean Box is a Main Street café, and every one of those sells coffee.',
        'Combine the two statements directly. Eliminate anything the text does not mention or that reverses the rule.'),
      choice(G2, 'In a survey, 60% of members said they read the newsletter. The club has 200 members, and all of them answered. Which must be true?', [
        'Most members like the newsletter.',
        'At least 100 members said they read the newsletter.',
        'The newsletter is the club’s main way of sharing news.',
      ], 1,
        '60% of 200 is 120 members, which is at least 100.',
        'Reading is not the same as liking. Pick only the claim the numbers guarantee.'),
    ],
  },
  {
    id: 'inference-2',
    topic: 'Inference',
    order: 2,
    title: 'Mild beats extreme',
    rule: {
      headline: 'Prefer soft wording. Extreme words need strong support.',
      body: 'Words like “some”, “can” and “not all” are easy to prove. Words like “all”, “always” and “only” rarely follow from a short passage.',
    },
    example: {
      prompt: 'Most of the town’s restaurants closed early during the storm.',
      lines: ['“Every restaurant closed” → too strong', '“No restaurant stayed open” → too strong', '“At least one restaurant closed early” → must be true'],
      note: 'The softest choice that still says something is often the answer.',
    },
    trap: {
      title: 'Choosing the most interesting choice',
      body: 'The choice with a bold claim feels insightful. On inference questions, bold usually means unsupported.',
    },
    guided: [
      choice(G1, 'Some of the novels on the shortlist were written by first-time authors. Which must be true?', [
        'Most shortlisted novels were written by first-time authors.',
        'The winner will be a first-time author.',
        'At least one shortlisted novel was written by a first-time author.',
        'First-time authors write better novels.',
      ], 2,
        '“Some” guarantees at least one. Nothing more is promised.',
        'Match the strength of the text. “Some” supports very little, so choose the mildest claim.'),
      choice(G2, 'The store sold out of umbrellas on three of the five rainy days last month. Which must be true?', [
        'The store always sells out of umbrellas when it rains.',
        'On at least one rainy day last month, the store did not sell out of umbrellas.',
        'Umbrellas are the store’s best-selling item.',
      ], 1,
        'Three of five means two rainy days without a sellout.',
        'Eliminate words like “always” and “best”. Check what the numbers force.'),
    ],
  },

  // ── Evaluate ──────────────────────────────────────────────────────────
  {
    id: 'evaluate-1',
    topic: 'Evaluate',
    order: 1,
    title: 'Ask a question that matters',
    rule: {
      headline: 'Pick the question whose answer would change everything.',
      body: 'Answer each choice both ways. If “yes” strengthens and “no” weakens the argument, it is the one to evaluate.',
    },
    example: {
      prompt: 'Our new website design increased sign-ups, since sign-ups rose 30% after launch.',
      lines: ['Ask: did anything else change at launch?', 'Yes (a big sale) → argument weakens', 'No → argument strengthens'],
      note: 'Both answers move the argument, so the question is useful.',
    },
    trap: {
      title: 'A question with only one useful answer',
      body: 'If one answer helps and the other does nothing, the question is weak. Test both directions before choosing.',
    },
    guided: [
      choice(G1, 'A gym says its new class reduces stress, since members who took it reported lower stress afterward. Which is most useful to know?', [
        'How much the class costs.',
        'Whether members who skipped the class also reported lower stress over the same time.',
        'What music is played during the class.',
        'How many instructors teach the class.',
      ], 1,
        'If non-takers also improved, the class is not the cause; if not, the class looks responsible.',
        'Answer each choice yes and no. Pick the one where the two answers push the argument in opposite directions.'),
      choice(G2, 'A city plans to cut traffic by raising parking fees downtown. Which is most useful to evaluate the plan?', [
        'Whether drivers have convenient alternatives to driving downtown.',
        'Whether parking fees are higher in other cities.',
        'Whether the downtown area has many restaurants.',
      ], 0,
        'If drivers have alternatives, higher fees can cut traffic; if not, they may just pay more.',
        'Find the question whose answer decides whether higher fees actually change how people travel.'),
    ],
  },
  {
    id: 'evaluate-2',
    topic: 'Evaluate',
    order: 2,
    title: 'Relevant, not just related',
    rule: {
      headline: 'Related to the topic is not relevant.',
      body: 'Many choices ask interesting questions about the subject. Only one bears on whether the evidence supports this specific conclusion.',
    },
    example: {
      prompt: 'A company says remote work raised productivity, citing output per employee since going remote.',
      lines: ['Related: do employees prefer remote work?', 'Relevant: was output measured the same way before and after?', 'Only the second can change the conclusion'],
      note: 'Preference is about the topic; measurement is about the reasoning.',
    },
    trap: {
      title: 'The “nice to know” question',
      body: 'A choice may sound like good research yet leave the argument where it was. Ask: would any answer change my view of the conclusion?',
    },
    guided: [
      choice(G1, 'A school claims a reading app raised scores, since app users scored higher than non-users. Which is most useful to know?', [
        'Whether the app has good reviews.',
        'Whether app users were already stronger readers before using it.',
        'Whether the app is available on phones.',
        'Whether teachers like the app.',
      ], 1,
        'If users were already stronger, the gap says nothing about the app; if not, the app looks effective.',
        'Skip choices that are merely about the app. Pick the one whose answer changes whether the score gap proves anything.'),
      choice(G2, 'A farm says switching to drip irrigation will save water, since drip systems deliver water directly to roots. Which is most useful to know?', [
        'Whether drip systems are made locally.',
        'Whether the farm’s crops need more water per plant under drip irrigation.',
        'Whether neighboring farms grow the same crops.',
      ], 1,
        'If crops need more water per plant under drip, the savings may vanish; if not, the plan holds.',
        'Ask which answer could flip the conclusion about water saved. Ignore background details.'),
    ],
  },

  // ── Paradox ───────────────────────────────────────────────────────────
  {
    id: 'paradox-1',
    topic: 'Paradox',
    order: 1,
    title: 'Explain both facts',
    rule: {
      headline: 'Keep both facts true. Explain how both happen.',
      body: 'A paradox gives two facts that seem to clash. The answer shows a way both can be true at once.',
    },
    example: {
      prompt: 'A store cut prices by 20%, yet its total revenue rose.',
      lines: ['Fact 1: lower prices', 'Fact 2: higher revenue', 'Explanation: the cut brought in far more customers'],
      note: 'The right answer adds a missing piece; it never disputes a fact.',
    },
    trap: {
      title: 'Explaining only one side',
      body: 'A choice saying prices were too high before explains the cut, not the rise in revenue. It must resolve the tension between both facts.',
    },
    guided: [
      choice(G1, 'A town built a new highway to reduce traffic, yet traffic jams became more common. Which best explains this?', [
        'The highway was expensive to build.',
        'The new highway encouraged many more people to drive.',
        'Some residents opposed the highway.',
        'The highway has four lanes.',
      ], 1,
        'More drivers can outpace the added road space, so both facts hold.',
        'Keep both facts. Look for a choice that shows how more road could lead to more jams.'),
      choice(G2, 'Hospital A has a higher death rate than Hospital B, yet experts say A gives better care. Which best explains this?', [
        'Hospital A treats far more critically ill patients.',
        'Hospital B is newer.',
        'Hospital A has a larger parking lot.',
      ], 0,
        'Sicker patients raise the death rate even when care is better.',
        'Look for a difference between the hospitals’ patients that could explain the numbers without bad care.'),
    ],
  },
  {
    id: 'paradox-2',
    topic: 'Paradox',
    order: 2,
    title: 'Find the hidden difference',
    rule: {
      headline: 'Look for a difference between the two groups.',
      body: 'Most paradoxes compare two groups, places or times. The answer reveals a difference the argument did not mention.',
    },
    example: {
      prompt: 'Region X has more lightning strikes than Region Y but fewer wildfires.',
      lines: ['Groups: X and Y', 'Hidden difference: X gets far more rain', 'Wet ground stops strikes becoming fires'],
      note: 'Once the groups differ in a relevant way, the clash disappears.',
    },
    trap: {
      title: 'Similarities that deepen the puzzle',
      body: 'A choice showing the two groups are alike makes the paradox worse. You need a relevant difference.',
    },
    guided: [
      choice(G1, 'Brand A spends more on advertising than Brand B, yet Brand B sells more. Which best explains this?', [
        'Both brands advertise on television.',
        'Brand B’s product is sold in far more stores.',
        'Brand A was founded earlier.',
        'Both brands have similar prices.',
      ], 1,
        'Wider distribution can outweigh more advertising, so both facts hold.',
        'Two of the choices show the brands are alike. You need a relevant difference.'),
      choice(G2, 'Workers at Plant 1 earn more per hour than those at Plant 2, yet Plant 1’s labor costs per unit are lower. Which best explains this?', [
        'Plant 1 workers produce many more units per hour.',
        'Both plants pay overtime.',
        'Plant 2 is closer to the city.',
      ], 0,
        'Higher output spreads the higher wage over more units.',
        'Cost per unit depends on two things. Find the choice that changes the one the facts leave out.'),
    ],
  },

  // ── Reading Comprehension ─────────────────────────────────────────────
  {
    id: 'reading-comprehension-1',
    topic: 'Reading Comprehension',
    order: 1,
    title: 'Map the passage',
    rule: {
      headline: 'Read for structure: what each paragraph does.',
      body: 'Write a few words per paragraph about its role, not its details. The main idea is the point those roles serve.',
    },
    example: {
      prompt: 'P1 describes a theory of bird migration. P2 gives new data that conflict with it. P3 proposes a revised theory.',
      lines: ['P1: old view', 'P2: evidence against', 'P3: new view', 'Main idea: new data call for a revised theory'],
      note: 'The map answers primary-purpose questions in seconds and tells you where to look for details.',
    },
    trap: {
      title: 'Reading every detail on the first pass',
      body: 'Memorizing figures and names burns time. Questions tell you which detail matters; go back for it then.',
    },
    guided: [
      choice(G1, 'P1 states a common belief that bees prefer blue flowers. P2 reports a study where bees chose flowers by scent, not color. P3 suggests color matters only when scent is absent. What is the primary purpose?', [
        'To describe how bees make honey.',
        'To refine a belief about how bees choose flowers.',
        'To prove that color has no effect on bees.',
        'To list the flowers bees prefer.',
      ], 1,
        'The passage moves from a belief, to evidence against it, to a refined version.',
        'Map the role of each paragraph, then pick the purpose that covers all three without overstating.'),
      choice(G2, 'P1 explains why a city built a subway. P2 describes delays and costs during construction. P3 shows ridership exceeded forecasts. What is the main idea?', [
        'Subways are always worth building.',
        'Despite costly delays, the subway proved more successful than expected.',
        'Construction delays are common in large projects.',
      ], 1,
        'It ties together the plan, the problems and the result.',
        'Choose the statement that covers all three paragraphs. Too broad or too narrow both fail.'),
    ],
  },
  {
    id: 'reading-comprehension-2',
    topic: 'Reading Comprehension',
    order: 2,
    title: 'Go back to the text',
    rule: {
      headline: 'Prove every detail answer with a line.',
      body: 'For detail and inference questions, find the sentence that supports the answer. If you cannot point to it, eliminate the choice.',
    },
    example: {
      prompt: 'Question: according to the passage, why did the early studies fail?',
      lines: ['Use your map: P2 covers the early studies', 'Reread P2: “samples were too small”', 'Choose the answer that matches that line'],
      note: 'Rereading two sentences is faster than debating five choices from memory.',
    },
    trap: {
      title: 'True, but not what was asked',
      body: 'A choice can quote the passage correctly and still answer a different question. Check that it answers this question, not just that it appears in the text.',
    },
    guided: [
      choice(G1, 'Passage: “Glass frogs are nearly transparent. Researchers found they hide most of their red blood cells in the liver while sleeping, which makes them even harder to see.” According to the passage, why are sleeping glass frogs harder to see?', [
        'They sleep under leaves.',
        'They store most of their red blood cells in the liver.',
        'Their skin changes color at night.',
        'They are nearly transparent.',
      ], 1,
        'The passage gives blood cells in the liver as the reason they are even harder to see while sleeping.',
        'Find the sentence about sleeping. One choice is true but explains transparency in general, not the sleep effect.'),
      choice(G2, 'Passage: “The new vaccine reduced infections by half in adults. Trials in children have not yet begun.” Which is supported?', [
        'The vaccine is unsafe for children.',
        'The vaccine’s effect on children is not yet known from trials.',
        'The vaccine works better in children.',
      ], 1,
        'With no child trials, the passage supports only that the effect in children is unknown.',
        'Find the line about children and choose the claim it supports without adding anything.'),
    ],
  },
];
