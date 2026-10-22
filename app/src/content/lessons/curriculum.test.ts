import { describe, expect, it } from 'vitest';
import { CURRICULUM, lessonsFor, nextLesson } from './curriculum';

describe('curriculum', () => {
  it('starts with Fractions (the first path topic with lessons) and orders 1 before 2', () => {
    expect(CURRICULUM[0].topic).toBe('Fractions');
    for (const l of CURRICULUM) {
      const own = lessonsFor(l.topic);
      expect(own.map(x => x.order)).toEqual([...own.map(x => x.order)].sort());
    }
  });

  it('moves on as lessons are finished', () => {
    const first = nextLesson([])!;
    const second = nextLesson([first.id])!;
    expect(second.id).not.toBe(first.id);
    expect(nextLesson(CURRICULUM.map(l => l.id))).toBeUndefined();
  });
});
