import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { PERSISTED, clearProgress, dayKey, loadProgress, parseProgress, rollOver, saveProgress } from './persist';
import type { Cleared } from './sync/merge';
import { DECKS, INITIAL_MISTAKES, INITIAL_SCORES, SPRINT, TOPICS, type Deck, type Score } from './data';
import { CURRICULUM, LESSON_BY_ID, nextLesson } from './content/lessons/curriculum';
import { QUESTIONS, QUESTION_LIST } from './content/bank';
import type { Section } from './content/questions';
import { TESTS, crSet, questionTitle, scoreTest, seededShuffle, type AnswerRecord, type TestDef, type TestResult } from './content/select';
import { drillSize, todaysFocus, weakestTopic } from './plan';
import {
  INTERVALS, addDays, adaptiveDrill, cardKey, climb, gradeCard, isDue, nextTestQuestion, pushHistory, reviewMistake,
  type Answer, type CardState, type Ladder, type Mistake,
} from './progress';

export type { Mistake };
export type VisibleMistake = Mistake & { due: boolean };

export type Route =
  | 'welcome' | 'today' | 'learn' | 'lesson' | 'practice' | 'tests' | 'results'
  | 'runner' | 'review' | 'flash' | 'sprint' | 'mistakes' | 'progress';
export type Tab = 'today' | 'learn' | 'practice' | 'review' | 'progress';
export type RunMode = 'practice' | 'mistakes' | 'cr' | 'test' | 'review' | 'extra' | 'testReview' | 'diagnostic' | 'lessonDrill';
export type Origin = 'today' | 'review';
export type Theme = 'light' | 'dark';

export const TAB_OF: Record<Route, Tab> = {
  welcome: 'today', today: 'today', learn: 'learn', lesson: 'learn', practice: 'practice', tests: 'practice',
  results: 'practice', runner: 'practice', review: 'review', flash: 'review', sprint: 'review',
  mistakes: 'review', progress: 'progress',
};
/** Focus screens: no tab bar on mobile, tighter top padding. */
export const FULLSCREEN: Partial<Record<Route, true>> = { welcome: true, lesson: true, runner: true, flash: true, sprint: true };

export interface Run {
  mode: RunMode;
  /** Question ids. */
  list: string[];
  /** Set when mode is 'test'; the list grows one adaptive pick at a time. */
  section?: TestDef['section'];
  /** Planned length when the list is built as you go. */
  length?: number;
  /** Tests: seconds used on the section clock. */
  sectionSec: number;
  /** Tests: bookmarked question ids. */
  flags: string[];
  /** Tests: 'review' is the end-of-section screen where answers can be changed. */
  phase: 'answering' | 'review';
  /** Tests: answer changes used (the exam allows 3). */
  edits: number;
  /** Tests: index of the answer being changed from the review screen. */
  editing: number | null;
  /** Overrides the default title for the mode. */
  title?: string;
  /** Tests started from the daily queue tick off the focus item when finished. */
  fromQueue?: boolean;
  /** testReview: the learner's original choice for each question. */
  presets?: number[];
  answers: AnswerRecord[];
  i: number;
  sel: number | null;
  conf: boolean;
  sec: number;
  reason: string | null;
  alt: boolean;
}

export interface LessonState {
  /** Lesson id from the curriculum. */
  id: string;
  step: number;
  input: string;
  /** Picked choice for multiple-choice guided questions. */
  sel: number | null;
  checked: boolean;
  ok: boolean;
  score: number;
  from: Origin | 'learn';
}

export interface FlashState {
  i: number;
  flipped: boolean;
  mode: 'learn' | 'type';
  input: string;
  checked: boolean;
  ok: boolean;
  done: boolean;
  known: number;
  from: Origin;
  /** Indexes into the deck's cards for this session: the due ones, or all if none are due. */
  cards: number[];
}

export interface SprintAnswer {
  p: string;
  a: number;
  g: string;
  ok: boolean;
}

export interface SprintState {
  i: number;
  input: string;
  sec: number;
  flash: 'ok' | 'bad' | null;
  ans: SprintAnswer[];
  done: boolean;
  from: Origin;
  msg: string;
}

export interface ScoreForm {
  date: string;
  total: string;
  q: string;
  v: string;
  di: string;
}

