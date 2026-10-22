import { LEVELS, TOOLS, levelName, type Section } from '../data';
import { topicStats } from '../stats';
import { useApp } from '../store';
import { BT, ChevronRight, Corners, H2, Kicker, LevelSegments, PageHeader, Svg, heading, rowTop, tabular } from '../components/ui';

const DRILL_LEVELS = ['Auto', 'Foundation', 'Building', 'Solid', 'Strong', 'Elite'];
const SECTIONS: Section[] = ['Quant', 'Data Insights', 'Verbal'];

export function Practice() {
  const { s, a } = useApp();
  const lastTest = s.tests[s.tests.length - 1];
  const topics = topicStats(s);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader kicker="Drills · tests · toolkit" title="Practice" />

      <button onClick={() => a.go('tests')} className="blueprint hover-edge" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, background: 'var(--color-bg)', color: 'var(--color-text)', textAlign: 'left', cursor: 'pointer' }}>
        <Corners />
        <span style={{ flex: 'none', width: 42, height: 42, display: 'grid', placeItems: 'center', border: '1px solid var(--color-accent)', color: 'var(--color-accent)' }}>
          <Svg size={22}>
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l2 2" />
            <path d="M10 2h4" />
          </Svg>
        </span>
        <span style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <span style={{ ...heading, fontSize: 21 }}>Adaptive tests</span>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>Timed section tests · {lastTest ? `last: ${lastTest.section} ${lastTest.score} on ${lastTest.date}` : 'none taken yet'}</span>
        </span>
        <ChevronRight />
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Kicker>Drill level</Kicker>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>{s.lvl === 0 ? 'Up after 3 right in a row, down after 2 wrong' : 'Fixed at ' + LEVELS[s.lvl - 1]}</span>
        </div>
        <div style={{ display: 'flex', border: BT, background: 'var(--color-bg)', overflowX: 'auto' }} role="group" aria-label="Drill level">
          {DRILL_LEVELS.map((name, i) => {
            const on = s.lvl === i;
            return (
              <button key={name} onClick={() => a.setLevel(i)} aria-pressed={on} style={{ flex: 1, minWidth: 'max-content', padding: '9px 10px', border: 0, borderLeft: rowTop(i), background: on ? 'var(--color-accent)' : 'transparent', color: on ? 'var(--color-bg)' : 'var(--color-text)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                {name}
              </button>
            );
          })}
        </div>
      </div>

      {SECTIONS.map(sec => (
        <section key={sec} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <H2>{sec}</H2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,160px),1fr))', gap: 8 }}>
            {topics.filter(t => t.sec === sec).map(t => (
              <button
                key={t.name}
                className="hover-tile press-tile"
                onClick={() => a.startTopicDrill(t.name, t.sec)}
                style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12, border: BT, background: 'var(--color-bg)', color: 'var(--color-text)', textAlign: 'left', cursor: 'pointer', minHeight: 92 }}
              >
                <span style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.25, flex: 1 }}>{t.name}</span>
                <LevelSegments as="span" level={t.level} height={4} gap={2} />
                <span style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted)', width: '100%' }}>
                  <span>{levelName(t.level)}</span>
                  <span style={tabular}>{t.acc == null ? '—' : t.acc + '%'}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}

      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <H2>Toolkit</H2>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>Quick-reference rules. Tap to open.</div>
        </div>
        <div style={{ border: BT, background: 'var(--color-bg)' }}>
          {TOOLS.map(([name, rule, note], i) => {
            const open = s.toolOpen === i;
            return (
              <div key={name} style={{ borderTop: rowTop(i) }}>
                <button onClick={() => a.toggleTool(i)} aria-expanded={open} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '13px 14px', border: 0, background: 'transparent', color: 'var(--color-text)', textAlign: 'left', cursor: 'pointer', fontWeight: 500, fontSize: 15 }}>
                  {name}
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 20, color: 'var(--muted)' }}>{open ? '−' : '+'}</span>
                </button>
                {open && (
                  <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 6, animation: 'rise .2s ease-out' }}>
                    <div style={{ padding: '10px 12px', background: 'var(--color-accent-100)', fontFamily: 'var(--font-heading)', fontSize: 19, ...tabular }}>{rule}</div>
                    <div style={{ fontSize: 14, color: 'var(--muted)' }}>{note}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
