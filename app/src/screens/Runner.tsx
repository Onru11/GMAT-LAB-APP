import type { CSSProperties } from 'react';
import { LETTERS, MISS_REASONS, QUESTIONS } from '../data';
import { fmtTime, useApp, type RunMode } from '../store';
import { ArrowRight, BT, CheckIcon, CloseButton, Corners, Kicker, PrimaryButton, Svg, heading, tabular } from '../components/ui';

const TITLES: Record<RunMode, string> = {
  practice: 'Practice drill', mistakes: 'Mistake review', cr: 'Critical Reasoning set',
  test: 'Quant test · adaptive', review: 'Mistake review', extra: 'Mixed drill',
};
const TARGET_SECONDS = 120;
const pretty = { textWrap: 'pretty' } as CSSProperties;

export function Runner() {
  const { s, a } = useApp();
  const run = s.run;
  if (!run) return null;

  const q = QUESTIONS[run.list[run.i]];
  const test = run.mode === 'test';
  const conf = run.conf;
  const correct = conf && run.sel === q.ans;
  const over = run.sec > TARGET_SECONDS;
  const total = test ? 21 : run.list.length;
  const last = run.i === run.list.length - 1;
  const timer = fmtTime(run.sec);
  const close = () => a.go(test ? 'tests' : run.mode === 'practice' ? 'practice' : run.mode === 'review' ? 'mistakes' : 'today');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'sticky', top: 0, zIndex: 2, background: 'var(--color-bg)', margin: '-4px -4px 0', padding: '4px 4px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <CloseButton onClick={close} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <span style={{ ...heading, fontSize: 17, lineHeight: 1.1 }}>{TITLES[run.mode]}</span>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>
              Question {run.i + 1} of {total}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', padding: '4px 10px', border: `1px solid ${over ? 'var(--bad)' : 'var(--color-divider)'}`, background: over ? 'var(--bad-bg)' : 'var(--color-bg)', transition: 'all .3s' }} aria-label={`Time on question ${timer}`}>
            <span style={{ ...heading, fontSize: 22, lineHeight: 1, ...tabular, color: over ? 'var(--bad)' : 'var(--color-text)' }}>{timer}</span>
            <span style={{ fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: over ? 'var(--bad)' : 'var(--muted)' }}>target 2:00</span>
          </div>
        </div>
        <div style={{ height: 3, background: 'var(--color-divider)' }}>
          <div style={{ height: '100%', width: ((run.i + (conf ? 1 : 0)) / total) * 100 + '%', background: 'var(--color-accent)', transition: 'width .4s' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,420px),1fr))', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span className="tag tag-accent">{q.kind}</span>
            <span className="tag tag-neutral" style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}>{q.topic}</span>
            <span className="tag tag-neutral" style={{ background: 'var(--color-surface)', color: 'var(--muted)' }}>{q.diff}</span>
          </div>

          {q.passage && (
            <div style={{ border: BT, background: 'var(--color-surface)', padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Kicker size={12}>Passage</Kicker>
              <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.6, ...pretty }}>{q.passage}</p>
            </div>
          )}

          {q.table && (
            <table className="table" style={{ border: BT, background: 'var(--color-bg)', ...tabular }}>
              <thead>
                <tr>{q.table.head.map(c => <th key={c}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {q.table.rows.map(row => (
                  <tr key={row[0]}>{row.map((c, i) => <td key={i}>{c}</td>)}</tr>
                ))}
              </tbody>
            </table>
          )}

          <div style={{ fontSize: 17.5, lineHeight: 1.5, fontWeight: 500, ...pretty }}>
            {q.stem.map((part, i) => (
              <span key={i}>
                {part.t}
                {part.s && <sup style={{ fontSize: '.68em' }}>{part.s}</sup>}
              </span>
            ))}
          </div>

          {q.st && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {q.st.map((st, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'baseline', padding: '10px 12px', border: BT, background: 'var(--color-bg)' }}>
                  <span style={{ ...heading, fontSize: 17, color: 'var(--color-accent-700)' }}>({i + 1})</span>
                  <span style={{ fontSize: 17, ...tabular }}>
                    {st.t}
                    <sup style={{ fontSize: '.68em' }}>{st.s}</sup>
                    {st.t2}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} role="radiogroup" aria-label="Answer choices">
            {q.choices.map((text, i) => {
              const sel = run.sel === i;
              const isAns = i === q.ans;
              let border = 'var(--color-divider)', bg = 'var(--color-bg)', badgeBorder = 'var(--color-divider)', badgeBg = 'transparent', badgeInk = 'var(--color-text)', op = 1, anim = 'none';
              if (!conf && sel) {
                border = badgeBorder = badgeBg = 'var(--color-accent)';
                bg = 'var(--color-accent-100)';
                badgeInk = 'var(--color-bg)';
              }
              if (conf) {
                if (isAns) {
                  border = badgeBorder = badgeBg = 'var(--ok)';
                  bg = 'var(--ok-bg)';
                  badgeInk = 'var(--color-bg)';
                  anim = sel ? 'pop .4s ease-out' : 'none';
                } else if (sel) {
                  border = badgeBorder = badgeBg = 'var(--bad)';
                  bg = 'var(--bad-bg)';
                  badgeInk = 'var(--color-bg)';
                  anim = 'shake .3s';
                } else op = 0.5;
              }
              return (
                <button
                  key={i}
                  role="radio"
                  aria-checked={sel}
                  className="press-choice"
                  onClick={() => a.select(i)}
                  style={{ display: 'flex', gap: 12, alignItems: 'flex-start', width: '100%', textAlign: 'left', padding: '11px 12px', border: `1px solid ${border}`, background: bg, opacity: op, color: 'var(--color-text)', cursor: conf ? 'default' : 'pointer', transition: 'background .15s,border-color .15s,opacity .3s', animation: anim }}
                >
                  <span style={{ flex: 'none', width: 30, height: 30, display: 'grid', placeItems: 'center', border: `1px solid ${badgeBorder}`, background: badgeBg, color: badgeInk, ...heading, fontSize: 16, transition: 'all .15s' }}>{LETTERS[i]}</span>
                  <span style={{ flex: 1, fontSize: 15, lineHeight: 1.45, paddingTop: 4 }}>{text}</span>
                  {conf && isAns && <CheckIcon size={20} stroke="var(--ok)" animated duration={0.4} style={{ flex: 'none', marginTop: 5 }} />}
                  {conf && sel && !isAns && (
                    <Svg size={20} stroke="var(--bad)" width={2} style={{ flex: 'none', marginTop: 5 }}>
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </Svg>
                  )}
                </button>
              );
            })}
          </div>

          {!conf && (
            <PrimaryButton onClick={a.confirm} style={{ height: 50, fontSize: 17, opacity: run.sel == null ? 0.45 : 1, marginTop: 4 }}>
              {test ? (last ? 'Confirm & finish' : 'Confirm & next') : 'Confirm'}
            </PrimaryButton>
          )}
        </div>

        {conf && !test && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'rise .35s ease-out' }}>
            {correct ? (
              <>
                <div role="status" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, background: 'var(--ok-bg)', border: '1px solid var(--ok)', animation: 'pop .45s cubic-bezier(.2,.8,.2,1)' }}>
                  <span style={{ flex: 'none', width: 40, height: 40, display: 'grid', placeItems: 'center', background: 'var(--ok)', color: 'var(--color-bg)' }}>
                    <CheckIcon size={22} width={2.2} animated duration={0.4} delay={0.1} />
                  </span>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ ...heading, fontSize: 22, lineHeight: 1.1, color: 'var(--ok)' }}>Correct · {timer}</span>
                    <span style={{ fontSize: 13 }}>{over ? 'Right, but over target. Try the fastest method below.' : 'Under the 2:00 target.'}</span>
                  </div>
                  <span style={{ ...heading, fontSize: 15, color: 'var(--ok)' }}>{s.inRow >= 2 ? `${s.inRow} in a row` : ''}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, padding: '0 2px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted)' }}>
                    <span>{q.topic} · toward Solid ~600</span>
                    <span>4 of 6</span>
                  </div>
                  <div style={{ height: 5, background: 'var(--color-divider)', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, width: '50%', background: 'var(--color-accent)' }} />
                    <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '16.7%', background: 'var(--ok)', transformOrigin: 'left', animation: 'grow .6s .35s both' }} />
                  </div>
                </div>
              </>
            ) : (
              <div role="status" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, background: 'var(--bad-bg)', border: '1px solid var(--bad)' }}>
                <span style={{ flex: 'none', width: 40, height: 40, display: 'grid', placeItems: 'center', border: '1.5px solid var(--bad)', color: 'var(--bad)', ...heading, fontSize: 20 }}>{LETTERS[q.ans]}</span>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ ...heading, fontSize: 22, lineHeight: 1.1, color: 'var(--bad)' }}>Not this time · {timer}</span>
                  <span style={{ fontSize: 13 }}>The answer is {LETTERS[q.ans]}. It’s saved to Mistakes and comes back tomorrow.</span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Kicker>Solution</Kicker>
              {q.steps.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ flex: 'none', width: 24, height: 24, display: 'grid', placeItems: 'center', border: BT, ...heading, fontSize: 14 }}>{i + 1}</span>
                  <span style={{ fontSize: 15, lineHeight: 1.5, paddingTop: 1, ...pretty }}>{t}</span>
                </div>
              ))}
            </div>

            <div className="blueprint" style={{ background: 'var(--color-accent-100)', borderColor: 'var(--color-accent)', padding: 14, display: 'flex', gap: 12 }}>
              <Corners />
              <Svg size={20} stroke="var(--color-accent-700)" style={{ flex: 'none', marginTop: 2 }}>
                <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
              </Svg>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Kicker color="var(--color-accent-700)">Fastest method</Kicker>
                <span style={{ fontSize: 15, lineHeight: 1.5, ...pretty }}>{q.fast}</span>
              </div>
            </div>

            {!correct && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ ...heading, fontSize: 18 }}>Why did you miss it?</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {MISS_REASONS.map(label => {
                    const on = run.reason === label;
                    return (
                      <button key={label} className="hover-edge" aria-pressed={on} onClick={() => a.setReason(label)} style={{ padding: '8px 12px', border: `1px solid ${on ? 'var(--color-accent)' : 'var(--color-divider)'}`, background: on ? 'var(--color-accent)' : 'var(--color-bg)', color: on ? 'var(--color-bg)' : 'var(--color-text)', fontSize: 14, cursor: 'pointer', display: 'flex', gap: 6, alignItems: 'center' }}>
                        {label}
                      </button>
                    );
                  })}
                </div>
                {run.reason && <span style={{ fontSize: 13, color: 'var(--muted)', animation: 'rise .2s ease-out' }}>Tagged. You’ll see it again in 1 day, then 3, 7 and 14.</span>}
              </div>
            )}

            {run.alt && (
              <div style={{ padding: 14, border: '1px dashed var(--color-divider)', fontSize: 15, lineHeight: 1.55, animation: 'rise .25s ease-out', ...pretty }}>
                <Kicker style={{ display: 'block', marginBottom: 4 }}>Another way</Kicker>
                {q.alt}
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" onClick={a.toggleAlt} style={{ flex: 1, minWidth: 150, height: 50, fontSize: 15 }}>
                {run.alt ? 'Hide other way' : 'Explain it another way'}
              </button>
              <PrimaryButton onClick={a.runNext} style={{ flex: 1.3, minWidth: 150, height: 50, fontSize: 17, gap: 6 }}>
                {last ? 'Finish' : 'Next question'}
                <ArrowRight />
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