export interface AppState {
  theme: Theme;
  target: number;
  /** Booked exam day (YYYY-MM-DD), if any. */
  examDate: string | null;
  /** Minutes a day the learner plans to study. */
  dailyMin: number;
  /** Finished first-run setup. */
  onboarded: boolean;
  route: Route;
  tab: Tab;
  /** The day `queue` belongs to (YYYY-MM-DD). */
  day: string;
  /** Finished lesson ids. */
  lessonsDone: string[];
  /** Last day all five queue items were finished; keeps the streak alive. */
  lastFullDay: string | null;
  queue: boolean[];
  streak: number;
  les: LessonState;
  run: Run | null;
  inRow: number;
  deck: number;
  fl: FlashState;
  sp: SprintState;
  /** Every drill and test answer, oldest first (capped). */
  history: Answer[];
  /** Difficulty ladder per topic. */
  ladders: Record<string, Ladder>;
  /** Flashcard schedule, keyed by cardKey(). */
  cards: Record<string, CardState>;
  /** Every mistake cleared, and when. */
  cleared: Cleared[];
  /** Last change to target / exam date / daily time (ms), for sync. */
  settingsAt: number;
  /** Fastest sprint, in seconds; and the most recent one. */
  sprintBest: number | null;
  sprintLast: number | null;
  /** Facts missed in sprints, practised as their own flashcard deck. */
  sprintFacts: [problem: string, answer: string][];
  mistakes: Mistake[];
  nothingDue: boolean;
  noScores: boolean;
  scores: Score[];
  /** Finished adaptive tests, oldest first. */
  tests: TestResult[];
  form: ScoreForm;
  formErr: string;
  formOk: boolean;
  progSec: number;
  openPhase: Record<number, boolean>;
  lvl: number;
  toolOpen: number;
}

const freshLesson = (id = CURRICULUM[0].id, step = 0, from: LessonState['from'] = 'learn'): LessonState => ({ id, step, input: '', sel: null, checked: false, ok: false, score: 0, from });
const freshFlash = (from: Origin = 'review', cards: number[] = [0]): FlashState => ({
  i: 0, flipped: false, mode: 'learn', input: '', checked: false, ok: false, done: false, known: 0, from, cards,
});
const freshSprint = (from: Origin = 'review'): SprintState => ({
  i: 0, input: '', sec: 0, flash: null, ans: [], done: false, from, msg: '',
});
const emptyForm: ScoreForm = { date: '', total: '', q: '', v: '', di: '' };
const EMPTY_QUEUE = [false, false, false, false, false];

/** What a brand-new learner starts with. */
function freshProgress() {
  return {
    target: 705,
    examDate: null as string | null,
    dailyMin: 30,
    onboarded: false,
    day: dayKey(),
    lastFullDay: null,
    lessonsDone: [] as string[],
    queue: EMPTY_QUEUE,
    streak: 0,
    inRow: 0,
    mistakes: [] as Mistake[],
    scores: [] as Score[],
    tests: [] as TestResult[],
    history: [] as Answer[],
    ladders: {} as Record<string, Ladder>,
    cards: {} as Record<string, CardState>,
    cleared: [] as Cleared[],
    settingsAt: 0,
    sprintBest: null as number | null,
    sprintLast: null as number | null,
    sprintFacts: [] as [string, string][],
    openPhase: { 0: true, 2: false } as Record<number, boolean>,
    lvl: 0,
    progSec: 0,
  };
}

/** The design's sample learner, for demos and the dev panel. */
function sampleProgress() {
  const today = dayKey();
  return {
    ...freshProgress(),
    lastFullDay: today,
    onboarded: true,
    examDate: addDays(today, 120),
    queue: [true, false, false, false, false],
    streak: 12,
    inRow: 2,
    mistakes: INITIAL_MISTAKES.map(({ due, ...m }) => ({ ...m, next: due ? today : addDays(today, INTERVALS[m.box]) })),
    scores: INITIAL_SCORES,
    cleared: Array.from({ length: 14 }, (_, i) => ({ qid: `sample-${i}`, day: addDays(today, -7), at: 0 })),
    sprintBest: 161,
    sprintLast: 178,
    ...sampleHistory(addDays(today, -1)),
  };
}

/** Answers that reproduce the design's per-topic accuracy and levels. */
function sampleHistory(day: string) {
  const history: Answer[] = [];
  const ladders: Record<string, Ladder> = {};
  for (const t of TOPICS) {
    const pool = QUESTION_LIST.filter(q => q.topic === t.name);
    if (t.acc == null || !pool.length) continue;
    for (let i = 0; i < 20; i++) history.push({ qid: pool[i % pool.length].id, ok: i < Math.round(t.acc / 5), sec: 80, day });
    ladders[t.name] = { level: Math.max(0, t.level), right: 0, wrong: 0 };
  }
  return { history, ladders };
}

