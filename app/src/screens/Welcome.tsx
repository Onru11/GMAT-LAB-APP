import { useState, type CSSProperties } from 'react';
import { addDays, daysBetween } from '../progress';
import { useApp } from '../store';
import { BT, ChevronLeft, Corners, Kicker, PrimaryButton, heading } from '../components/ui';

const TARGETS = [605, 655, 705, 745];
const MINUTES = [15, 30, 45, 60];
const STEPS = 4;

/** First-run setup: goal, exam date, daily time, then the diagnostic. */
export function Welcome() {
  const { s, a } = useApp();
  const [step, setStep] = useState(0);
  const option = (on: boolean): CSSProperties => ({
    padding: '16px 14px', border: `1px solid ${on ? 'var(--color-accent)' : 'var(--color-divider)'}`, background: on ? 'var(--color-accent-100)' : 'var(--color-bg)',
    color: 'var(--color-text)', cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 2,
  });
  const days = s.examDate ? daysBetween(s.day, s.examDate) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, flex: 1, maxWidth: 560, width: '100%', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 8 }}>
        {step > 0 ? (
          <button className="btn btn-ghost btn-icon" style={{ color: 'var(--color-text)' }} onClick={() => setStep(step - 1)} aria-label="Back">
            <ChevronLeft size={22} />
          </button>
        ) : (
          <span style={{ width: 22, height: 22, border: '1.5px solid var(--color-accent)', display: 'grid', placeItems: 'center', ...heading, fontSize: 13, color: 'var(--color-accent)' }}>G</span>
        )}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: `repeat(${STEPS},1fr)`, gap: 4 }}>
          {Array.from({ length: STEPS }, (_, i) => (
            <div key={i} style={{ height: 5, background: i <= step ? 'var(--color-accent)' : 'var(--color-divider)', transition: 'background .3s' }} />
          ))}
        </div>
      </div>

      {step === 0 && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'rise .3s ease-out' }}>
          <Kicker>Welcome to GMAT Lab</Kicker>
          <h1 style={{ margin: 0, fontSize: 36, lineHeight: 1.05 }}>What score are you aiming for?</h1>
          <p style={{ margin: 0, color: 'var(--muted)' }}>GMAT Focus totals run from 205 to 805. You can change this any time on Progress.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }} role="radiogroup" aria-label="Target score">
            {TARGETS.map(t => (
              <button key={t} role="radio" aria-checked={s.target === t} onClick={() => a.setPlan({ target: t })} style={option(s.target === t)}>
                <span style={{ ...heading, fontSize: 32, lineHeight: 1 }}>{t}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 1 && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'rise .3s ease-out' }}>
          <Kicker>Your plan</Kicker>
          <h1 style={{ margin: 0, fontSize: 36, lineHeight: 1.05 }}>When is your exam?</h1>
          <p style={{ margin: 0, color: 'var(--muted)' }}>We pace the plan to it: foundations first, then timed sets and full tests in the last weeks.</p>
          <div className="field">
            <label htmlFor="exam-date">Exam date</label>
            <input id="exam-date" className="input" type="date" min={addDays(s.day, 1)} value={s.examDate ?? ''} onChange={e => a.setPlan({ examDate: e.target.value || null })} style={{ height: 48, fontSize: 17 }} />
          </div>
          <button onClick={() => a.setPlan({ examDate: null })} style={option(s.examDate == null)} aria-pressed={s.examDate == null}>
            <span style={{ fontWeight: 600 }}>Not booked yet</span>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>We’ll plan for about three months.</span>
          </button>
          {days != null && days > 0 && <div style={{ fontSize: 14, color: 'var(--muted)' }}>{days} days from today.</div>}
        </section>
      )}

      {step === 2 && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'rise .3s ease-out' }}>
          <Kicker>Your plan</Kicker>
          <h1 style={{ margin: 0, fontSize: 36, lineHeight: 1.05 }}>How long can you study each day?</h1>
          <p style={{ margin: 0, color: 'var(--muted)' }}>Daily beats weekend cramming. The queue is sized to fit.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }} role="radiogroup" aria-label="Minutes a day">
            {MINUTES.map(m => (
              <button key={m} role="radio" aria-checked={s.dailyMin === m} onClick={() => a.setPlan({ dailyMin: m })} style={option(s.dailyMin === m)}>
                <span style={{ ...heading, fontSize: 28, lineHeight: 1 }}>{m} min</span>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>{m <= 15 ? 'Light' : m <= 30 ? 'Steady' : m <= 45 ? 'Serious' : 'Intensive'}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="blueprint" style={{ background: 'var(--color-bg)', padding: 20, display: 'flex', flexDirection: 'column', gap: 12, animation: 'rise .3s ease-out' }}>
          <Corners />
          <Kicker color="var(--color-accent-700)">Find your level</Kicker>
          <h1 style={{ margin: 0, fontSize: 32, lineHeight: 1.05 }}>Take the 15-question diagnostic</h1>
          <p style={{ margin: 0 }}>Five questions from each section, no timer, no solutions until the end. It sets your starting level in each topic and gives you a first score estimate.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', borderTop: BT, paddingTop: 10 }}>
            {[['15', 'questions'], ['~25', 'minutes'], ['3', 'sections']].map(([n, l]) => (
              <div key={l}>
                <div style={{ ...heading, fontSize: 26 }}>{n}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{l}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 8 }}>
        {step < 3 ? (
          <PrimaryButton onClick={() => setStep(step + 1)} style={{ height: 52, fontSize: 17 }}>
            Continue
          </PrimaryButton>
        ) : (
          <>
            <PrimaryButton onClick={() => a.finishSetup(true)} style={{ height: 52, fontSize: 17 }}>
              Start diagnostic
            </PrimaryButton>
            <button className="btn btn-ghost" onClick={() => a.finishSetup(false)} style={{ fontSize: 15 }}>
              Skip for now
            </button>
          </>
        )}
      </div>
    </div>
  );
}
