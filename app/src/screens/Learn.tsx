import { LEVELS, PERCENT_LESSONS, PHASES, levelName, type Phase } from '../data';
import { useApp } from '../store';
import { BT, Corners, LevelSegments, PageHeader, heading } from '../components/ui';

const TAG_COLORS: Record<Phase['tag'], [bg: string, ink: string]> = {
  'In progress': ['var(--hl)', 'var(--hl-ink)'],
  'Daily CR': ['var(--color-accent-100)', 'var(--color-accent-800)'],
  'Up next': ['var(--color-surface)', 'var(--color-text)'],
  Locked: ['transparent', 'var(--muted)'],
};

export function Learn() {
  const { s, a } = useApp();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PageHeader kicker="Study path · 6 phases" title="Learn" sub="Every topic: short lesson, guided practice, then an adaptive drill. Only what moves the score." />
      <div style={{ display: 'flex', gap: 4, fontSize: 11, color: 'var(--muted)' }}>
        {LEVELS.map((name, i) => (
          <div key={name} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ height: 4, background: 'var(--color-accent)', opacity: 0.25 + i * 0.1875 }} />
            <span>{name}</span>
          </div>
        ))}
      </div>
      {PHASES.map((ph, i) => {
        const open = !!s.openPhase[i];
        const [tagBg, tagInk] = TAG_COLORS[ph.tag];
        return (
          <section key={ph.name} style={{ border: `1px solid ${i === 0 ? 'var(--color-accent)' : 'var(--color-divider)'}`, background: 'var(--color-bg)' }}>
            <button
              onClick={() => a.togglePhase(i)}
              aria-expanded={open}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: 14, border: 0, background: 'transparent', color: 'var(--color-text)', textAlign: 'left', cursor: 'pointer' }}
            >
              <span style={{ ...heading, fontSize: 26, lineHeight: 1, color: ph.tag === 'Locked' ? 'var(--muted)' : 'var(--color-accent-700)', width: 34 }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <span style={{ ...heading, fontSize: 20, lineHeight: 1.15 }}>{ph.name}</span>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>{ph.sub}</span>
              </span>
              <span className="tag" style={{ background: tagBg, color: tagInk }}>{ph.tag}</span>
            </button>
            {open && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,260px),1fr))', gap: 10, padding: '0 14px 14px' }}>
                {ph.topics.map(tp => (
                  <div key={tp.name} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12, border: `1px solid ${tp.current ? 'var(--color-accent)' : 'var(--color-divider)'}`, background: tp.current ? 'var(--color-accent-100)' : 'var(--color-bg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline' }}>
                      <span style={{ fontWeight: 600, fontSize: 15 }}>{tp.name}</span>
                      <span style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{levelName(tp.level)}</span>
                    </div>
                    <LevelSegments level={tp.level} />
                    <div style={{ fontSize: 13, color: 'var(--muted)' }}>{tp.status}</div>
                    {tp.current && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, borderTop: BT, paddingTop: 8 }}>
                        {PERCENT_LESSONS.map(([mark, name, current]) => (
                          <div key={name} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: current ? 'var(--color-text)' : 'var(--muted)' }}>
                            <span style={{ width: 16, ...heading }}>{mark}</span>
                            {name}
                          </div>
                        ))}
                        <button className="btn btn-primary blueprint" onClick={() => a.openLesson(0)} style={{ marginTop: 10, height: 42, fontSize: 15 }}>
                          <Corners />
                          Continue lesson
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
