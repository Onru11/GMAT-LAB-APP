import { LEITNER_BOXES } from '../data';
import { cardKey, knownInterval } from '../progress';
import { allDecks, currentCard, useApp } from '../store';
import { CloseButton, Corners, DoneBadge, FocusTitle, MiniSegment, PrimaryButton, ProgressLine, heading, tabular } from '../components/ui';

const face = { position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } as const;

export function Flashcards() {
  const { s, a } = useApp();
  const deck = allDecks(s)[s.deck];
  const F = s.fl;
  const total = F.cards.length;
  const state = s.cards[cardKey(deck.name, currentCard(s)[0])];
  // Cards per Leitner box for this deck; unseen cards sit in box 1.
  const boxes = [0, 0, 0, 0];
  deck.cards.forEach(c => boxes[s.cards[cardKey(deck.name, c[0])]?.box ?? 0]++);
  const days = knownInterval(state);
  const [front, back] = currentCard(s);
  const isType = F.mode === 'type';
  const fromToday = F.from === 'today';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <CloseButton onClick={() => a.go(fromToday ? 'today' : 'review')} />
        <FocusTitle title={deck.name} meta={`Card ${F.i + 1} of ${total}`} />
        <MiniSegment options={[['Learn', 'learn'], ['Type', 'type']]} value={F.mode} onChange={a.setFlashMode} />
      </div>
      <ProgressLine pct={((F.i + (F.done ? 1 : 0)) / total) * 100} />

      {!F.done ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, flex: 1 }}>
          <button onClick={a.flip} aria-label={F.flipped ? `${front} equals ${back}. Tap to flip back` : `${front}. Tap to flip`} style={{ position: 'relative', height: 300, border: 0, padding: 0, background: 'transparent', perspective: 1200, cursor: 'pointer', color: 'var(--color-text)' }}>
            <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transition: 'transform .5s cubic-bezier(.3,.7,.3,1)', transform: F.flipped ? 'rotateY(180deg)' : 'none' }}>
              <div className="blueprint" style={{ ...face, background: 'var(--color-bg)', gap: 10 }}>
                <Corners />
                <span style={{ ...heading, fontSize: front.length > 6 ? 44 : 96, lineHeight: 1, ...tabular, textAlign: 'center', padding: '0 16px' }}>{front}</span>
                <span style={{ position: 'absolute', bottom: 14, fontSize: 13, color: 'var(--muted)' }}>{isType ? 'Type the answer below' : 'Tap to flip'}</span>
              </div>
              <div className="blueprint" style={{ ...face, transform: 'rotateY(180deg)', background: 'var(--color-accent-100)', borderColor: 'var(--color-accent)', gap: 8 }}>
                <Corners />
                <span style={{ fontSize: 15, color: 'var(--muted)', fontFamily: 'var(--font-heading)' }}>{front} =</span>
                <span style={{ ...heading, fontSize: back.length > 6 ? 40 : 88, lineHeight: 1, ...tabular, color: 'var(--color-accent-800)', textAlign: 'center', padding: '0 16px' }}>{back}</span>
              </div>
            </div>
          </button>

          {isType && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                value={F.input}
                aria-label="Your answer"
                onChange={e => a.flashInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && a.flashMain()}
                placeholder="Type the answer"
                style={{ height: 58, padding: '0 16px', border: `1.5px solid ${!F.checked ? 'var(--color-divider)' : F.ok ? 'var(--ok)' : 'var(--bad)'}`, background: 'var(--color-bg)', color: 'var(--color-text)', ...heading, fontSize: 28, textAlign: 'center', outline: 'none', animation: F.checked && !F.ok ? 'shake .3s' : 'none' }}
              />
              {F.checked && (
                <div role="status" style={{ textAlign: 'center', ...heading, fontSize: 18, color: F.ok ? 'var(--ok)' : 'var(--bad)', animation: 'pop .3s ease-out' }}>
                  {F.ok ? 'Right · ' + back : 'Answer: ' + back}
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
            {LEITNER_BOXES.map((days, i) => (
              <div key={days} style={{ padding: 8, border: `1px solid ${i === 0 ? 'var(--color-accent)' : 'var(--color-divider)'}`, background: 'var(--color-bg)', display: 'flex', flexDirection: 'column', gap: 2, transition: 'border-color .3s' }}>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                  Box {i + 1} · {days}
                </span>
                <span style={{ ...heading, fontSize: 20, lineHeight: 1, ...tabular }}>{boxes[i]}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: -10 }}>Leitner boxes. A known card moves right and comes back later; a miss drops to box 1.</div>

          <div style={{ marginTop: 'auto', display: 'flex', gap: 10 }}>
            {!isType && F.flipped ? (
              <>
                <button className="btn btn-secondary" onClick={() => a.flashGrade(false)} style={{ flex: 1, height: 52, fontSize: 16, color: 'var(--bad)', borderColor: 'var(--bad)' }}>
                  Again · 1 day
                </button>
                <PrimaryButton onClick={() => a.flashGrade(true)} style={{ flex: 1, height: 52, fontSize: 16 }}>
                  Got it · {days} {days === 1 ? 'day' : 'days'}
                </PrimaryButton>
              </>
            ) : (
              <PrimaryButton onClick={a.flashMain} style={{ flex: 1, height: 52, fontSize: 17 }}>
                {isType ? (F.checked ? 'Next card' : 'Check') : 'Show answer'}
              </PrimaryButton>
            )}
          </div>
        </div>
      ) : (
        <section className="blueprint" style={{ background: 'var(--color-bg)', padding: 22, display: 'flex', flexDirection: 'column', gap: 12, animation: 'pop .45s ease-out' }}>
          <Corners />
          <DoneBadge />
          <div style={{ ...heading, fontSize: 28, lineHeight: 1 }}>Deck done</div>
          <div style={{ fontSize: 15 }}>
            {F.known} of {total} known. Misses come back tomorrow; the rest in 1 to 14 days, depending on their box.
          </div>
          <PrimaryButton onClick={a.flashFinish} style={{ height: 48, fontSize: 16, marginTop: 6 }}>
            {fromToday ? 'Back to Today' : 'Back to Review'}
          </PrimaryButton>
        </section>
      )}
    </div>
  );
}

