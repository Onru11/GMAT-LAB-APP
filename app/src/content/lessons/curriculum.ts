// Lesson order follows the study path: phase by phase, topic by topic,
// lesson 1 before lesson 2.

import { PHASES } from '../../data';
import { LESSONS } from './lessons';
import type { Lesson } from './types';

const pathOrder = PHASES.flatMap(p => p.topics.map(t => t.name));
const rank = (topic: string) => {
  const i = pathOrder.indexOf(topic);
  return i < 0 ? pathOrder.length : i;
};

export const CURRICULUM: Lesson[] = [...LESSONS].sort((a, b) => rank(a.topic) - rank(b.topic) || a.order - b.order);
export const LESSON_BY_ID: Record<string, Lesson> = Object.fromEntries(LESSONS.map(l => [l.id, l]));
export const lessonsFor = (topic: string) => CURRICULUM.filter(l => l.topic === topic);

/** The first lesson on the path the learner hasn't finished. */
export const nextLesson = (done: string[]): Lesson | undefined => CURRICULUM.find(l => !done.includes(l.id));
