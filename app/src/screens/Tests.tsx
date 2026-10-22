import { TESTS, type TestDef } from '../content/select';
import { fmtTime, useApp } from '../store';
import { BT, BackLink, Corners, H2, PageHeader, PrimaryButton, heading, rowTop } from '../components/ui';

const MENU: { section: TestDef['section']; short: string; primary: boolean }[] = [
  { section: 'Quant', short: 'Quant', primary: true },
  { section: 'Data Insights', short: 'DI', primary: false },
];

export function Tests() {
  const { s, a } = useApp();
  const lastOf = (section: string) => [...s.tests].reverse().find(t => t.section === section);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <BackLink onClick={() => a.go('practice')}>Practice</BackLink>
      <PageHeader title="Adaptive tests" size={36} sub="Exam conditions: no solutions until the end, no going back, difficulty adapts to each answer." />
      {MENU.map(tm => {
        const def = TESTS[tm.section];
        const last = lastOf(tm.section);
        return (
          <section key={tm.section} className="blueprint" style={{ background: 'var(--color-bg)', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Corners />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
              <div>
                <div style={{ ...heading, fontSize: 24, lineHeight: 1.1 }}>{tm.section}</div>
                <div style={{ fontSize: 14, color: 'var(--muted)' }}>
                  {def.length} questions · {def.minutes} min · adaptive
                </div>
              </div>
              <span className="tag tag-accent">{last ? `Last ${last.score}` : 'Not taken'}</span>
            </div>
            <button className={`btn ${tm.primary ? 'btn-primary' : 'btn-secondary'}`} onClick={() => a.startTest(tm.section)} style={{ height: 46, fontSize: 16 }}>
              Start {tm.short} test
            </button>
          </section>
        );
      })}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <H2>Past tests</H2>
        {s.tests.length ? (
          <table className="table" style={{ background: 'var(--color-bg)', border: BT }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Section</th>
                <th style={{ textAlign: 'right' }}>Score</th>
                <th style={{ textAlign: 'right' }}>Right</th>
              </tr>
            </thead>
            <tbody>
              {[...s.tests].reverse().map((t, i) => (
                <tr key={i}>
                  <td>{t.date}</td>
                  <td>{t.section}</td>
                  <td style={{ textAlign: 'right', ...heading, fontSize: 17 }}>{t.score}</td>
                  <td style={{ textAlign: 'right', color: 'var(--muted)' }}>
                    {t.right}/{t.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '16px 14px', border: '1px dashed var(--color-divider)', fontSize: 14, color: 'var(--muted)' }}>No tests yet. Your first one sets the baseline for each section.</div>
        )}
      </section>
    </div>
  );
}

export function Results() {
  const { s, a } = useApp();
  const t = s.tests[s.tests.length - 1];
  if (!t) return null;
  const n = s.tests.filter(x => x.section === t.section).length;
  const prev = [...s.tests].slice(0, -1).reverse().find(x => x.section === t.section);
  const delta = prev ? t.score - prev.score : null;
  // Tests saved before answers were stored have neither field.
  const unanswered = t.unanswered ?? 0;
  const misses = t.total - t.right;
  const limit = TESTS[t.section].minutes * 60;
  const stat = (label: string, value: string, color?: string) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
      <span style={{ color: 'var(--muted)' }}>{label}</span>
      <span style={{ fontWeight: 600, color }}>{value}</span>
    </div>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'rise .3s ease-out' }}>
      <PageHeader kicker={`${t.section} test #${n} · ${t.date}`} title="Results" size={36} />
      <section className="blueprint" style={{ background: 'var(--color-bg)', padding: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Corners />
        <div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>Estimated {t.section === 'Quant' ? 'Quant' : 'DI'}</div>
          <div style={{ ...heading, fontSize: 60, lineHeight: 1 }}>{t.score}</div>
          {delta != null && (
            <div style={{ fontSize: 13, color: delta >= 0 ? 'var(--ok)' : 'var(--bad)', fontWeight: 500 }}>
              {delta >= 0 ? '+' : '−'}
              {Math.abs(delta)} vs. last test
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'flex-end' }}>
          {stat('Right', `${t.right} / ${t.total + unanswered}`)}
          {stat('Time', `${fmtTime(t.seconds)} / ${fmtTime(limit)}`, t.seconds > limit ? 'var(--bad)' : undefined)}
          {stat('Over 2:00', `${t.over} question${t.over === 1 ? '' : 's'}`, t.over ? 'var(--bad)' : undefined)}
          {unanswered > 0 && stat('Unanswered', `${unanswered}`, 'var(--bad)')}
        </div>
      </section>
      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <H2>By topic · weakest first</H2>
        <div style={{ border: BT, background: 'var(--color-bg)' }}>
          {t.byTopic.map(([name, right, of], i) => {
            const f = right / of;
            const color = f < 0.5 ? 'var(--bad)' : f < 0.8 ? 'var(--warn)' : 'var(--ok)';
            return (
              <div key={name} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 44px', gap: 10, alignItems: 'center', padding: '11px 14px', borderTop: rowTop(i) }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{name}</span>
                <span style={{ height: 6, background: 'var(--color-divider)' }}>
                  <span style={{ display: 'block', height: '100%', width: f * 100 + '%', background: color }} />
                </span>
                <span style={{ textAlign: 'right', fontSize: 14, fontVariantNumeric: 'tabular-nums', color, fontWeight: 600 }}>
                  {right}/{of}
                </span>
              </div>
            );
          })}
        </div>
      </section>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {t.answers?.length > 0 && (
          <button className="btn btn-secondary" onClick={() => a.reviewTest(0)} style={{ height: 46, fontSize: 16 }}>
            Review every answer
          </button>
        )}
        {misses > 0 && (
          <PrimaryButton onClick={() => a.go('mistakes')} style={{ height: 48, fontSize: 16 }}>
            Review the {misses} {misses === 1 ? 'miss' : 'misses'}
          </PrimaryButton>
        )}
        <button className="btn btn-ghost" onClick={() => a.go('practice')} style={{ fontSize: 15 }}>
          Back to Practice
        </button>
      </div>
    </div>
  );
}
