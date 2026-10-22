import { useState } from 'react';
import { useApp, type JumpKey } from '../store';

// Review aid carried over from the Claude Design prototype: jump straight to
// any named state, flip the theme and move the target score. Open the app
// with ?dev to show it.
const GROUPS: [group: string, items: [label: string, key: JumpKey][]][] = [
  ['Today', [['Start of day', 'today'], ['Mid-session', 'todayMid'], ['Session complete', 'todayDone']]],
  ['Learn', [['Study path', 'learn'], ['Lesson · rule', 'lessonRule'], ['Lesson · worked example', 'lessonEx'], ['Lesson · trap', 'lessonTrap'], ['Lesson · guided question', 'lessonQ'], ['Lesson · wrong answer', 'lessonWrong']]],
  ['Practice', [['Topics & toolkit', 'practice'], ['Runner · unanswered', 'runQ'], ['Runner · correct', 'runOk'], ['Runner · wrong (DS)', 'runBad'], ['Runner · CR, over time', 'runOver'], ['Runner · data table', 'runTable'], ['Tests menu', 'tests'], ['Test in progress', 'testRun'], ['Test results', 'results']]],
  ['Review', [['Review hub', 'review'], ['Nothing due (empty)', 'reviewEmpty'], ['Flashcard · front', 'flash'], ['Flashcard · flipped', 'flashFlip'], ['Flashcard · typed', 'flashType'], ['Sprint', 'sprint'], ['Sprint · end', 'sprintEnd'], ['Mistakes', 'mistakes'], ['Mistakes · none due', 'mistakesEmpty']]],
  ['Progress', [['Score history', 'progress'], ['No scores yet (empty)', 'progressEmpty']]],
];

export function DevPanel() {
  const { s, a } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'fixed', right: 12, bottom: 96, zIndex: 50, fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
      {open && (
        <div style={{ width: 260, maxHeight: '70vh', overflowY: 'auto', marginBottom: 8, padding: 14, background: 'var(--color-bg)', border: '1px solid var(--color-divider)', boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => a.setTheme(s.theme === 'dark' ? 'light' : 'dark')}>
              {s.theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={a.loadSample}>
              Sample data
            </button>
            <button className="btn btn-secondary" style={{ flex: 1, color: 'var(--bad)' }} onClick={() => confirm('Erase all saved progress?') && a.resetProgress()}>
              Reset progress
            </button>
          </div>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: 'var(--muted)' }}>
            Target score · {s.target}
            <input type="range" min={605} max={805} step={5} value={s.target} onChange={e => a.setTarget(Number(e.target.value))} />
          </label>
          {GROUPS.map(([group, items]) => (
            <div key={group} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', padding: '2px 0' }}>{group}</div>
              {items.map(([label, key]) => (
                <button key={key} className="hover-tint" onClick={() => a.jump(key)} style={{ textAlign: 'left', padding: '5px 8px', border: 0, background: 'transparent', cursor: 'pointer', fontSize: 13, color: 'var(--color-text)' }}>
                  {label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
      <button className="btn btn-secondary" onClick={() => setOpen(o => !o)} style={{ marginLeft: 'auto', display: 'flex', background: 'var(--color-bg)', boxShadow: 'var(--shadow-md)' }}>
        {open ? 'Close states' : 'States'}
      </button>
    </div>
  );
}
