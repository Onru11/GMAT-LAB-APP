import { Fragment, type CSSProperties } from 'react';
import { levelName, type Section } from '../data';
import { topicStats, weakestTopics } from '../stats';
import { Backup, Insights } from './Insights';
import { PHASE_COPY, daysToExam, phaseFor } from '../plan';
import { addDays } from '../progress';
import { useApp, type ScoreForm } from '../store';
import { BT, Corners, H2, LevelSegments, MiniSegment, PageHeader, PrimaryButton, heading, rowTop } from '../components/ui';

// Chart geometry in SVG user units; HTML labels are positioned as percentages of it.
const W = 340;
const H = 190;
const Y = (v: number) => 10 + ((760 - v) / 460) * 150;
const GRID = [400, 500, 600, 700];
const SECTIONS: Section[] = ['Quant', 'Verbal', 'Data Insights'];

export function Progress() {
  const { s, a } = useApp();
  const sc = s.noScores ? [] : s.scores;
  const X = (i: number) => (sc.length === 1 ? 184 : 54 + (i * 260) / (sc.length - 1));
  const diff = sc.length ? sc[sc.length - 1].total - sc[0].total : 0;
  const weakest = weakestTopics(s);
  const table = topicStats(s).filter(t => t.sec === SECTIONS[s.progSec]).sort((x, y) => (x.acc ?? 999) - (y.acc ?? 999));

  const field = (k: keyof ScoreForm, label: string, placeholder: string, numeric = true) => (
    <div className="field">
      <label htmlFor={`score-${k}`}>{label}</label>
      <input id={`score-${k}`} className="input" type={numeric ? 'number' : 'text'} placeholder={placeholder} value={s.form[k]} onChange={e => a.formField(k, e.target.value)} />
    </div>
  );
  const pretty = { textWrap: 'pretty' } as CSSProperties;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader kicker="Official practice exams" title="Progress" />
      <PlanCard />

      {sc.length > 0 ? (
        <>
          <section className="blueprint" style={{ background: 'var(--color-bg)', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Corners />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ ...heading, fontSize: 20 }}>Score history</span>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>
                {diff >= 0 ? '+' : ''}
                {diff} since {sc[0].date}
              </span>
            </div>
            <div style={{ position: 'relative', width: '100%', aspectRatio: `${W}/${H}`, fontVariantNumeric: 'tabular-nums' }} role="img" aria-label={`Score history: ${sc.map(x => `${x.date} ${x.total}`).join(', ')}. Target ${s.target}.`}>
              <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', overflow: 'visible' }}>
                {GRID.map(v => (
                  <line key={v} x1="34" x2="334" y1={Y(v)} y2={Y(v)} stroke="var(--color-divider)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                ))}
                <line x1="34" x2="334" y1={Y(s.target)} y2={Y(s.target)} stroke="var(--color-text)" strokeWidth="1.5" strokeDasharray="5 4" vectorEffect="non-scaling-stroke" />
                <polyline points={sc.map((x, i) => X(i) + ',' + Y(x.total)).join(' ')} fill="none" stroke="var(--color-accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              </svg>
              {GRID.map(v => (
                <span key={v} style={{ position: 'absolute', right: ((W - 28) / W) * 100 + '%', top: (Y(v) / H) * 100 + '%', transform: 'translateY(-50%)', fontSize: 10, lineHeight: 1, color: 'var(--muted)' }}>
                  {v}
                </span>
              ))}
              <span style={{ position: 'absolute', right: 0, top: (Y(s.target) / H) * 100 + '%', transform: 'translateY(-120%)', fontSize: 11, fontWeight: 600, lineHeight: 1 }}>Target {s.target}</span>
              {sc.map((x, i) => {
                const left = (X(i) / W) * 100 + '%';
                const top = (Y(x.total) / H) * 100 + '%';
                return (
                  <Fragment key={i}>
                    <span style={{ position: 'absolute', left, top, width: 9, height: 9, transform: 'translate(-50%,-50%)', borderRadius: '50%', border: '2px solid var(--color-accent)', background: 'var(--color-bg)' }} />
                    <span style={{ position: 'absolute', left, top, transform: 'translate(-50%,-160%)', fontSize: 12, fontWeight: 600, lineHeight: 1 }}>{x.total}</span>
                    <span style={{ position: 'absolute', left, bottom: 0, transform: 'translateX(-50%)', fontSize: 10, lineHeight: 1, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{x.date}</span>
                  </Fragment>
                );
              })}
            </div>
          </section>
          <div style={{ border: BT, background: 'var(--color-bg)' }}>
            {sc
              .slice()
              .reverse()
              .map((x, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'center', padding: '10px 14px', borderTop: rowTop(i) }}>
                  <span style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 500, fontSize: 14 }}>{x.label}</span>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                      {x.date} · Q {x.q} · V {x.v} · DI {x.di}
                    </span>
                  </span>
                  <span style={{ ...heading, fontSize: 24 }}>{x.total}</span>
                </div>
              ))}
          </div>
        </>
      ) : (
        <section className="blueprint" style={{ background: 'var(--color-bg)', padding: '22px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Corners />
          <div style={{ height: 110, borderBottom: BT, borderLeft: BT, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 22, borderTop: '1.5px dashed var(--color-text)' }} />
            <span style={{ position: 'absolute', right: 0, top: 4, fontSize: 11, fontWeight: 600 }}>Target {s.target}</span>
          </div>
          <span style={{ ...heading, fontSize: 22 }}>No official scores yet</span>
          <span style={{ fontSize: 14, color: 'var(--muted)', ...pretty }}>Take an official practice exam (mba.com), then log it below. Until then your estimate comes from drills only.</span>
        </section>
      )}

      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <H2>Weakest topics</H2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {!weakest.length && <div style={{ padding: '14px', border: '1px dashed var(--color-divider)', fontSize: 14, color: 'var(--muted)' }}>Drill a few topics and your weakest three show up here.</div>}
          {weakest.map(t => (
            <button key={t.name} className="hover-edge" onClick={() => a.startTopicDrill(t.name, t.sec)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: BT, background: 'var(--color-bg)', color: 'var(--color-text)', textAlign: 'left', cursor: 'pointer' }}>
              <span style={{ ...heading, fontSize: 22, color: 'var(--bad)', width: 46, fontVariantNumeric: 'tabular-nums' }}>{t.acc}%</span>
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 500 }}>{t.name}</span>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {t.sec} · {levelName(t.level)}
                </span>
              </span>
              <span style={{ fontSize: 13, color: 'var(--color-accent-700)', fontWeight: 500 }}>Drill</span>
            </button>
          ))}
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          <H2>By section</H2>
          <MiniSegment options={[['Quant', 0], ['Verbal', 1], ['DI', 2]]} value={s.progSec} onChange={a.setProgSec} background="var(--color-bg)" />
        </div>
        <table className="table" style={{ background: 'var(--color-bg)', border: BT }}>
          <thead>
            <tr>
              <th>Topic</th>
              <th>Level</th>
              <th style={{ textAlign: 'right' }}>Acc.</th>
            </tr>
          </thead>
          <tbody>
            {table.map(t => (
              <tr key={t.name}>
                <td style={{ fontWeight: 500 }}>{t.name}</td>
                <td>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <LevelSegments as="span" level={t.level} height={4} gap={2} cols="repeat(5,10px)" />
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>{levelName(t.level)}</span>
                  </span>
                </td>
                <td style={{ textAlign: 'right', ...heading, fontSize: 17, color: t.acc == null ? 'var(--muted)' : t.acc < 60 ? 'var(--bad)' : t.acc < 70 ? 'var(--warn)' : 'var(--color-text)' }}>{t.acc == null ? '—' : t.acc + '%'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <Insights />

      <section className="blueprint" style={{ background: 'var(--color-bg)', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Corners />
        <div>
          <span style={{ ...heading, fontSize: 20 }}>Log an official exam</span>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>Total 205–805 · sections 60–90</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {field('date', 'Date', 'Nov 14', false)}
          {field('total', 'Total', '505')}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {field('q', 'Quant', '70')}
          {field('v', 'Verbal', '78')}
          {field('di', 'DI', '75')}
        </div>
        {s.formErr && (
          <div role="alert" style={{ fontSize: 13, color: 'var(--bad)', animation: 'shake .3s' }}>
            {s.formErr}
          </div>
        )}
        {s.formOk && (
          <div role="status" style={{ fontSize: 13, color: 'var(--ok)', animation: 'rise .2s' }}>
            Saved. Chart and estimate updated.
          </div>
        )}
        <PrimaryButton onClick={a.logScore} style={{ height: 46, fontSize: 16 }}>
          Save score
        </PrimaryButton>
      </section>

      <Backup />
    </div>
  );
}

/** The learner's goal and plan, editable. */
function PlanCard() {
  const { s, a } = useApp();
  const days = daysToExam(s.day, s.examDate);
  const phase = PHASE_COPY[phaseFor(days)];
  return (
    <section className="blueprint" style={{ background: 'var(--color-bg)', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Corners />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
        <span style={{ ...heading, fontSize: 20 }}>Your plan · {phase.name}</span>
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>{s.examDate ? `${days} days to exam` : 'Exam not booked'}</span>
      </div>
      <div style={{ fontSize: 14, color: 'var(--muted)' }}>{phase.what}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        <div className="field">
          <label htmlFor="plan-target">Target</label>
          <select id="plan-target" className="input" value={s.target} onChange={e => a.setPlan({ target: Number(e.target.value) })}>
            {[555, 605, 655, 705, 745, 805].map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="plan-date">Exam date</label>
          <input id="plan-date" className="input" type="date" min={addDays(s.day, 1)} value={s.examDate ?? ''} onChange={e => a.setPlan({ examDate: e.target.value || null })} />
        </div>
        <div className="field">
          <label htmlFor="plan-min">Per day</label>
          <select id="plan-min" className="input" value={s.dailyMin} onChange={e => a.setPlan({ dailyMin: Number(e.target.value) })}>
            {[15, 30, 45, 60].map(v => (
              <option key={v} value={v}>{v} min</option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
