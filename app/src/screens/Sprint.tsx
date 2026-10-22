import { SPRINT } from '../data';
import { fmtTime, useApp } from '../store';
import { BT, CloseButton, Corners, FocusTitle, H2, PrimaryButton, ProgressLine, heading, tabular } from '../components/ui';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'ok'];
const KEY_LABEL: Record<string, string> = { del: '⌫', ok: '✓' };
const KEY_ARIA: Record<string, string> = { del: 'Delete', ok: 'Submit' };

export function Sprint() {
  const { s, a } = useApp();
  const P = s.sp;
  const right = P.ans.filter(x => x.ok).length;
  const missed = P.ans.filter(x => !x.ok);
  const timer = fmtTime(P.sec);
  const fromToday = P.from === 'today';
  const flashColor = P.flash === 'ok' ? 'var(--ok)' : P.flash === 'bad' ? 'var(--bad)' : null;
  const bigStat = { ...heading, fontSize: 40, lineHeight: 1 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <CloseButton onClick={() => a.go(fromToday ? 'today' : 'review')} />
        <FocusTitle title="Mental maths sprint" meta={P.done ? 'Finished' : `Item ${P.i + 1} of ${SPRINT.length}`} />
        <span style={{ ...heading, fontSize: 24, ...tabular }}>{timer}</span>
      </div>
      <ProgressLine pct={(P.ans.length / SPRINT.length) * 100} transition="width .2s" />

      {!P.done ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ flex: 1, minHeight: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: P.flash === 'ok' ? 'var(--ok-bg)' : P.flash === 'bad' ? 'var(--bad-bg)' : 'var(--color-bg)', transition: 'background .25s', border: `1px solid ${flashColor ?? 'var(--color-divider)'}` }}>
            <span style={{ ...heading, fontSize: 64, lineHeight: 1, ...tabular, letterSpacing: '-.01em', textAlign: 'center' }}>{SPRINT[P.i][0]}</span>
            <span aria-live="polite" style={{ minWidth: 180, height: 70, padding: '0 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: `2px solid ${P.input ? 'var(--color-accent)' : 'var(--color-divider)'}`, ...heading, fontSize: 52, ...tabular, color: 'var(--color-accent-700)' }}>
              {P.input || ' '}
            </span>
            <span role="status" style={{ height: 20, fontSize: 14, fontWeight: 500, color: P.flash === 'ok' ? 'var(--ok)' : 'var(--bad)' }}>{P.msg}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
            {KEYS.map(k => {
              const ok = k === 'ok';
              return (
                <button key={k} className="press-key" aria-label={KEY_ARIA[k]} onClick={() => a.sprintKey(k)} style={{ height: 58, border: `1px solid ${ok ? 'var(--color-accent)' : 'var(--color-divider)'}`, background: ok ? 'var(--color-accent)' : 'var(--color-bg)', color: ok ? 'var(--color-bg)' : 'var(--color-text)', ...heading, fontSize: 26, cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                  {KEY_LABEL[k] ?? k}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, animation: 'rise .3s ease-out' }}>
          <section className="blueprint" style={{ background: 'var(--color-bg)', padding: 20, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            <Corners />
            <div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>Score</div>
              <div style={bigStat}>{right}/20</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>Time</div>
              <div style={bigStat}>{timer}</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>Per item</div>
              <div style={bigStat}>{P.ans.length ? Math.round(P.sec / P.ans.length) : 0}s</div>
            </div>
            <div style={{ gridColumn: '1/-1', fontSize: 13, color: 'var(--muted)' }}>{s.sprintBest != null ? `Best ${fmtTime(s.sprintBest)}` : 'Your first clean run sets your best'} · aim for under 6s per item before exam day.</div>
          </section>
          <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <H2>Facts you missed</H2>
            {!missed.length && <div style={{ padding: 14, border: '1px dashed var(--color-divider)', fontSize: 14, color: 'var(--muted)' }}>None. Clean sprint.</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {missed.map(m => (
                <div key={m.p} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '10px 14px', border: BT, background: 'var(--color-bg)', ...tabular }}>
                  <span style={{ ...heading, fontSize: 21 }}>
                    {m.p} = {m.a}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--bad)' }}>you: {m.g}</span>
                </div>
              ))}
            </div>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>Missed facts are added to your flashcards.</span>
          </section>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" onClick={() => a.startSprint(P.from)} style={{ flex: 1, height: 50, fontSize: 16 }}>
              Run again
            </button>
            <PrimaryButton onClick={a.sprintFinish} style={{ flex: 1, height: 50, fontSize: 16 }}>
              {fromToday ? 'Back to Today' : 'Done'}
            </PrimaryButton>
          </div>
        </div>
      )}
    </div>
  );
}
