import { LEVELS, PHASES, levelName } from '../data';
import { lessonsFor, nextLesson } from '../content/lessons/curriculum';
import { useApp } from '../store';
import { topicStat } from '../progress';
import { BT, Corners, LevelSegments, PageHeader, heading } from '../components/ui';

type Tag = 'In progress' | 'Daily CR' | 'Up next' | 'Later' | 'Done';
const TAG_COLORS: Record<Tag, [bg: string, ink: string]> = {
  'In progress': ['var(--hl)', 'var(--hl-ink)'],
  'Daily CR': ['var(--color-accent-100)', 'var(--color-accent-800)'],
  'Up next': ['var(--color-surface)', 'var(--color-text)'],
  Later: ['transparent', 'var(--muted)'],
  Done: ['var(--ok-bg)', 'var(--ok)'],
};

export function Learn() {
  const { s, a } = useApp();
  const next = nextLesson(s.lessonsDone);
  const currentPhase = PHASES.findIndex(ph => ph.topics.some(t => t.name === next?.topic));
  const tagFor = (i: number): Tag => {
    const lessons = PHASES[i].topics.flatMap(t => lessonsFor(t.name));
    if (lessons.length && lessons.every(l => s.lessonsDone.includes(l.id))) return 'Done';
    if (i === currentPhase) return 'In progress';
    if (PHASES[i].name === 'Verbal') return 'Daily CR';
    return i === currentPhase + 1 ? 'Up next' : 'Later';
  };
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
        const tag = tagFor(i);
        const [tagBg, tagInk] = TAG_COLORS[tag];
        return (
          <section key={ph.name} style={{ border: `1px solid ${i === currentPhase ? 'var(--color-accent)' : 'var(--color-divider)'}`, background: 'var(--color-bg)' }}>
            <button
              onClick={() => a.togglePhase(i)}
              aria-expanded={open}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: 14, border: 0, background: 'transparent', color: 'var(--color-text)', textAlign: 'left', cursor: 'pointer' }}
            >
              <span style={{ ...heading, fontSize: 26, lineHeight: 1, color: tag === 'Later' ? 'var(--muted)' : 'var(--color-accent-700)', width: 34 }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <span style={{ ...heading, fontSize: 20, lineHeight: 1.15 }}>{ph.name}</span>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>{ph.sub}</span>
              </span>
              <span className="tag" style={{ background: tagBg, color: tagInk }}>{tag}</span>
            </button>
            {open && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,260px),1fr))', gap: 10, padding: '0 14px 14px' }}>
                {ph.topics.map(base => {
                  const live = topicStat(base.name, s.history, s.ladders);
                  const lessons = lessonsFor(base.name);
                  const doneCount = lessons.filter(l => s.lessonsDone.includes(l.id)).length;
                  const upNext = lessons.find(l => !s.lessonsDone.includes(l.id));
                  const parts = [lessons.length ? `${doneCount} of ${lessons.length} lessons` : '', live.answered ? `${live.answered} answered · ${live.acc}%` : ''].filter(Boolean);
                  const tp = { ...base, level: live.level, current: next?.topic === base.name, status: parts.length ? parts.join(' · ') : lessons.length ? 'Not started' : base.status };
                  return (
                  <div key={tp.name} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12, border: `1px solid ${tp.current ? 'var(--color-accent)' : 'var(--color-divider)'}`, background: tp.current ? 'var(--color-accent-100)' : 'var(--color-bg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline' }}>
                      <span style={{ fontWeight: 600, fontSize: 15 }}>{tp.name}</span>
                      <span style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{levelName(tp.level)}</span>
                    </div>
                    <LevelSegments level={tp.level} />
                    <div style={{ fontSize: 13, color: 'var(--muted)' }}>{tp.status}</div>
                    {lessons.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, borderTop: BT, paddingTop: 8 }}>
                        {lessons.map(l => {
                          const done = s.lessonsDone.includes(l.id);
                          const isNext = l.id === upNext?.id;
                          return (
                            <button key={l.id} className="hover-tint" onClick={() => a.openLesson(l.id)} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, padding: '3px 0', border: 0, background: 'transparent', textAlign: 'left', cursor: 'pointer', color: isNext ? 'var(--color-text)' : 'var(--muted)' }}>
                              <span style={{ width: 16, ...heading }}>{done ? '✓' : isNext ? '→' : l.order}</span>
                              {l.title}
                            </button>
                          );
                        })}
                        {tp.current && upNext && (
                          <button className="btn btn-primary blueprint" onClick={() => a.openLesson(upNext.id)} style={{ marginTop: 10, height: 42, fontSize: 15 }}>
                            <Corners />
                            {doneCount ? 'Continue lesson' : 'Start lesson'}
                          </button>
                        )}
                        {doneCount === lessons.length && (
                          <button className="btn btn-secondary" onClick={() => a.startTopicDrill(base.name)} style={{ marginTop: 10, height: 40, fontSize: 14 }}>
                            Drill {base.name.toLowerCase()}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
