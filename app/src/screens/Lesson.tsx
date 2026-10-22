import type { CSSProperties } from 'react';
import { LESSON_STEPS, LETTERS } from '../data';
import { LESSON_BY_ID, lessonsFor } from '../content/lessons/curriculum';
import { useApp } from '../store';
import { ChevronLeft, CloseButton, Corners, DoneBadge, Kicker, PrimaryButton, Svg, heading, tabular } from '../components/ui';

const rise: CSSProperties = { animation: 'rise .3s ease-out' };

export function Lesson() {
  const { s, a } = useApp();
  const L = s.les;
  const done = L.step >= LESSON_STEPS;
  const lesson = LESSON_BY_ID[L.id];
  const isQ = L.step === 3 || L.step === 4;
  const gq = isQ ? lesson.guided[L.step - 3] : null;
  const answered = gq ? (gq.kind === 'number' ? L.input.trim() !== '' : L.sel != null) : true;
  const siblings = lessonsFor(lesson.topic);
  const nextInTopic = siblings.find(l => l.order > lesson.order);

  const nextLabel = done ? 'Start adaptive drill' : isQ && !L.checked ? 'Check' : isQ && !L.ok ? 'Try again' : L.step === 4 ? 'Finish lesson' : 'Continue';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <CloseButton onClick={() => a.go(L.from === 'today' ? 'today' : 'learn')} label="Close lesson" />
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 4 }}>
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} style={{ height: 5, transition: 'background .3s', background: i < L.step || done ? 'var(--color-accent)' : i === L.step ? 'var(--color-accent-400)' : 'var(--color-divider)' }} />
          ))}
        </div>
        <span style={{ fontSize: 13, color: 'var(--muted)', ...tabular }}>{done ? 'Done' : `${L.step + 1} / ${LESSON_STEPS}`}</span>
      </div>
      <div>
        <Kicker>
          {lesson.topic} · Lesson {lesson.order} of {siblings.length}
        </Kicker>
        <h1 style={{ margin: '2px 0 0', fontSize: 34, lineHeight: 1.02 }}>{lesson.title}</h1>
      </div>

      {L.step === 0 && (
        <section className="blueprint" style={{ background: 'var(--color-bg)', padding: 18, display: 'flex', flexDirection: 'column', gap: 10, ...rise }}>
          <Corners />
          <Kicker color="var(--color-accent-700)">The rule</Kicker>
          <div style={{ ...heading, fontSize: 26, lineHeight: 1.1 }}>{lesson.rule.headline}</div>
          <p style={{ margin: 0, fontSize: 16, textWrap: 'pretty' } as CSSProperties}>{lesson.rule.body}</p>
          {lesson.rule.formula && <div style={{ padding: 14, border: '1px dashed var(--color-divider)', fontFamily: 'var(--font-heading)', fontSize: 22, textAlign: 'center', ...tabular }}>{lesson.rule.formula}</div>}
          {lesson.rule.note && <div style={{ fontSize: 14, color: 'var(--muted)' }}>{lesson.rule.note}</div>}
        </section>
      )}

      {L.step === 1 && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 12, ...rise }}>
          <Kicker color="var(--color-accent-700)">Worked example</Kicker>
          <div style={{ fontSize: 17, textWrap: 'pretty' } as CSSProperties}>{lesson.example.prompt}</div>
          <div className="blueprint" style={{ background: 'var(--color-accent-100)', borderColor: 'var(--color-accent)', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Corners />
            {lesson.example.lines.map((t, i) => (
              <div key={t} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                <span style={{ flex: 'none', width: 22, height: 22, display: 'grid', placeItems: 'center', border: '1px solid var(--color-accent)', ...heading, fontSize: 13, color: 'var(--color-accent-700)' }}>{i + 1}</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: 21, ...tabular }}>{t}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 15, color: 'var(--muted)' }}>{lesson.example.note}</div>
        </section>
      )}

      {L.step === 2 && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 12, ...rise }}>
          <div style={{ background: 'var(--warn-bg)', border: '1px solid var(--warn)', padding: 16, display: 'flex', gap: 12 }}>
            <Svg size={22} stroke="var(--warn)" style={{ flex: 'none', marginTop: 2 }}>
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </Svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Kicker color="var(--warn)">Common trap</Kicker>
              <div style={{ ...heading, fontSize: 23, lineHeight: 1.1 }}>{lesson.trap.title}</div>
              <div style={{ fontSize: 15, textWrap: 'pretty' } as CSSProperties}>{lesson.trap.body}</div>
            </div>
          </div>
        </section>
      )}

      {gq && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 14, ...rise }}>
          <Kicker color="var(--color-accent-700)">{gq.label}</Kicker>
          <div style={{ fontSize: 18, lineHeight: 1.45, textWrap: 'pretty', whiteSpace: 'pre-line' } as CSSProperties}>{gq.prompt}</div>
          {gq.kind === 'choice' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} role="radiogroup" aria-label="Choices">
              {gq.choices.map((c, i) => {
                const on = L.sel === i;
                const shown = L.checked && on;
                const color = shown ? (L.ok ? 'var(--ok)' : 'var(--bad)') : on ? 'var(--color-accent)' : 'var(--color-divider)';
                return (
                  <button key={i} role="radio" aria-checked={on} onClick={() => a.lessonSelect(i)} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', textAlign: 'left', padding: '10px 12px', border: `1px solid ${color}`, background: shown ? (L.ok ? 'var(--ok-bg)' : 'var(--bad-bg)') : on ? 'var(--color-accent-100)' : 'var(--color-bg)', color: 'var(--color-text)', cursor: 'pointer', animation: shown && !L.ok ? 'shake .3s' : 'none' }}>
                    <span style={{ flex: 'none', width: 28, height: 28, display: 'grid', placeItems: 'center', border: `1px solid ${color}`, background: on ? color : 'transparent', color: on ? 'var(--color-bg)' : 'var(--color-text)', ...heading, fontSize: 15 }}>{LETTERS[i]}</span>
                    <span style={{ fontSize: 15, lineHeight: 1.45, paddingTop: 3 }}>{c}</span>
                  </button>
                );
              })}
            </div>
          ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="text"
              inputMode="decimal"
              aria-label={gq.unit ? `Your answer in ${gq.unit}` : 'Your answer'}
              value={L.input}
              onChange={e => a.lessonInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && a.lessonNext()}
              placeholder="?"
              style={{ width: 140, height: 58, padding: '0 14px', border: `1.5px solid ${!L.checked ? 'var(--color-divider)' : L.ok ? 'var(--ok)' : 'var(--bad)'}`, background: 'var(--color-bg)', color: 'var(--color-text)', ...heading, fontSize: 30, ...tabular, outline: 'none', animation: L.checked && !L.ok ? 'shake .3s' : 'none' }}
            />
            {gq.unit && <span style={{ fontFamily: 'var(--font-heading)', fontSize: 26, color: 'var(--muted)' }}>{gq.unit}</span>}
          </div>
          )}
          {L.checked && (
            <div role="status" style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 14px', background: L.ok ? 'var(--ok-bg)' : 'var(--bad-bg)', border: `1px solid ${L.ok ? 'var(--ok)' : 'var(--bad)'}`, animation: 'pop .35s ease-out' }}>
              <span style={{ ...heading, fontSize: 17, color: L.ok ? 'var(--ok)' : 'var(--bad)' }}>{L.ok ? 'Right.' : 'Not yet.'}</span>
              <span style={{ fontSize: 15 }}>{L.ok ? gq.ok : gq.bad}</span>
            </div>
          )}
        </section>
      )}

      {done && (
        <section className="blueprint" style={{ background: 'var(--color-bg)', padding: 20, display: 'flex', flexDirection: 'column', gap: 12, animation: 'pop .45s ease-out' }}>
          <Corners />
          <DoneBadge />
          <div style={{ ...heading, fontSize: 28, lineHeight: 1 }}>Lesson complete</div>
          <div style={{ fontSize: 15, textWrap: 'pretty' } as CSSProperties}>
            {L.score} of 2 guided questions right on the first try. Next: an adaptive drill on {lesson.topic.toLowerCase()}{nextInTopic ? `, then “${nextInTopic.title}”` : ''}.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${siblings.length},1fr)`, gap: 3 }}>
            {siblings.map(l => (
              <div key={l.id} style={{ height: 5, background: l.order <= lesson.order ? 'var(--color-accent)' : 'var(--color-divider)', transformOrigin: 'left', animation: l.id === lesson.id ? 'grow .6s .3s both' : 'none' }} />
            ))}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>
            {lesson.topic} · lesson {lesson.order} of {siblings.length} done
          </div>
        </section>
      )}

      <div style={{ marginTop: 'auto', display: 'flex', gap: 10, paddingTop: 8 }}>
        {L.step > 0 && !done && (
          <button className="btn btn-secondary" onClick={a.lessonBack} style={{ height: 50, width: 56 }} aria-label="Previous step">
            <ChevronLeft size={20} />
          </button>
        )}
        <PrimaryButton onClick={a.lessonNext} style={{ flex: 1, height: 50, fontSize: 17, opacity: answered ? 1 : 0.45 }}>
          {nextLabel}
        </PrimaryButton>
      </div>
      {done && (
        <button className="btn btn-ghost" onClick={() => a.go(L.from === 'learn' ? 'learn' : 'today')} style={{ alignSelf: 'center', fontSize: 15 }}>
          {L.from === 'learn' ? 'Back to Learn' : 'Back to Today'}
        </button>
      )}
    </div>
  );
}
