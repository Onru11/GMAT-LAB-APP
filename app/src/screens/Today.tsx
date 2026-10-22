import type { CSSProperties } from 'react';
import { QUEUE, SECTION_ESTIMATES } from '../data';
import { mixedDrill } from '../content/select';
import { useApp, visibleMistakes } from '../store';
import { ArrowRight, BT, CheckIcon, Corners, DoneBadge, FlameIcon, H2, Kicker, heading, rowTop, tabular } from '../components/ui';

const dateLabel = (d = new Date()) =>
  d.toLocaleDateString('en-US', { weekday: 'long' }) + ' · ' + d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const pct = (v: number) => Math.max(0, Math.min(100, ((v - 205) / 600) * 100)) + '%';
const BASELINE = 375;

export function Today() {
  const { s, a, desk } = useApp();
  const lastOfficial = s.noScores ? null : s.scores[s.scores.length - 1];
  const estTotal = lastOfficial ? lastOfficial.total + 10 : 455;
  const toGo = Math.max(0, s.target - estTotal);
  const nextIdx = s.queue.findIndex(d => !d);
  const allDone = nextIdx === -1;
  const due = visibleMistakes(s).filter(m => m.due);
  const dueCount = due.length;
  const dueTopics = [...new Set(due.map(m => m.topic))].join(', ');
  const queue = QUEUE.map((q, i) =>
    i !== 3 ? q : { ...q, meta: dueCount ? `${dueCount} due · ${dueTopics}` : 'Nothing due today', why: dueCount ? `${dueCount === 1 ? 'One miss is' : dueCount + ' misses are'} due today. Clean answers move them toward cleared.` : 'Nothing is due, so this one is a quick check-off.' },
  );
  const next = queue[allDone ? 0 : nextIdx];
  const doneCount = s.queue.filter(Boolean).length;

  const quickTile: CSSProperties = { textAlign: 'left', padding: 14, border: BT, background: 'var(--color-bg)', color: 'var(--color-text)', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 2 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <Kicker>{dateLabel()}</Kicker>
          <h1 style={{ margin: '2px 0 0', fontSize: 38, lineHeight: 1 }}>Today</h1>
        </div>
        {!desk && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', border: BT, background: 'var(--color-bg)', ...heading, fontSize: 18 }} aria-label={`${s.streak}-day streak`}>
            <FlameIcon size={17} />
            {s.streak}
          </div>
        )}
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,380px),1fr))', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <section className="blueprint" style={{ background: 'var(--color-bg)', padding: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Corners />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div>
                <Kicker>Estimated score</Kicker>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ ...heading, ...tabular, fontSize: 64, lineHeight: 1, letterSpacing: '-.02em' }}>{estTotal}</span>
                  <span style={{ fontSize: 14, color: 'var(--muted)' }}>of 805</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Kicker>To target</Kicker>
                <div style={{ ...heading, fontSize: 28, lineHeight: 1.1, color: 'var(--color-accent-700)' }}>+{toGo}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 14 }}>
              <div style={{ position: 'relative', height: 10, border: BT, background: 'var(--color-surface)' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: pct(estTotal), background: 'var(--color-accent)', transformOrigin: 'left', animation: 'grow .8s cubic-bezier(.2,.7,.2,1)' }} />
                <div style={{ position: 'absolute', left: pct(BASELINE), top: -3, bottom: -3, width: 1, background: 'var(--muted)' }} />
                <div style={{ position: 'absolute', left: pct(s.target), top: -16, bottom: -5, width: 2, background: 'var(--color-text)' }} />
                <div style={{ position: 'absolute', left: pct(s.target), top: -19, transform: 'translateX(6px)', ...heading, fontSize: 13, lineHeight: 1 }}>{s.target}</div>
              </div>
              <div style={{ position: 'relative', height: 16, fontSize: 11, color: 'var(--muted)', ...tabular }}>
                <span style={{ position: 'absolute', left: 0 }}>205</span>
                <span style={{ position: 'absolute', left: pct(BASELINE), transform: 'translateX(-50%)' }}>Start {BASELINE}</span>
                <span style={{ position: 'absolute', right: 0 }}>805</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', borderTop: BT }}>
              {SECTION_ESTIMATES.map(([name, val, base], i) => (
                <div key={name} style={{ padding: '12px 0 0', display: 'flex', flexDirection: 'column', gap: 4, borderLeft: rowTop(i), paddingLeft: i ? 12 : 0 }}>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ ...heading, ...tabular, fontSize: 28, lineHeight: 1 }}>{val}</span>
                    <span style={{ fontSize: 12, color: 'var(--ok)', fontWeight: 500 }}>+{val - base}</span>
                  </div>
                  <div style={{ height: 3, background: 'var(--color-divider)', marginRight: 12 }}>
                    <div style={{ height: '100%', width: ((val - 60) / 30) * 100 + '%', background: 'var(--color-accent)' }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{lastOfficial ? `From your last official exam (${lastOfficial.total}) and recent drill answers.` : 'From drills only until you log an official exam.'} Sections scale 60–90.</div>
          </section>

          {desk && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <button className="hover-edge" onClick={() => a.go('mistakes')} style={quickTile}>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>Mistakes due</span>
                <span style={{ ...heading, fontSize: 26 }}>{dueCount}</span>
              </button>
              <button className="hover-edge" onClick={() => a.go('progress')} style={quickTile}>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>Weakest topic</span>
                <span style={{ ...heading, fontSize: 22 }}>Rates &amp; work · 49%</span>
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {!allDone ? (
            <section className="blueprint" style={{ background: 'var(--hl)', color: 'var(--hl-ink)', padding: 18, display: 'flex', flexDirection: 'column', gap: 12, borderColor: 'color-mix(in srgb,var(--hl-ink) 25%,transparent)' }}>
              <Corners />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-heading)', fontSize: 13, letterSpacing: '.12em', textTransform: 'uppercase' }}>
                <span>Do this next</span>
                <span>About {next.min} min</span>
              </div>
              <div>
                <div style={{ ...heading, fontSize: 30, lineHeight: 1.05 }}>{next.title}</div>
                <div style={{ fontSize: 14, marginTop: 4, opacity: 0.82 }}>{next.meta}</div>
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.45, textWrap: 'pretty' } as CSSProperties}>{next.why}</div>
              <button className="btn btn-primary" onClick={() => a.queueGo(nextIdx)} style={{ height: 48, fontSize: 17, borderColor: '#1d1f20', background: '#1d1f20', color: '#FFE9A3', gap: 8 }}>
                Start {next.verb}
                <ArrowRight />
              </button>
            </section>
          ) : (
            <section className="blueprint" style={{ background: 'var(--color-bg)', padding: '22px 18px', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start', animation: 'pop .5s ease-out' }}>
              <Corners />
              <DoneBadge size={52} icon={28} delay={0.2} />
              <div>
                <div style={{ ...heading, fontSize: 32, lineHeight: 1 }}>Session complete</div>
                <div style={{ fontSize: 14, color: 'var(--muted)', marginTop: 4 }}>28 min · 5 of 5 done · streak now {s.streak} days</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', width: '100%', borderTop: BT, paddingTop: 12, gap: 8 }}>
                {[['Accuracy', '78%'], ['Cards', '12'], ['Cleared', '1']].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{k}</div>
                    <div style={{ ...heading, fontSize: 24 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.45 }}>Tomorrow: lesson “Watch the question word”, 14 cards and 2 mistakes come back.</div>
              <button className="btn btn-secondary" onClick={() => a.startRun('extra', mixedDrill(5, Date.now()))} style={{ height: 44, fontSize: 15, width: '100%' }}>
                Optional: 5-question mixed drill
              </button>
            </section>
          )}

          <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <H2>Today’s queue</H2>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>{doneCount} of 5 done · ~28 min</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', border: BT, background: 'var(--color-bg)' }}>
              {queue.map((q, i) => {
                const done = s.queue[i];
                const cur = i === nextIdx;
                return (
                  <button
                    key={q.title}
                    className="hover-tint"
                    onClick={() => a.queueGo(i)}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, border: 0, borderTop: rowTop(i), background: cur ? 'color-mix(in srgb,var(--hl) 28%,var(--color-bg))' : 'transparent', color: 'var(--color-text)', textAlign: 'left', cursor: 'pointer' }}
                  >
                    <span style={{ flex: 'none', width: 30, height: 30, display: 'grid', placeItems: 'center', border: `1px solid ${done ? 'var(--ok)' : cur ? 'var(--color-text)' : 'var(--color-divider)'}`, background: done ? 'var(--ok)' : 'transparent', color: done ? 'var(--color-bg)' : 'var(--color-text)', ...heading, fontSize: 15 }}>
                      {done ? <CheckIcon /> : i + 1}
                    </span>
                    <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 500, fontSize: 15, color: done ? 'var(--muted)' : 'var(--color-text)', textDecoration: done ? 'line-through' : 'none' }}>{q.title}</span>
                      <span style={{ fontSize: 13, color: 'var(--muted)' }}>{q.meta}</span>
                    </span>
                    {cur && (
                      <span className="tag" style={{ background: 'var(--hl)', color: 'var(--hl-ink)', fontWeight: 600 }}>
                        Next
                      </span>
                    )}
                    <span style={{ flex: 'none', fontSize: 13, color: 'var(--muted)', ...tabular }}>{q.min}m</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
