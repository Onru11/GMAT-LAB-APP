import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { PERSISTED, clearProgress, dayKey, loadProgress, rollOver, saveProgress } from './persist';
import {
  DECKS,
  INITIAL_MISTAKES,
  INITIAL_SCORES,
  LESSON_QUESTIONS,
  SPRINT,
  type Mistake,
  type Score,
} from './data';
import { QUESTIONS } from './content/questions';
import { buildTest, crSet, questionTitle, scoreTest, topicDrill, type AnswerRecord, type TestDef, type TestResult } from './content/select';

export type Route =
  | 'today' | 'learn' | 'lesson' | 'practice' | 'tests' | 'results'
  | 'runner' | 'review' | 'flash' | 'sprint' | 'mistakes' | 'progress';
export type Tab = 'today' | 'learn' | 'practice' | 'review' | 'progress';
export type RunMode = 'practice' | 'mistakes' | 'cr' | 'test' | 'review' | 'extra';
export type Origin = 'today' | 'review';
export type Theme = 'light' | 'dark';

export const TAB_OF: Record<Route, Tab> = {
  today: 'today', learn: 'learn', lesson: 'learn', practice: 'practice', tests: 'practice',
  results: 'practice', runner: 'practice', review: 'review', flash: 'review', sprint: 'review',
  mistakes: 'review', progress: 'progress',
};
/** Focus screens: no tab bar on mobile, tighter top padding. */
export const FULLSCREEN: Partial<Record<Route, true>> = { lesson: true, runner: true, flash: true, sprint: true };

export interface Run {
  mode: RunMode;
  /** Question ids. */
  list: string[];
  /** Set when mode is 'test'. */
  section?: TestDef['section'];
  answers: AnswerRecord[];
  i: number;
  sel: number | null;
  conf: boolean;
  sec: number;
  reason: string | null;
  alt: boolean;
}

