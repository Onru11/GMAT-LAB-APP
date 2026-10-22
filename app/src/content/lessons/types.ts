// Lesson format. A lesson is five steps: the rule, a worked example, a common
// trap, then two guided questions the learner answers before moving on.

export type Guided =
  | {
      kind: 'number';
      /** Shown above the answer box. */
      label: string;
      prompt: string;
      ans: number;
      /** Shown after the box, e.g. '%' or 'hours'. Empty for none. */
      unit: string;
      /** Feedback when right: why it is right. */
      ok: string;
      /** Hint when wrong: points at the method, never states the answer. */
      bad: string;
    }
  | {
      kind: 'choice';
      label: string;
      prompt: string;
      choices: string[];
      ans: number;
      ok: string;
      bad: string;
    };

export interface Lesson {
  id: string;
  /** Must match a topic name in data.ts TOPICS. */
  topic: string;
  /** Order within the topic, starting at 1. */
  order: number;
  title: string;
  rule: { headline: string; body: string; formula?: string; note?: string };
  example: { prompt: string; lines: string[]; note: string };
  trap: { title: string; body: string };
  guided: [Guided, Guided];
}
