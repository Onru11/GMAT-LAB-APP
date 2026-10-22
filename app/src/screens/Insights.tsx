import { useRef, useState } from 'react';
import { MISS_REASONS } from '../data';
import { QUESTIONS } from '../content/bank';
import type { Section } from '../content/questions';
import { serializeProgress } from '../persist';
import { fmtTime, useApp } from '../store';
import { BT, Corners, H2, heading, rowTop, tabular } from '../components/ui';

const SECTIONS: Section[] = ['Quant', 'Data Insights', 'Verbal'];

/** Pacing, reasons for misses, and section-test trend. */
export function Insights() {
  const { s } = useApp();
  const pacing = SECTIONS.map(sec => {
    const recent = s.history.filter(a => QUESTIONS[a.qid]?.section === sec).slice(-40);
    const avg = recent.length ? Math.round(recent.reduce((n, a) => n + a.sec, 0) / recent.length) : null;
    const slow = recent.length ? Math.round((100 * recent.filter(a => a.sec > 120).length) / recent.length) : null;
    return { sec, avg, slow, n: recent.length };
  });
  const reasons = [...MISS_REASONS, 'Not tagged'].map(r => ({ r, n: s.mistakes.filter(m => m.reason === r).length })).filter(x => x.n);
  const maxReason = Math.max(1, ...reasons.map(x => x.n));
  const trend = (['Quant', 'Data Insights'] as const).map(sec => ({ sec, scores: s.tests.filter(t => t.section === sec).slice(-6) }));

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <H2>Insights</H2>
      <div style={{ border: BT, background: 'var(--color-bg)' }}>
        <div style={{ padding: '10px 14px', fontSize: 12, color: 'var(--muted)' }}>Pacing · last 40 answers per section · target 2:00</div>
        {pacing.map(({ sec, avg, slow, n }, i) => (
          <div key={sec} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 14, alignItems: 'baseline', padding: '10px 14px', borderTop: rowTop(i + 1) }}>
            <span style={{ fontWeight: 500, fontSize: 14 }}>{sec}</span>
            <span style={{ ...heading, fontSize: 20, ...tabular, color: avg != null && avg > 120 ? 'var(--bad)' : 'var(--color-text)' }}>{avg == null ? '—' : fmtTime(avg)}</span>
            <span style={{ fontSize: 12, color: 'var(--muted)', minWidth: 92, textAlign: 'right' }}>{n ? `${slow}% over 2:00` : 'no answers yet'}</span>
          </div>
        ))}
      </div>

      <div style={{ border: BT, background: 'var(--color-bg)', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>Why you miss · open mistakes by the reason you tagged</span>
        {reasons.length ? (
          reasons.map(({ r, n }) => (
            <div key={r} style={{ display: 'grid', gridTemplateColumns: '150px 1fr 24px', gap: 10, alignItems: 'center', fontSize: 14 }}>
              <span>{r}</span>
              <span style={{ height: 6, background: 'var(--color-divider)' }}>
                <span style={{ display: 'block', height: '100%', width: (n / maxReason) * 100 + '%', background: r === 'Not tagged' ? 'var(--muted)' : 'var(--color-accent)' }} />
              </span>
              <span style={{ ...heading, textAlign: 'right' }}>{n}</span>
            </div>
          ))
        ) : (
          <span style={{ fontSize: 14, color: 'var(--muted)' }}>No open mistakes.</span>
        )}
      </div>

      <div style={{ border: BT, background: 'var(--color-bg)' }}>
        <div style={{ padding: '10px 14px', fontSize: 12, color: 'var(--muted)' }}>Section tests · last six</div>
        {trend.map(({ sec, scores }, i) => (
          <div key={sec} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'center', padding: '10px 14px', borderTop: rowTop(i + 1) }}>
            <span style={{ fontWeight: 500, fontSize: 14 }}>{sec}</span>
            <span style={{ display: 'flex', gap: 6, ...heading, fontSize: 17, ...tabular }}>
              {scores.length ? scores.map((t, j) => (
                <span key={j} style={{ color: j === scores.length - 1 ? 'var(--color-text)' : 'var(--muted)' }}>{t.score}</span>
              )) : <span style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 13, color: 'var(--muted)' }}>no tests yet</span>}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Save progress to a file and restore it, e.g. to move to another device. */
export function Backup() {
  const { s, a } = useApp();
  const file = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const exportFile = () => {
    const blob = new Blob([serializeProgress(s)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gmat-lab-progress-${s.day}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMsg({ ok: true, text: 'Backup saved.' });
  };
  const importFile = async (f: File) => {
    if (!confirm('Replace your current progress with this backup?')) return;
    const ok = a.importProgress(await f.text());
    setMsg(ok ? { ok: true, text: 'Progress restored.' } : { ok: false, text: 'That file is not a GMAT Lab backup.' });
  };

  return (
    <section className="blueprint" style={{ background: 'var(--color-bg)', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Corners />
      <div>
        <span style={{ ...heading, fontSize: 20 }}>Backup</span>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>Progress is saved in this browser. Export it to keep a copy or move it to another device.</div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-secondary" style={{ flex: 1, height: 44 }} onClick={exportFile}>
          Export progress
        </button>
        <button className="btn btn-secondary" style={{ flex: 1, height: 44 }} onClick={() => file.current?.click()}>
          Import backup
        </button>
        <input ref={file} type="file" accept="application/json,.json" hidden onChange={e => e.target.files?.[0] && importFile(e.target.files[0])} />
      </div>
      {msg && (
        <div role="status" style={{ fontSize: 13, color: msg.ok ? 'var(--ok)' : 'var(--bad)' }}>
          {msg.text}
        </div>
      )}
    </section>
  );
}
