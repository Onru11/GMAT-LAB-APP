import { Fragment, type CSSProperties } from 'react';
import { addDays, daysBetween } from '../progress';
import { useApp, visibleMistakes, type VisibleMistake } from '../store';
import { BT, BackLink, CheckIcon, H2, Kicker, PrimaryButton, heading, rowTop } from '../components/ui';

const INTERVALS = ['1d', '3d', '7d', '14d'];
const pill: CSSProperties = { fontSize: 12, padding: '3px 8px', fontWeight: 600 };

export function Mistakes() {
  const { s, a } = useApp();
  const mistakes = visibleMistakes(s);
  const due = mistakes.filter(m => m.due);
  const groups = new Map<string, VisibleMistake[]>();
  const tomorrow = mistakes.filter(m => m.next === addDays(s.day, 1)).length;
  mistakes.forEach(m => groups.set(m.topic, [...(groups.get(m.topic) ?? []), m]));

  const counters: [string, number, string][] = [
    ['Open', mistakes.length, 'var(--color-text)'],
    ['Due now', due.length, due.length ? 'var(--color-accent-700)' : 'var(--ok)'],
    ['Cleared', s.cleared.length, 'var(--ok)'],
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <BackLink onClick={() => a.go('review')}>Review</BackLink>
      <h1 style={{ margin: 0, fontSize: 36, lineHeight: 1 }}>Mistakes</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', border: BT, background: 'var(--color-bg)' }}>
        {counters.map(([name, n, color], i) => (
          <div key={name} style={{ padding: '12px 14px', borderLeft: rowTop(i), display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>{name}</span>
            <span style={{ ...heading, fontSize: 34, lineHeight: 1.05, color }}>{n}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 14, border: '1px dashed var(--color-divider)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ ...pill, background: 'var(--bad-bg)', color: 'var(--bad)' }}>Miss</span>
          {INTERVALS.map(iv => (
            <Fragment key={iv}>
              <span style={{ flex: 1, height: 1, background: 'var(--color-divider)' }} />
              <span style={{ ...heading, fontSize: 15, padding: '2px 7px', border: BT }}>{iv}</span>
            </Fragment>
          ))}
          <span style={{ flex: 0.6, height: 1, background: 'var(--color-divider)' }} />
          <span style={{ ...pill, background: 'var(--ok-bg)', color: 'var(--ok)' }}>Cleared</span>
        </div>
        <span style={{ fontSize: 14, textWrap: 'pretty' } as CSSProperties}>Each miss returns after 1, 3, 7 and 14 days. Four clean answers in a row clear it; a slip sends it back to day 1.</span>
      </div>

      {due.length > 0 ? (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <H2>Due now</H2>
          <div style={{ border: BT, background: 'var(--color-bg)' }}>
            {due.map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderTop: rowTop(i) }}>
                <span style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 500 }}>{m.title}</span>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                    {m.topic} · {m.reason}
                  </span>
                </span>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>Review {m.box + 1} of 4</span>
              </div>
            ))}
          </div>
          <PrimaryButton onClick={() => a.startRun('review', due.map(m => m.qid))} style={{ height: 48, fontSize: 16 }}>
            Review {due.length} due · about {Math.max(2, due.length * 2)} min
          </PrimaryButton>
        </section>
      ) : (
        <div style={{ padding: '24px 16px', border: '1px dashed var(--color-divider)', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
          <span style={{ width: 40, height: 40, display: 'grid', placeItems: 'center', border: '1px solid var(--ok)', color: 'var(--ok)' }}>
            <CheckIcon size={22} width={1.5} />
          </span>
          <span style={{ ...heading, fontSize: 22 }}>Nothing due right now</span>
          <span style={{ fontSize: 14, color: 'var(--muted)', textWrap: 'pretty' } as CSSProperties}>{tomorrow ? `${tomorrow} ${tomorrow === 1 ? 'mistake comes' : 'mistakes come'} back tomorrow. ` : ''}Misses from your drills and tests appear here automatically.</span>
        </div>
      )}

      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <H2>All open · by topic</H2>
        {[...groups].map(([topic, items]) => (
          <div key={topic} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Kicker style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{topic}</span>
              <span>{items.length}</span>
            </Kicker>
            {items.map((m, i) => {
              const days = Math.max(1, daysBetween(s.day, m.next));
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 14px', border: BT, background: 'var(--color-bg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 500 }}>{m.title}</span>
                    <span style={{ fontSize: 12, color: m.due ? 'var(--color-accent-700)' : 'var(--muted)', whiteSpace: 'nowrap' }}>{m.due ? 'Due now' : `Back in ${days} ${days === 1 ? 'day' : 'days'}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                    <span className="tag" style={{ background: 'var(--color-surface)', color: 'var(--color-text)', border: BT }}>{m.reason}</span>
                    <span style={{ display: 'flex', gap: 3 }} title="Clean answers" aria-label={`${m.box} of 4 clean answers`}>
                      {[0, 1, 2, 3].map(j => (
                        <span key={j} style={{ width: 14, height: 6, background: j < m.box ? 'var(--ok)' : 'var(--color-divider)' }} />
                      ))}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </section>
    </div>
  );
}
