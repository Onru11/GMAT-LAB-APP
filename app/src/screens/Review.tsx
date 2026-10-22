import type { CSSProperties } from 'react';
import { DECKS } from '../data';
import { useApp, visibleMistakes } from '../store';
import { BT, Corners, H2, PageHeader, heading, rowTop } from '../components/ui';

export function Review() {
  const { s, a } = useApp();
  const mistakes = visibleMistakes(s);
  const dueCount = mistakes.filter(m => m.due).length;
  const flashDueTotal = s.nothingDue ? 0 : DECKS.reduce((n, d) => n + d.due, 0);
  const tile = { display: 'flex', flexDirection: 'column', gap: 6, padding: 14, background: 'var(--color-bg)', color: 'var(--color-text)', textAlign: 'left', cursor: 'pointer' } as const;
  const big = { ...heading, fontSize: 34, lineHeight: 1 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader kicker="Repetition does the heavy lifting" title="Review" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <button onClick={() => a.go('mistakes')} className="blueprint hover-edge" style={tile}>
          <Corners />
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>Mistakes</span>
          <span style={big}>
            {dueCount}
            <span style={{ fontSize: 15, color: 'var(--muted)', fontWeight: 400 }}> due</span>
          </span>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>{mistakes.length} open · 14 cleared</span>
        </button>
        <button onClick={() => a.startSprint('review')} className="blueprint hover-edge" style={tile}>
          <Corners />
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>Mental sprint</span>
          <span style={big}>2:41</span>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>Best · 20 items · no calculator</span>
        </button>
      </div>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <H2>Flashcards</H2>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>{flashDueTotal} due today</span>
        </div>
        {s.nothingDue && (
          <div style={{ padding: '22px 16px', border: '1px dashed var(--color-divider)', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
            <span style={{ ...heading, fontSize: 22 }}>All caught up</span>
            <span style={{ fontSize: 14, color: 'var(--muted)', textWrap: 'pretty' } as CSSProperties}>Nothing is due. 14 cards come back tomorrow. Learning ahead weakens spacing, so rest here or run a sprint.</span>
            <button className="btn btn-secondary" onClick={() => a.startSprint('review')} style={{ marginTop: 6 }}>
              Run a mental sprint
            </button>
          </div>
        )}
        <div style={{ border: BT, background: 'var(--color-bg)' }}>
          {DECKS.map((d, i) => {
            const due = s.nothingDue ? 0 : d.due;
            const sample = d.cards[0][0].length > 5 ? d.cards[0][0].slice(0, 4) : d.cards[0][0];
            return (
              <button key={d.name} className="hover-tint" onClick={() => a.openDeck(i)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: 0, borderTop: rowTop(i), background: 'transparent', color: 'var(--color-text)', textAlign: 'left', cursor: 'pointer' }}>
                <span style={{ flex: 'none', width: 44, height: 32, display: 'grid', placeItems: 'center', border: BT, ...heading, fontSize: 15 }}>{sample}</span>
                <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 500, fontSize: 15 }}>{d.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>{d.cards.length} cards · box 1–4</span>
                </span>
                <span style={{ ...heading, fontSize: 17, color: due ? 'var(--color-accent-700)' : 'var(--ok)' }} aria-label={due ? `${due} due` : 'Nothing due'}>
                  {due ? due : '✓'}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
