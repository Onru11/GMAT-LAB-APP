import { useEffect, useRef, useSyncExternalStore } from 'react';
import { AppContext, FULLSCREEN, useAppStore, visibleMistakes, type Route, type Tab } from './store';
import { BT, FlameIcon } from './components/ui';
import { DevPanel } from './components/DevPanel';
import { Today } from './screens/Today';
import { Learn } from './screens/Learn';
import { Lesson } from './screens/Lesson';
import { Practice } from './screens/Practice';
import { Results, Tests } from './screens/Tests';
import { Runner } from './screens/Runner';
import { Review } from './screens/Review';
import { Flashcards } from './screens/Flashcards';
import { Sprint } from './screens/Sprint';
import { Mistakes } from './screens/Mistakes';
import { Progress } from './screens/Progress';

const SCREENS: Record<Route, () => JSX.Element | null> = {
  today: Today, learn: Learn, lesson: Lesson, practice: Practice, tests: Tests, results: Results,
  runner: Runner, review: Review, flash: Flashcards, sprint: Sprint, mistakes: Mistakes, progress: Progress,
};

const TABS: Tab[] = ['today', 'learn', 'practice', 'review', 'progress'];
const TAB_ICONS: Record<Tab, string[]> = {
  today: ['m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10'],
  learn: ['M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z', 'M9 3v15', 'M15 6v15'],
  practice: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z', 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'],
  review: ['m12 2 10 5-10 5L2 7z', 'm2 17 10 5 10-5', 'm2 12 10 5 10-5'],
  progress: ['M3 3v18h18', 'm19 9-5 5-4-4-3 3'],
};
const tabLabel = (t: Tab) => t[0].toUpperCase() + t.slice(1);

const DESKTOP_QUERY = '(min-width: 900px)';
function useIsDesktop() {
  return useSyncExternalStore(
    cb => {
      const mq = matchMedia(DESKTOP_QUERY);
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => matchMedia(DESKTOP_QUERY).matches,
  );
}

const showDevPanel = new URLSearchParams(location.search).has('dev');

function TabIcon({ tab, size }: { tab: Tab; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {TAB_ICONS[tab].map(d => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

export function App() {
  const { s, a } = useAppStore();
  const desk = useIsDesktop();
  const scrollRef = useRef<HTMLDivElement>(null);
  const full = !!FULLSCREEN[s.route];
  const dueCount = visibleMistakes(s).filter(m => m.due).length;
  const Screen = SCREENS[s.route];

  // New screen, new question or new lesson step: start at the top.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [s.route, s.run?.i, s.les.step]);

  return (
    <AppContext.Provider value={{ s, a, desk }}>
      <div className="app">
        {desk && (
          <nav aria-label="Main" style={{ flex: 'none', width: 232, borderRight: BT, background: 'var(--color-bg)', display: 'flex', flexDirection: 'column', padding: '22px 14px', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 10px 22px' }}>
              <span style={{ width: 22, height: 22, border: '1.5px solid var(--color-accent)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-heading)', fontSize: 13, fontWeight: 600, color: 'var(--color-accent)' }}>G</span>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 21 }}>GMAT Lab</span>
            </div>
            {TABS.map(t => {
              const on = s.tab === t;
              return (
                <button key={t} className="hover-tint" onClick={() => a.go(t)} aria-current={on ? 'page' : undefined} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', border: 0, background: on ? 'var(--color-accent-100)' : 'transparent', color: on ? 'var(--color-accent-700)' : 'var(--muted)', cursor: 'pointer', textAlign: 'left', fontSize: 15, fontWeight: 500 }}>
                  <TabIcon tab={t} size={20} />
                  {tabLabel(t)}
                </button>
              );
            })}
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 6, padding: '14px 12px', border: BT }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 600 }}>
                <FlameIcon />
                {s.streak}-day streak
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>Exam target · April 2027</div>
            </div>
          </nav>
        )}

        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <main ref={scrollRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', paddingTop: desk ? 0 : 'env(safe-area-inset-top)' }}>
            <div style={{ maxWidth: desk ? 1040 : 'none', minHeight: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', padding: desk ? '32px 40px 48px' : full ? '8px 18px 24px' : '14px 18px 28px' }}>
              <Screen />
            </div>
          </main>

          {!desk && !full && (
            <nav aria-label="Main" style={{ flex: 'none', display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', borderTop: BT, background: 'var(--color-bg)', padding: '6px 4px max(22px, env(safe-area-inset-bottom))' }}>
              {TABS.map(t => {
                const on = s.tab === t;
                const badge = t === 'review' && dueCount ? String(dueCount) : '';
                return (
                  <button key={t} onClick={() => a.go(t)} aria-current={on ? 'page' : undefined} aria-label={badge ? `${tabLabel(t)}, ${badge} ${badge === '1' ? 'mistake' : 'mistakes'} due` : undefined} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '6px 0', border: 0, background: 'transparent', color: on ? 'var(--color-accent-700)' : 'var(--muted)', cursor: 'pointer', position: 'relative' }}>
                    <span style={{ position: 'absolute', top: -7, left: '30%', right: '30%', height: 2, background: on ? 'var(--color-accent)' : 'transparent' }} />
                    <TabIcon tab={t} size={23} />
                    <span style={{ fontSize: 11, fontWeight: 500 }}>{tabLabel(t)}</span>
                    {badge && (
                      <span style={{ position: 'absolute', top: 2, left: '58%', minWidth: 16, height: 16, padding: '0 4px', background: 'var(--color-accent)', color: 'var(--color-bg)', fontSize: 10, fontWeight: 700, display: 'grid', placeItems: 'center' }}>{badge}</span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      </div>
      {showDevPanel && <DevPanel />}
    </AppContext.Provider>
  );
}