function initialTheme(): Theme {
  try {
    const saved = localStorage.getItem('gmatlab.theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* storage unavailable */
  }
  return typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function initialState(): AppState {
  const saved = loadProgress();
  // Anyone with saved progress from before setup existed counts as set up.
  const progress = rollOver({ ...freshProgress(), ...(saved && { onboarded: true }), ...saved });
  return {
    ...progress,
    theme: initialTheme(),
    route: progress.onboarded ? 'today' : 'welcome',
    tab: 'today',
    les: freshLesson(),
    run: null,
    deck: 0,
    fl: freshFlash(),
    sp: freshSprint(),
    nothingDue: false,
    noScores: false,
    form: emptyForm,
    formErr: '',
    formOk: false,
    toolOpen: 0,
  };
}

type Patch = Partial<AppState> | ((s: AppState) => Partial<AppState>);
type Set = (patch: Patch) => void;

const typedMatches = (input: string, answer: string) =>
  input.replace(/\s|%/g, '').toLowerCase() === answer.replace(/\s|%/g, '').toLowerCase();

function routeTo(route: Route, extra?: Partial<AppState>): Partial<AppState> {
  return { route, tab: TAB_OF[route], ...extra };
}

function withQueueDone(s: AppState, n: number): Partial<AppState> {
  const queue = [...s.queue];
  queue[n] = true;
  const finishedNow = queue.every(Boolean) && !s.queue.every(Boolean);
  return finishedNow ? { queue, streak: s.streak + 1, lastFullDay: s.day } : { queue };
}

function newRun(mode: RunMode, list: string[], over?: Partial<Run>): Run {
  return { mode, list, answers: [], i: 0, sel: null, conf: false, sec: 0, reason: null, alt: false, sectionSec: 0, flags: [], phase: 'answering', edits: 0, editing: null, ...over };
}

/** Numeric seed from the day, so each day's generated sets differ but stay stable within the day. */
const daySeed = (day: string) => Number(day.replace(/-/g, ''));

/** Record a miss in Mistakes (back tomorrow), or send an open one back to the start of its schedule. */
function withMistake(mistakes: Mistake[], qid: string, today: string, reason?: string): Mistake[] {
  const q = QUESTIONS[qid];
  const next = addDays(today, INTERVALS[0]);
  const open = mistakes.find(m => m.qid === qid);
  const at = Date.now();
  if (open) return mistakes.map(m => (m === open ? { ...m, box: 0, next, reason: reason ?? m.reason, at } : m));
  return [{ topic: q.topic, title: questionTitle(q), reason: reason ?? 'Not tagged', box: 0, next, qid, at }, ...mistakes];
}

/** Five questions per section at a medium level, each from a different topic where possible. */
function diagnosticSet(seed: number): string[] {
  const out: string[] = [];
  for (const section of ['Quant', 'Data Insights', 'Verbal'] as Section[]) {
    const pool = QUESTION_LIST.filter(q => q.section === section && q.level >= 1 && q.level <= 2);
    const byTopic = new Map<string, string[]>();
    for (const q of seededShuffle(pool, seed)) byTopic.set(q.topic, [...(byTopic.get(q.topic) ?? []), q.id]);
    // Round-robin over topics so five picks cover as many topics as possible.
    const lists = [...byTopic.values()];
    const picks: string[] = [];
    for (let r = 0; picks.length < 5 && lists.some(l => l[r]); r++)
      for (const l of lists) if (l[r] && picks.length < 5) picks.push(l[r]);
    out.push(...picks);
  }
  return out;
}

/** Questions answered in the last few days, so drills prefer ones the learner hasn't just seen. */
const recentIds = (s: AppState) => new Set(s.history.filter(a => a.day >= addDays(s.day, -3)).map(a => a.qid));

/** An adaptive drill for a topic at the learner's level (or the fixed level chosen in Practice). */
function topicRun(s: AppState, topic: string, section?: Section, n = drillSize(s.dailyMin)): Run {
  const own = QUESTION_LIST.filter(q => q.topic === topic);
  const pool = own.length ? own : QUESTION_LIST.filter(q => q.section === section);
  const level = s.lvl > 0 ? s.lvl - 1 : (s.ladders[topic]?.level ?? 0);
  return newRun('practice', adaptiveDrill(pool, level, recentIds(s), daySeed(s.day) + s.history.length, n));
}

/** A mixed set: one question from each of several topics, near each topic's level. */
function mixedRun(s: AppState, n: number): Run {
  const topics = [...new Set(QUESTION_LIST.map(q => q.topic))];
  const picks = adaptiveDrill(
    topics.map(t => adaptiveDrill(QUESTION_LIST.filter(q => q.topic === t), s.ladders[t]?.level ?? 0, recentIds(s), daySeed(s.day), 1)[0]).map(id => QUESTIONS[id]),
    2, new Set(), daySeed(s.day) + s.history.length, n,
  );
  return newRun('extra', picks);
}

export function allDecks(s: Pick<AppState, 'sprintFacts'>): Deck[] {
  return s.sprintFacts.length ? [...DECKS, { name: 'Sprint misses', due: 0, cards: s.sprintFacts }] : DECKS;
}

/** Indexes of a deck's cards that are due today (never-seen cards count as due). */
export function dueCards(s: Pick<AppState, 'cards' | 'day' | 'sprintFacts'>, deck: number): number[] {
  const d = allDecks(s)[deck];
  return d.cards.map((c, i) => [c, i] as const).filter(([c]) => {
    const st = s.cards[cardKey(d.name, c[0])];
    return !st || isDue(st.next, s.day);
  }).map(([, i]) => i);
}

/** The deck the daily queue suggests: the one with the most cards due. */
export function todayDeck(s: Pick<AppState, 'cards' | 'day' | 'sprintFacts'>): number {
  let best = 0;
  allDecks(s).forEach((_, i) => {
    if (dueCards(s, i).length > dueCards(s, best).length) best = i;
  });
  return best;
}

function deckPatch(s: AppState, deck: number, from: Origin, over?: Partial<FlashState>): Partial<AppState> {
  const due = dueCards(s, deck);
  const cards = due.length ? due : allDecks(s)[deck].cards.map((_, i) => i);
  return routeTo('flash', { deck, fl: { ...freshFlash(from, cards), ...over } });
}

/** Today's numbers for the "Session complete" card. */
export function todaySummary(s: AppState) {
  const answers = s.history.filter(a => a.day === s.day);
  const tomorrow = addDays(s.day, 1);
  return {
    accuracy: answers.length ? Math.round((100 * answers.filter(a => a.ok).length) / answers.length) : null,
    cards: Object.values(s.cards).filter(c => c.last === s.day).length,
    cleared: s.cleared.filter(c => c.day === s.day).length,
    mistakesTomorrow: s.mistakes.filter(m => m.next === tomorrow).length,
    cardsTomorrow: Object.values(s.cards).filter(c => c.next === tomorrow).length,
  };
}

function createActions(set: Set) {
  const go = (route: Route, extra?: Partial<AppState>) => set(routeTo(route, extra));
  const completeQueueItem = (n: number) => set(s => withQueueDone(s, n));
  const startRun = (mode: RunMode, list: string[], over?: Partial<Run>) =>
    go('runner', { run: newRun(mode, list, over) });
  const openDeck = (deck: number, from: Origin = 'review', over?: Partial<FlashState>) => set(s => deckPatch(s, deck, from, over));
  const startSprint = (from: Origin = 'review') => go('sprint', { sp: freshSprint(from) });
  const openLesson = (id?: string, from: LessonState['from'] = 'learn', step = 0) =>
    set(s => routeTo('lesson', { les: freshLesson(id ?? nextLesson(s.lessonsDone)?.id ?? CURRICULUM[0].id, step, from) }));

  let flashTimer: ReturnType<typeof setTimeout> | undefined;

  const actions = {
    go,
    completeQueueItem,
    startRun,
    openDeck,
    startSprint,
    openLesson,

    setTheme: (theme: Theme) => set({ theme }),
    setTarget: (target: number) => set({ target, settingsAt: Date.now() }),
    setPlan: (plan: Partial<Pick<AppState, 'target' | 'examDate' | 'dailyMin'>>) => set({ ...plan, settingsAt: Date.now() }),
    /** Take in progress merged with another device's. */
    applySynced: (data: Partial<AppState>) => set(s => rollOver({ ...s, ...data }, dayKey())),
    /** Finish setup; optionally go straight into the diagnostic. */
    finishSetup(diagnostic: boolean) {
      set(s => (diagnostic ? { onboarded: true, ...routeTo('runner', { run: newRun('diagnostic', diagnosticSet(daySeed(s.day))) }) } : { onboarded: true, ...routeTo('today') }));
    },
    loadSample: () => set({ ...sampleProgress(), ...routeTo('today') }),
    /** Replace progress with a backup file's contents. Returns false if the file isn't a backup. */
    importProgress(raw: string): boolean {
      const data = parseProgress(raw);
      if (!data) return false;
      set(rollOver({ ...freshProgress(), onboarded: true, ...data, ...routeTo('today') } as AppState, dayKey()));
      return true;
    },
    resetProgress() {
      clearProgress();
      set({ ...freshProgress(), ...routeTo('welcome') });
    },

    startTopicDrill(topic: string, section?: Section) {
      set(s => routeTo('runner', { run: topicRun(s, topic, section) }));
    },
    startMixed: () => set(s => routeTo('runner', { run: mixedRun(s, 5) })),

    queueGo(n: number) {
      if (n === 0) set(s => deckPatch(s, todayDeck(s), 'today'));
      else if (n === 1) startSprint('today');
      else if (n === 2)
        set(s => {
          const next = nextLesson(s.lessonsDone);
          // Every lesson done: the slot becomes a drill on the weakest topic.
          if (!next) {
            const weak = weakestTopic(s);
            return routeTo('runner', { run: { ...topicRun(s, weak?.name ?? 'Percents', weak?.sec), mode: 'lessonDrill' as RunMode, title: `Drill: ${weak?.name ?? 'Percents'}` } });
          }
          return routeTo('lesson', { les: freshLesson(next.id, 0, 'today') });
        });
      else if (n === 3)
        set(s => {
          const due = visibleMistakes(s).filter(m => m.due);
          // Nothing due: the item is done by definition; show the empty Mistakes screen.
          if (!due.length) return { ...withQueueDone(s, 3), ...routeTo('mistakes') };
          return routeTo('runner', { run: newRun('mistakes', due.map(m => m.qid)) });
        });
      else
        set(s => {
          const f = todaysFocus(s);
          if (f.kind === 'test') {
            const first = nextTestQuestion(f.section, [], [], daySeed(s.day) + s.tests.length)!;
            return routeTo('runner', { run: newRun('test', [first], { section: f.section, length: TESTS[f.section].length, fromQueue: true }) });
          }
          // 'cr' mode ticks off the focus slot when the set ends.
          if (f.kind === 'weak') return routeTo('runner', { run: { ...topicRun(s, f.topic, f.section, f.n), mode: 'cr', title: `Drill: ${f.topic}` } });
          if (f.kind === 'mixed') return routeTo('runner', { run: { ...mixedRun(s, f.n), mode: 'cr', title: 'Mixed set' } });
          return routeTo('runner', { run: newRun('cr', crSet(f.n, daySeed(s.day))) });
        });
    },
    startTest(section: TestDef['section']) {
      set(s => {
        const first = nextTestQuestion(section, [], [], daySeed(s.day) + s.tests.length)!;
        return routeTo('runner', { run: newRun('test', [first], { section, length: TESTS[section].length }) });
      });
    },

    tick() {
      set(s => {
        const today = dayKey();
        if (s.day !== today) return rollOver(s, today);
        const run = s.run;
        if (s.route === 'runner' && run?.mode === 'test') {
          const sectionSec = run.sectionSec + 1;
          if (sectionSec >= TESTS[run.section ?? 'Quant'].minutes * 60) return finishTest({ ...s, run: { ...run, sectionSec } });
          return { run: { ...run, sectionSec, sec: run.phase === 'answering' ? run.sec + 1 : run.sec } };
        }
        if (s.route === 'runner' && run && !run.conf) return { run: { ...run, sec: run.sec + 1 } };
        if (s.route === 'sprint' && !s.sp.done) return { sp: { ...s.sp, sec: s.sp.sec + 1 } };
        return {};
      });
    },

    // ── Lesson ──
    lessonInput: (input: string) => set(s => ({ les: { ...s.les, input, checked: false } })),
    lessonSelect: (sel: number) => set(s => (s.les.checked && s.les.ok ? {} : { les: { ...s.les, sel, checked: false } })),
    lessonBack: () => set(s => ({ les: { ...s.les, step: s.les.step - 1, input: '', sel: null, checked: false, ok: false } })),
    lessonNext() {
      set(s => {
        const L = s.les;
        const lesson = LESSON_BY_ID[L.id];
        if (L.step >= 5) return routeTo('runner', { run: topicRun(s, lesson.topic) });
        const q = L.step === 3 || L.step === 4 ? lesson.guided[L.step - 3] : null;
        if (q) {
          const answered = q.kind === 'number' ? L.input.trim() !== '' : L.sel != null;
          if (!answered) return {};
          if (!L.checked) {
            const ok = q.kind === 'number' ? Math.abs(Number(L.input.replace(/,/g, '')) - q.ans) < 1e-9 : L.sel === q.ans;
            return { les: { ...L, checked: true, ok, score: L.score + (ok ? 1 : 0) } };
          }
          if (!L.ok) return { les: { ...L, checked: false, input: '', sel: null } };
        }
        const finished = L.step === 4;
        const done = finished && !s.lessonsDone.includes(L.id) ? { lessonsDone: [...s.lessonsDone, L.id] } : {};
        const queuePatch = finished && L.from === 'today' ? withQueueDone(s, 2) : {};
        return { ...queuePatch, ...done, les: { ...L, step: L.step + 1, input: '', sel: null, checked: false, ok: false } };
      });
    },

    // ── Question runner ──
    select: (i: number) => set(s => (s.run && !s.run.conf ? { run: { ...s.run, sel: i } } : {})),
    confirm() {
      set(s => {
        const run = s.run;
        if (!run || run.sel == null || run.conf) return {};
        const qid = run.list[run.i];
        const q = QUESTIONS[qid];
        const ok = run.sel === q.ans;
        const answered = { ...run, answers: [...run.answers, { qid, sel: run.sel, ok, sec: run.sec }] };
        const now = Date.now();
        const learned = {
          history: pushHistory(s.history, { qid, ok, sec: run.sec, day: s.day, t: now }),
          ladders: { ...s.ladders, [q.topic]: { ...climb(s.ladders[q.topic], ok), at: now } },
        };
        // Diagnostic: no solutions, and each answer places the topic's level directly.
        if (run.mode === 'diagnostic') {
          const level = ok ? Math.min(4, q.level + 1) : Math.max(0, q.level - 1);
          const seeded = { ...learned, ladders: { ...s.ladders, [q.topic]: { level, right: 0, wrong: 0, at: now } } };
          const missed = ok ? {} : { mistakes: withMistake(s.mistakes, qid, s.day) };
          if (run.i < run.list.length - 1) return { ...seeded, ...missed, run: { ...answered, i: run.i + 1, sel: null, sec: 0 } };
          return { ...seeded, ...missed, run: null, ...routeTo('today') };
        }
        // Changing an answer from the end-of-section review: no new question, no learning yet.
        if (run.mode === 'test' && run.editing != null) {
          const answers = run.answers.map((x, i) => (i === run.editing ? { ...x, sel: run.sel!, ok: run.sel === QUESTIONS[x.qid].ans } : x));
          const changed = run.answers[run.editing].sel !== run.sel;
          return { run: { ...run, answers, editing: null, phase: 'review', sel: null, edits: run.edits + (changed ? 1 : 0) } };
        }
        // Tests reveal nothing until the end; pick the next question from how this one went.
        if (run.mode === 'test') {
          const section = run.section ?? 'Quant';
          const more = answered.answers.length < (run.length ?? 0);
          const next = more ? nextTestQuestion(section, run.list, answered.answers.map(a => a.ok), daySeed(s.day) + s.tests.length) : undefined;
          if (!next) return { ...learned, run: { ...answered, sel: null, phase: 'review' } };
          return { ...learned, run: { ...answered, list: [...run.list, next], i: run.i + 1, sel: null, sec: 0 } };
        }
        const reviewing = run.mode === 'review' || run.mode === 'mistakes';
        let review: Partial<AppState> = {};
        if (reviewing) {
          const open = s.mistakes.find(m => m.qid === qid);
          const after = open && reviewMistake(open, ok, s.day);
          if (open)
            review = after
              ? { mistakes: s.mistakes.map(m => (m === open ? { ...after, at: now } : m)) }
              : { mistakes: s.mistakes.filter(m => m !== open), cleared: [...s.cleared, { qid, day: s.day, at: Date.now() }] };
        } else if (!ok) review = { mistakes: withMistake(s.mistakes, qid, s.day) };
        return { ...learned, ...review, run: { ...answered, conf: true }, inRow: ok ? s.inRow + 1 : 0 };
      });
    },
    toggleAlt: () => set(s => (s.run ? { run: { ...s.run, alt: !s.run.alt } } : {})),
    setReason(label: string) {
      set(s => {
        const run = s.run;
        if (!run) return {};
        const qid = run.list[run.i];
        const open = s.mistakes.find(m => m.qid === qid);
        // Reviewing an existing miss only retags it; a fresh miss is (re)scheduled.
        const mistakes = open ? s.mistakes.map(m => (m === open ? { ...m, reason: label, at: Date.now() } : m)) : withMistake(s.mistakes, qid, s.day, label);
        return { run: { ...run, reason: label }, mistakes };
      });
    },
    runNext: () => set(advanceRun),
    runPrev: () =>
      set(s => {
        const run = s.run;
        if (!run || run.mode !== 'testReview' || run.i === 0) return {};
        return { run: { ...run, i: run.i - 1, sel: run.presets![run.i - 1], conf: true, alt: false, reason: null } };
      }),
    toggleFlag: () =>
      set(s => {
        const run = s.run;
        if (!run) return {};
        const id = run.list[run.i];
        return { run: { ...run, flags: run.flags.includes(id) ? run.flags.filter(f => f !== id) : [...run.flags, id] } };
      }),
    /** From the end-of-section review: reopen a question to change its answer. */
    editAnswer: (index: number) =>
      set(s => {
        const run = s.run;
        if (!run || run.mode !== 'test' || run.edits >= 3) return {};
        return { run: { ...run, phase: 'answering', editing: index, i: index, sel: run.answers[index].sel } };
      }),
    cancelEdit: () => set(s => (s.run ? { run: { ...s.run, phase: 'review', editing: null, sel: null } } : {})),
    finishSection: () => set(s => finishTest(s)),
    /** Walk through a finished test question by question with solutions. */
    reviewTest: (index = 0) =>
      set(s => {
        const t = s.tests[s.tests.length - 1];
        if (!t?.answers?.length) return {};
        const list = t.answers.map(x => x.qid);
        const presets = t.answers.map(x => x.sel);
        return routeTo('runner', { run: newRun('testReview', list, { presets, i: index, sel: presets[index], conf: true }) });
      }),

    // ── Flashcards ──
    flip: () =>
      set(s => (s.fl.mode !== 'type' || s.fl.checked ? { fl: { ...s.fl, flipped: !s.fl.flipped } } : {})),
    setFlashMode: (mode: FlashState['mode']) =>
      set(s => ({ fl: { ...s.fl, mode, flipped: false, input: '', checked: false } })),
    flashInput: (input: string) => set(s => ({ fl: { ...s.fl, input, checked: false } })),
    flashMain() {
      set(s => {
        const f = s.fl;
        if (f.mode !== 'type') return { fl: { ...f, flipped: true } };
        if (!f.checked) {
          if (!f.input.trim()) return {};
          const card = currentCard(s);
          return { fl: { ...f, checked: true, ok: typedMatches(f.input, card[1]), flipped: true } };
        }
        return advanceFlash(s, f.ok);
      });
    },
    flashGrade: (known: boolean) => set(s => advanceFlash(s, known)),
    flashFinish: () =>
      set(s => (s.fl.from === 'today' ? { ...withQueueDone(s, 0), ...routeTo('today') } : routeTo('review'))),

    // ── Sprint ──
    sprintKey(k: string) {
      set(s => {
        const sp = s.sp;
        if (sp.done) return {};
        if (k === 'del') return { sp: { ...sp, input: sp.input.slice(0, -1) } };
        if (k === 'ok') {
          if (!sp.input) return {};
          const [p, a] = SPRINT[sp.i];
          const ok = Number(sp.input) === a;
          const done = sp.i === SPRINT.length - 1;
          const ans = [...sp.ans, { p, a, g: sp.input, ok }];
          clearTimeout(flashTimer);
          flashTimer = setTimeout(() => set(s2 => ({ sp: { ...s2.sp, flash: null, msg: '' } })), ok ? 350 : 900);
          const missed = ans.filter(x => !x.ok).map(x => [x.p, String(x.a)] as [string, string]);
          const record = done
            ? {
                sprintLast: sp.sec,
                // A best time only counts for a clean run.
                sprintBest: missed.length === 0 && (s.sprintBest == null || sp.sec < s.sprintBest) ? sp.sec : s.sprintBest,
                sprintFacts: [...s.sprintFacts, ...missed.filter(([pr]) => !s.sprintFacts.some(f => f[0] === pr))],
              }
            : {};
          return {
            ...record,
            sp: {
              ...sp,
              ans,
              i: done ? sp.i : sp.i + 1,
              input: '',
              flash: ok ? 'ok' : 'bad',
              msg: ok ? 'Right' : p + ' = ' + a,
              done,
            },
          };
        }
        return sp.input.length < 5 ? { sp: { ...sp, input: sp.input + k } } : {};
      });
    },
    sprintFinish: () =>
      set(s => (s.sp.from === 'today' ? { ...withQueueDone(s, 1), ...routeTo('today') } : routeTo('review'))),

    // ── Learn / practice / progress UI ──
    togglePhase: (i: number) => set(s => ({ openPhase: { ...s.openPhase, [i]: !s.openPhase[i] } })),
    setLevel: (lvl: number) => set({ lvl }),
    toggleTool: (i: number) => set(s => ({ toolOpen: s.toolOpen === i ? -1 : i })),
    setProgSec: (progSec: number) => set({ progSec }),
    formField: (k: keyof ScoreForm, value: string) =>
      set(s => ({ form: { ...s.form, [k]: value }, formErr: '', formOk: false })),
    logScore() {
      set(s => {
        const f = s.form;
        const n = (k: keyof ScoreForm) => parseInt(f[k], 10);
        if (!f.date.trim()) return { formErr: 'Add the exam date.', formOk: false };
        if (!(n('total') >= 205 && n('total') <= 805)) return { formErr: 'Total must be between 205 and 805.', formOk: false };
        for (const k of ['q', 'v', 'di'] as const)
          if (!(n(k) >= 60 && n(k) <= 90)) return { formErr: 'Section scores must be between 60 and 90.', formOk: false };
        const base = s.noScores ? [] : s.scores;
        const entry: Score = {
          date: f.date.trim(), label: 'Official Practice ' + (base.length + 1),
          total: n('total'), q: n('q'), v: n('v'), di: n('di'),
        };
        return { scores: [...base, entry], noScores: false, form: emptyForm, formErr: '', formOk: true };
      });
    },

    /** Preview a named state of the prototype (dev panel only). */
    jump(key: JumpKey) {
      const reset: Partial<AppState> = { queue: [true, false, false, false, false], nothingDue: false, noScores: false };
      const J: Record<JumpKey, () => void> = {
        today: () => go('today', reset),
        todayMid: () => go('today', { ...reset, queue: [true, true, true, false, false] }),
        todayDone: () => go('today', { ...reset, queue: [true, true, true, true, true], streak: 13 }),
        learn: () => go('learn'),
        lessonRule: () => openLesson('percents-2', 'learn', 0),
        lessonEx: () => openLesson('percents-2', 'learn', 1),
        lessonTrap: () => openLesson('percents-2', 'learn', 2),
        lessonQ: () => openLesson('percents-2', 'learn', 3),
        lessonWrong: () => go('lesson', { les: { ...freshLesson('percents-2', 3), input: '50', checked: true } }),
        practice: () => go('practice'),
        runQ: () => startRun('practice', ['pct-raise-cut', 'exp-same-base', 'ds-sign', 'cr-streetlights', 'tbl-sales-pct'], { sec: 38 }),
        runOk: () => startRun('practice', ['pct-raise-cut', 'exp-same-base', 'ds-sign', 'cr-streetlights', 'tbl-sales-pct'], { sel: 2, conf: true, sec: 72 }),
        runBad: () => startRun('practice', ['ds-sign', 'pct-raise-cut', 'exp-same-base', 'cr-streetlights', 'tbl-sales-pct'], { sel: 0, conf: true, sec: 154 }),
        runOver: () => startRun('practice', ['cr-streetlights', 'tbl-sales-pct'], { sel: 1, sec: 131 }),
        runTable: () => startRun('practice', ['tbl-sales-pct'], { sec: 25 }),
        tests: () => go('tests'),
        testRun: () => actions.startTest('Quant'),
        results: () => go('results'),
        review: () => go('review', { nothingDue: false }),
        reviewEmpty: () => go('review', { nothingDue: true }),
        flash: () => openDeck(0),
        flashFlip: () => openDeck(0, 'review', { flipped: true }),
        flashType: () => openDeck(0, 'review', { mode: 'type' }),
        sprint: () => startSprint(),
        sprintEnd: () =>
          go('sprint', {
            sp: {
              ...freshSprint(), i: 19, sec: 161, done: true,
              ans: SPRINT.map(([p, a], i) => ({
                p, a, ok: ![4, 13, 16].includes(i),
                g: i === 4 ? '159' : i === 13 ? '32' : i === 16 ? '196' : String(a),
              })),
            },
          }),
        mistakes: () => go('mistakes', { nothingDue: false }),
        mistakesEmpty: () => go('mistakes', { nothingDue: true }),
        progress: () => go('progress', { noScores: false }),
        progressEmpty: () => go('progress', { noScores: true }),
      };
      J[key]();
    },
  };
  return actions;
}

export type JumpKey =
  | 'today' | 'todayMid' | 'todayDone' | 'learn' | 'lessonRule' | 'lessonEx' | 'lessonTrap' | 'lessonQ'
  | 'lessonWrong' | 'practice' | 'runQ' | 'runOk' | 'runBad' | 'runOver' | 'runTable' | 'tests' | 'testRun'
  | 'results' | 'review' | 'reviewEmpty' | 'flash' | 'flashFlip' | 'flashType' | 'sprint' | 'sprintEnd'
  | 'mistakes' | 'mistakesEmpty' | 'progress' | 'progressEmpty';

export function currentCard(s: AppState) {
  const cards = allDecks(s)[s.deck].cards;
  return cards[s.fl.cards[Math.min(s.fl.i, s.fl.cards.length - 1)]];
}

/** Score the section (unanswered questions count against it) and file every miss in Mistakes. */
function finishTest(s: AppState): Partial<AppState> {
  const run = s.run;
  if (!run) return {};
  const section = run.section ?? 'Quant';
  const unanswered = Math.max(0, (run.length ?? run.answers.length) - run.answers.length);
  const result = scoreTest(section, run.answers, new Date(), s.day, unanswered);
  const missed = run.answers.filter(a => !a.ok).map(a => a.qid);
  return {
    ...(run.fromQueue ? withQueueDone(s, 4) : {}),
    ...routeTo('results'), run: null, tests: [...s.tests, result], mistakes: missed.reduce((ms, qid) => withMistake(ms, qid, s.day), s.mistakes),
  };
}

function advanceRun(s: AppState): Partial<AppState> {
  const run = s.run;
  if (!run) return {};
  if (run.mode === 'testReview' && run.i < run.list.length - 1)
    return { run: { ...run, i: run.i + 1, sel: run.presets![run.i + 1], conf: true, alt: false, reason: null } };
  if (run.i < run.list.length - 1)
    return { run: { ...run, i: run.i + 1, sel: null, conf: false, sec: 0, reason: null, alt: false } };
  switch (run.mode) {
    case 'mistakes': return { ...withQueueDone(s, 3), ...routeTo('today') };
    case 'cr': return { ...withQueueDone(s, 4), ...routeTo('today') };
    case 'lessonDrill': return { ...withQueueDone(s, 2), ...routeTo('today') };
    case 'test': return finishTest(s);
    case 'testReview': return routeTo('results');
    case 'review': return routeTo('mistakes');
    case 'extra': return routeTo('today');
    default: return routeTo('practice');
  }
}

function advanceFlash(s: AppState, known: boolean): Partial<AppState> {
  const deck = allDecks(s)[s.deck];
  const f = s.fl;
  const k = cardKey(deck.name, currentCard(s)[0]);
  const last = f.i >= f.cards.length - 1;
  return {
    cards: { ...s.cards, [k]: { ...gradeCard(s.cards[k], known, s.day), at: Date.now() } },
    fl: { ...f, i: last ? f.i : f.i + 1, flipped: false, input: '', checked: false, ok: false, done: last, known: f.known + (known ? 1 : 0) },
  };
}

export type Actions = ReturnType<typeof createActions>;

export function useAppStore() {
  const [state, setState] = useState(initialState);
  const actions = useMemo(
    () => createActions(patch => setState(s => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }))),
    [],
  );

  useEffect(() => {
    const t = setInterval(actions.tick, 1000);
    return () => clearInterval(t);
  }, [actions]);

  // Physical keyboard for the sprint keypad.
  const sprintActive = state.route === 'sprint' && !state.sp.done;
  useEffect(() => {
    if (!sprintActive) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (/^[0-9]$/.test(e.key)) actions.sprintKey(e.key);
      else if (e.key === 'Backspace') actions.sprintKey('del');
      else if (e.key === 'Enter') actions.sprintKey('ok');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sprintActive, actions]);

  useEffect(() => saveProgress(state), PERSISTED.map(k => state[k]));

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
    try {
      localStorage.setItem('gmatlab.theme', state.theme);
    } catch {
      /* storage unavailable */
    }
  }, [state.theme]);

  return { s: state, a: actions };
}

export interface AppCtx {
  s: AppState;
  a: Actions;
  desk: boolean;
}

export const AppContext = createContext<AppCtx | null>(null);

export function useApp(): AppCtx {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp outside AppContext');
  return ctx;
}

export const fmtTime = (sec: number) => Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');

/** Mistakes with their due flag for today; the dev "nothing due" preview clears every flag. */
export function visibleMistakes(s: AppState): VisibleMistake[] {
  return s.mistakes.map(m => ({ ...m, due: !s.nothingDue && isDue(m.next, s.day) }));
}
