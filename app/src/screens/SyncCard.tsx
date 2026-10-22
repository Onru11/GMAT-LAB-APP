import { useState } from 'react';
import { useSyncApi, type SyncStatus } from '../sync/useSync';
import { Corners, heading } from '../components/ui';

const STATUS: Record<SyncStatus, [label: string, color: string]> = {
  off: ['Off', 'var(--muted)'],
  'signed-out': ['Not signed in', 'var(--muted)'],
  syncing: ['Syncing…', 'var(--color-accent-700)'],
  synced: ['Up to date', 'var(--ok)'],
  offline: ['Offline · will sync when back online', 'var(--warn)'],
  error: ['Couldn’t sync', 'var(--bad)'],
};

const ago = (t: number) => {
  const s = Math.round((Date.now() - t) / 1000);
  return s < 60 ? 'just now' : s < 3600 ? `${Math.round(s / 60)} min ago` : `${Math.round(s / 3600)} h ago`;
};

/** Sign in to sync progress across devices. Hidden when the build has no sync backend. */
export function SyncCard() {
  const sync = useSyncApi();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  if (!sync.configured) return null;

  const run = async (f: () => Promise<void>, ok?: string) => {
    setBusy(true);
    setMsg(null);
    try {
      await f();
      if (ok) setMsg({ ok: true, text: ok });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : 'Something went wrong. Try again.' });
    } finally {
      setBusy(false);
    }
  };
  const [label, color] = STATUS[sync.status];

  return (
    <section className="blueprint" style={{ background: 'var(--color-bg)', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Corners />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
        <span style={{ ...heading, fontSize: 20 }}>Sync across devices</span>
        <span role="status" style={{ fontSize: 13, color }}>{label}</span>
      </div>

      {sync.email ? (
        <>
          <div style={{ fontSize: 14 }}>
            Signed in as <strong>{sync.email}</strong>
            {sync.lastSynced && <span style={{ color: 'var(--muted)' }}> · synced {ago(sync.lastSynced)}</span>}
          </div>
          {sync.status === 'error' && sync.error && <div style={{ fontSize: 13, color: 'var(--bad)' }}>{sync.error}</div>}
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary" style={{ flex: 1, height: 44 }} onClick={sync.syncNow} disabled={sync.status === 'syncing'}>
              Sync now
            </button>
            <button className="btn btn-secondary" style={{ flex: 1, height: 44 }} onClick={() => run(sync.signOut)}>
              Sign out
            </button>
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Signing out keeps your progress on this device.</div>
        </>
      ) : (
        <>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>Sign in with your email on each device. Progress from all of them is combined; nothing is overwritten.</div>
          <div className="field">
            <label htmlFor="sync-email">Email</label>
            <input id="sync-email" className="input" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={{ height: 44 }} />
          </div>
          {!sent ? (
            <button className="btn btn-primary" style={{ height: 44 }} disabled={busy || !/\S+@\S+\.\S+/.test(email)} onClick={() => run(async () => { await sync.sendSignIn(email.trim()); setSent(true); }, 'Check your email for a sign-in link or a 6-digit code.')}>
              Email me a sign-in code
            </button>
          ) : (
            <>
              <div className="field">
                <label htmlFor="sync-code">6-digit code</label>
                <input id="sync-code" className="input" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} style={{ height: 44, letterSpacing: '.3em', fontSize: 18 }} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary" style={{ flex: 1, height: 44 }} onClick={() => { setSent(false); setCode(''); setMsg(null); }}>
                  Change email
                </button>
                <button className="btn btn-primary" style={{ flex: 1, height: 44 }} disabled={busy || code.length !== 6} onClick={() => run(() => sync.verifyCode(email.trim(), code).catch(() => { throw new Error('That code is wrong or has expired. Check the latest email, or send a new code.'); }))}>
                  Sign in
                </button>
              </div>
            </>
          )}
        </>
      )}
      {msg && (
        <div role="status" style={{ fontSize: 13, color: msg.ok ? 'var(--ok)' : 'var(--bad)' }}>
          {msg.text}
        </div>
      )}
    </section>
  );
}
