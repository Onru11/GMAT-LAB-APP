import { LETTERS } from '../data';
import { QUESTIONS } from '../content/bank';
import { TESTS } from '../content/select';
import { fmtTime, useApp } from '../store';
import { BT, CloseButton, Corners, FocusTitle, PrimaryButton, Svg, heading, rowTop, tabular } from '../components/ui';

export const MAX_EDITS = 3;

export function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <Svg size={18}>
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" fill={filled ? 'currentColor' : 'none'} />
    </Svg>
  );
}

/** End-of-section screen, as on the exam: see every answer and bookmark, change up to three. */
export function SectionReview() {
  const { s, a } = useApp();
  const run = s.run!;
  const section = run.section ?? 'Quant';
  const left = TESTS[section].minutes * 60 - run.sectionSec;
  const editsLeft = MAX_EDITS - run.edits;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <CloseButton onClick={() => confirm('Leave the test? It will not be scored.') && a.go('tests')} label="Leave test" />
        <FocusTitle title="Question review & edit" meta={`${section} · ${run.answers.length} answered`} size={17} />
        <span style={{ ...heading, fontSize: 22, ...tabular, color: left < 300 ? 'var(--bad)' : 'var(--color-text)' }} aria-label={`${fmtTime(left)} left in the section`}>
          {fmtTime(left)}
        </span>
      </div>
      <section className="blueprint" style={{ background: 'var(--color-bg)', padding: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Corners />
        <span style={{ ...heading, fontSize: 18 }}>
          {editsLeft} of {MAX_EDITS} answer changes left
        </span>
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>Like the real exam: reopen any question, keep or change your answer. Bookmarked questions are marked. Opening a question only uses a change if you pick a different answer.</span>
      </section>
      <div style={{ border: BT, background: 'var(--color-bg)' }}>
        {run.answers.map((ans, i) => {
          const q = QUESTIONS[ans.qid];
          const flagged = run.flags.includes(ans.qid);
          return (
            <button
              key={ans.qid}
              className="hover-tint"
              disabled={editsLeft <= 0}
              onClick={() => a.editAnswer(i)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', border: 0, borderTop: rowTop(i), background: 'transparent', color: 'var(--color-text)', textAlign: 'left', cursor: editsLeft > 0 ? 'pointer' : 'default' }}
            >
              <span style={{ ...heading, width: 26, fontSize: 16, color: 'var(--muted)' }}>{i + 1}</span>
              <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 500, fontSize: 14 }}>{q.topic}</span>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>{q.kind}</span>
              </span>
              {flagged && (
                <span style={{ color: 'var(--warn)' }} aria-label="Bookmarked">
                  <BookmarkIcon filled />
                </span>
              )}
              <span style={{ ...heading, width: 30, height: 30, display: 'grid', placeItems: 'center', border: BT, fontSize: 15 }} aria-label={`Answer ${LETTERS[ans.sel]}`}>
                {LETTERS[ans.sel]}
              </span>
            </button>
          );
        })}
      </div>
      <PrimaryButton onClick={a.finishSection} style={{ height: 50, fontSize: 17 }}>
        Finish section
      </PrimaryButton>
    </div>
  );
}