export interface LessonState {
  step: number;
  input: string;
  checked: boolean;
  ok: boolean;
  score: number;
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
  route: Route;
  tab: Tab;
  /** The day `queue` belongs to (YYYY-MM-DD). */
  day: string;
  /** Last day all five queue items were finished; keeps the streak alive. */
  lastFullDay: string | null;
  queue: boolean[];
  streak: number;
  les: LessonState;
  run: Run | null;
  inRow: number;
  deck: number;
  fl: FlashState;
  boxes: number[];
  sp: SprintState;
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

const freshLesson = (step = 0): LessonState => ({ step, input: '', checked: false, ok: false, score: 0 });
const freshFlash = (from: Origin = 'review'): FlashState => ({
  i: 0, flipped: false, mode: 'learn', input: '', checked: false, ok: false, done: false, known: 0, from,
});
const freshSprint = (from: Origin = 'review'): SprintState => ({
  i: 0, input: '', sec: 0, flash: null, ans: [], done: false, from, msg: '',
});
const emptyForm: ScoreForm = { date: '', total: '', q: '', v: '', di: '' };
const EMPTY_QUEUE = [false, false, false, false, false];
const ALL_CARDS = DECKS.reduce((n, d) => n + d.cards.length, 0);

/** What a brand-new learner starts with. */
function freshProgress() {
  return {
    target: 705,
    day: dayKey(),
    lastFullDay: null,
    queue: EMPTY_QUEUE,
    streak: 0,
    inRow: 0,
    boxes: [ALL_CARDS, 0, 0, 0],
    mistakes: [] as Mistake[],
    scores: [] as Score[],
    tests: [] as TestResult[],
    openPhase: { 0: true, 2: false } as Record<number, boolean>,
    lvl: 0,
    progSec: 0,
  };
}

/** The design's sample learner, for demos and the dev panel. */
function sampleProgress() {
  return {
    ...freshProgress(),
    lastFullDay: dayKey(),
    queue: [true, false, false, false, false],
    streak: 12,
    inRow: 2,
    boxes: [5, 4, 2, 1],
    mistakes: INITIAL_MISTAKES,
    scores: INITIAL_SCORES,
  };
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
  const progress = rollOver({ ...freshProgress(), ...saved });
  return {
    ...progress,
    theme: initialTheme(),
    route: 'today',
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
  return { mode, list, answers: [], i: 0, sel: null, conf: false, sec: 0, reason: null, alt: false, ...over };
}

/** Numeric seed from the day, so each day's generated sets differ but stay stable within the day. */
const daySeed = (day: string) => Number(day.replace(/-/g, ''));

/** Record a miss in Mistakes, or send an open one back to the start of its schedule. */
function withMistake(mistakes: Mistake[], qid: string, reason?: string): Mistake[] {
  const q = QUESTIONS[qid];
  const open = mistakes.find(m => m.qid === qid);
  if (open) return mistakes.map(m => (m === open ? { ...m, box: 0, due: false, reason: reason ?? m.reason } : m));
  return [{ topic: q.topic, title: questionTitle(q), reason: reason ?? 'Not tagged', box: 0, due: false, qid }, ...mistakes];
}

function createActions(set: Set) {
  const go = (route: Route, extra?: Partial<AppState>) => set(routeTo(route, extra));
  const completeQueueItem = (n: number) => set(s => withQueueDone(s, n));
  const startRun = (mode: RunMode, list: string[], over?: Partial<Run>) =>
    go('runner', { run: newRun(mode, list, over) });
  const openDeck = (deck: number, from: Origin = 'review', over?: Partial<FlashState>) =>
    go('flash', { deck, fl: { ...freshFlash(from), ...over } });
  const startSprint = (from: Origin = 'review') => go('sprint', { sp: freshSprint(from) });
  const openLesson = (step = 0) => go('lesson', { les: freshLesson(step) });

  let flashTimer: ReturnType<typeof setTimeout> | undefined;

  const actions = {
    go,
    completeQueueItem,
    startRun,
    openDeck,
    startSprint,
    openLesson,

    setTheme: (theme: Theme) => set({ theme }),
    setTarget: (target: number) => set({ target }),
    loadSample: () => set({ ...sampleProgress(), ...routeTo('today') }),
    resetProgress() {
      clearProgress();
      set({ ...freshProgress(), ...routeTo('today') });
    },

    queueGo(n: number) {
      if (n === 0) openDeck(0, 'today');
      else if (n === 1) startSprint('today');
      else if (n === 2) openLesson(0);
      else if (n === 3)
        set(s => {
          const due = visibleMistakes(s).filter(m => m.due);
          // Nothing due: the item is done by definition; show the empty Mistakes screen.
          if (!due.length) return { ...withQueueDone(s, 3), ...routeTo('mistakes') };
          return routeTo('runner', { run: newRun('mistakes', due.map(m => m.qid)) });
        });
      else set(s => routeTo('runner', { run: newRun('cr', crSet(2, daySeed(s.day))) }));
    },
    startTest(section: TestDef['section']) {
      set(s => routeTo('runner', { run: newRun('test', buildTest(section, daySeed(s.day) + s.tests.length), { section }) }));
    },

    tick() {
      set(s => {
        const today = dayKey();
        if (s.day !== today) return rollOver(s, today);
        if (s.route === 'runner' && s.run && !s.run.conf) return { run: { ...s.run, sec: s.run.sec + 1 } };
        if (s.route === 'sprint' && !s.sp.done) return { sp: { ...s.sp, sec: s.sp.sec + 1 } };
        return {};
      });
    },

    // ── Lesson ──
    lessonInput: (input: string) => set(s => ({ les: { ...s.les, input, checked: false } })),
    lessonBack: () => set(s => ({ les: { ...s.les, step: s.les.step - 1, input: '', checked: false, ok: false } })),
    lessonNext() {
      set(s => {
        const L = s.les;
        if (L.step >= 5) return routeTo('runner', { run: newRun('practice', topicDrill('Percents')) });
        const q = L.step === 3 || L.step === 4 ? LESSON_QUESTIONS[L.step - 3] : null;
        if (q) {
          if (!L.input) return {};
          if (!L.checked) {
            const ok = Number(L.input) === q.ans;
            return { les: { ...L, checked: true, ok, score: L.score + (ok ? 1 : 0) } };
          }
          if (!L.ok) return { les: { ...L, checked: false, input: '' } };
        }
        const queuePatch = L.step === 4 ? withQueueDone(s, 2) : {};
        return { ...queuePatch, les: { ...L, step: L.step + 1, input: '', checked: false, ok: false } };
      });
    },

    // ── Question runner ──
    select: (i: number) => set(s => (s.run && !s.run.conf ? { run: { ...s.run, sel: i } } : {})),
    confirm() {
      set(s => {
        const run = s.run;
        if (!run || run.sel == null || run.conf) return {};
        const qid = run.list[run.i];
        const ok = run.sel === QUESTIONS[qid].ans;
        const answered = { ...run, answers: [...run.answers, { qid, sel: run.sel, ok, sec: run.sec }] };
        // Tests reveal nothing until the end.
        if (run.mode === 'test') return advanceRun({ ...s, run: answered });
        const reviewing = run.mode === 'review' || run.mode === 'mistakes';
        return {
          run: { ...answered, conf: true },
          inRow: ok ? s.inRow + 1 : 0,
          ...(!ok && !reviewing ? { mistakes: withMistake(s.mistakes, qid) } : {}),
        };
      });
    },
    toggleAlt: () => set(s => (s.run ? { run: { ...s.run, alt: !s.run.alt } } : {})),
    setReason(label: string) {
      set(s => {
        const run = s.run;
        if (!run) return {};
        return { run: { ...run, reason: label }, mistakes: withMistake(s.mistakes, run.list[run.i], label) };
      });
    },
    runNext: () => set(advanceRun),

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
          clearTimeout(flashTimer);
          flashTimer = setTimeout(() => set(s2 => ({ sp: { ...s2.sp, flash: null, msg: '' } })), ok ? 350 : 900);
          return {
            sp: {
              ...sp,
              ans: [...sp.ans, { p, a, g: sp.input, ok }],
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
        lessonRule: () => openLesson(0),
        lessonEx: () => openLesson(1),
        lessonTrap: () => openLesson(2),
        lessonQ: () => openLesson(3),
        lessonWrong: () => go('lesson', { les: { step: 3, input: '50', checked: true, ok: false, score: 0 } }),
        practice: () => go('practice'),
        runQ: () => startRun('practice', ['pct-raise-cut', 'exp-same-base', 'ds-sign', 'cr-streetlights', 'tbl-sales-pct'], { sec: 38 }),
        runOk: () => startRun('practice', ['pct-raise-cut', 'exp-same-base', 'ds-sign', 'cr-streetlights', 'tbl-sales-pct'], { sel: 2, conf: true, sec: 72 }),
        runBad: () => startRun('practice', ['ds-sign', 'pct-raise-cut', 'exp-same-base', 'cr-streetlights', 'tbl-sales-pct'], { sel: 0, conf: true, sec: 154 }),
        runOver: () => startRun('practice', ['cr-streetlights', 'tbl-sales-pct'], { sel: 1, sec: 131 }),
        runTable: () => startRun('practice', ['tbl-sales-pct'], { sec: 25 }),
        tests: () => go('tests'),
        testRun: () => startRun('test', buildTest('Quant', 1), { section: 'Quant', sec: 47 }),
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
  const cards = DECKS[s.deck].cards;
  return cards[Math.min(s.fl.i, cards.length - 1)];
}

function advanceRun(s: AppState): Partial<AppState> {
  const run = s.run;
  if (!run) return {};
  if (run.i < run.list.length - 1)
    return { run: { ...run, i: run.i + 1, sel: null, conf: false, sec: 0, reason: null, alt: false } };
  switch (run.mode) {
    case 'mistakes': return { ...withQueueDone(s, 3), ...routeTo('today') };
    case 'cr': return { ...withQueueDone(s, 4), ...routeTo('today') };
    case 'test': {
      const section = run.section ?? 'Quant';
      const result = scoreTest(section, run.answers, new Date(), s.day);
      const missed = run.answers.filter(a => !a.ok).map(a => a.qid);
      return { ...routeTo('results'), tests: [...s.tests, result], mistakes: missed.reduce((ms, qid) => withMistake(ms, qid), s.mistakes) };
    }
    case 'review': return routeTo('mistakes');
    case 'extra': return routeTo('today');
    default: return routeTo('practice');
  }
}

function advanceFlash(s: AppState, known: boolean): Partial<AppState> {
  const deck = DECKS[s.deck];
  const f = s.fl;
  const b = [...s.boxes];
  if (known) {
    if (b[0] > 0) { b[0]--; b[1]++; }
  } else {
    b[0]++;
    if (b[1] > 0) b[1]--;
  }
  const last = f.i >= deck.cards.length - 1;
  return {
    boxes: b,
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

/** Mistakes as displayed: the "nothing due" preview clears every due flag. */
export function visibleMistakes(s: AppState): Mistake[] {
  return s.nothingDue ? s.mistakes.map(m => ({ ...m, due: false })) : s.mistakes;
}
