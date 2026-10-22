// The full question bank: the original set plus every topic file in this folder.
// Each file has its own test that re-derives its answers.

import { CORE_QUESTIONS, type Question } from '../questions';
import { CRITICAL_REASONING } from './critical-reasoning';
import { DATA_INSIGHTS } from './data-insights';
import { QUANT_ALGEBRA } from './quant-algebra';
import { QUANT_ARITHMETIC } from './quant-arithmetic';
import { READING_COMPREHENSION } from './reading-comprehension';

export const QUESTION_LIST: Question[] = [
  ...CORE_QUESTIONS,
  ...QUANT_ARITHMETIC,
  ...QUANT_ALGEBRA,
  ...DATA_INSIGHTS,
  ...CRITICAL_REASONING,
  ...READING_COMPREHENSION,
];
export const QUESTIONS: Record<string, Question> = Object.fromEntries(QUESTION_LIST.map(q => [q.id, q]));
