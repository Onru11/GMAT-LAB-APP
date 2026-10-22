import { PAST_TESTS, RESULT_ROWS } from '../data';
import { useApp } from '../store';
import { BT, BackLink, Corners, H2, PageHeader, PrimaryButton, heading, rowTop } from '../components/ui';

const TEST_MENU = [
  { name: 'Quant', short: 'Quant', meta: '21 questions · 45 min · adaptive', last: 'Last 66', primary: true, list: [0, 1, 2, 4] },
  { name: 'Data Insights', short: 'DI', meta: '20 questions · 45 min · adaptive', last: 'Last 71', primary: false, list: [4, 2, 0, 1] },
];

export function Tests() {
  const { a } = useApp();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <BackLink onClick={() => a.go('practice')}>Practice</BackLink>
      <PageHeader title="Adaptive tests" size={36} sub="Exam conditions: no solutions until the end, no going back, difficulty adapts to each answer." />
      {TEST_MENU.map(tm => (
        <section key={tm.name} className="blueprint" style={{ background: 'var(--color-bg)', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Corners />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
            <div>
              <div style={{ ...heading, fontSize: 24, lineHeight: 1.1 }}>{tm.name}</div>
              <div style={{ fontSize: 14, color: 'var(--muted)' }}>{tm.meta}</div>
            </div>
            <span className="tag tag-accent">{tm.last}</span>
          </div>
          <button className={`btn ${tm.primary ? 'btn-primary' : 'btn-secondary'}`} onClick={() => a.startRun('test', tm.list)} style={{ height: 46, fontSize: 16 }}>
            Start {tm.short} test
          </button>
        </section>
      ))}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <H2>Past tests</H2>
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
            {PAST_TESTS.map(pt => (
              <tr key={pt.date}>
                <td>{pt.date}</td>
                <td>{pt.sec}</td>
                <td style={{ textAlign: 'right', ...heading, fontSize: 17 }}>{pt.score}</td>
                <td style={{ textAlign: 'right', color: 'var(--muted)' }}>{pt.right}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export function Results() {
  const { a } = useApp();
  const stat = (label: string, value: string, color?: string) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
      <span style={{ color: 'var(--muted)' }}>{label}</span>
      <span style={{ fontWeight: 600, color }}>{value}</span>
    </div>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'rise .3s ease-out' }}>
      <PageHeader kicker="Quant test #3 · Oct 22" title="Results" size={36} />
      <section className="blueprint" style={{ background: 'var(--color-bg)', padding: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Corners />
        <div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>Estimated Quant</div>
          <div style={{ ...heading, fontSize: 60, lineHeight: 1 }}>69</div>
          <div style={{ fontSize: 13, color: 'var(--ok)', fontWeight: 500 }}>+3 vs. last test</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'flex-end' }}>
          {stat('Right', '14 / 21')}
          {stat('Time', '43:10 / 45:00')}
          {stat('Over 2:00', '5 questions', 'var(--bad)')}
        </div>
      </section>
      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <H2>By topic · weakest first</H2>
        <div style={{ border: BT, background: 'var(--color-bg)' }}>
          {RESULT_ROWS.map(([name, right, of], i) => {
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
        <PrimaryButton onClick={() => a.go('mistakes')} style={{ height: 48, fontSize: 16 }}>
          Review the 7 misses
        </PrimaryButton>
        <button className="btn btn-ghost" onClick={() => a.go('practice')} style={{ fontSize: 15 }}>
          Back to Practice
        </button>
      </div>
    </div>
  );
}
