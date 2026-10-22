import type { CSSProperties, ReactNode } from 'react';

export const BT = '1px solid var(--color-divider)';
/** Border-top for every row after the first in a hairline list. */
export const rowTop = (i: number) => (i ? BT : '0');

export const heading: CSSProperties = { fontFamily: 'var(--font-heading)', fontWeight: 600 };
export const tabular: CSSProperties = { fontVariantNumeric: 'tabular-nums' };
export const muted: CSSProperties = { color: 'var(--muted)' };

/** The four "+" registration marks a .blueprint frame wears. */
export function Corners() {
  return (
    <>
      <i className="corner tl" />
      <i className="corner tr" />
      <i className="corner bl" />
      <i className="corner br" />
    </>
  );
}

/** Small uppercase label above titles and sections. */
export function Kicker({ children, color = 'var(--muted)', size = 13, style }: { children: ReactNode; color?: string; size?: number; style?: CSSProperties }) {
  return (
    <div style={{ fontFamily: 'var(--font-heading)', fontSize: size, letterSpacing: '.12em', textTransform: 'uppercase', color, ...style }}>
      {children}
    </div>
  );
}

export function PageHeader({ kicker, title, sub, size = 38 }: { kicker?: string; title: string; sub?: ReactNode; size?: number }) {
  return (
    <header>
      {kicker && <Kicker>{kicker}</Kicker>}
      <h1 style={{ margin: kicker ? (sub ? '2px 0 4px' : '2px 0 0') : 0, fontSize: size, lineHeight: 1 }}>{title}</h1>
      {sub && <div style={{ fontSize: 14, color: 'var(--muted)', textWrap: 'pretty', marginTop: kicker ? 0 : 4 } as CSSProperties}>{sub}</div>}
    </header>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 style={{ margin: 0, fontSize: 22 }}>{children}</h2>;
}

interface PrimaryProps {
  children: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
  className?: string;
}

/** Solid accent button framed as a blueprint object. */
export function PrimaryButton({ children, onClick, style, className = '' }: PrimaryProps) {
  return (
    <button className={`btn btn-primary blueprint ${className}`} onClick={onClick} style={style}>
      <Corners />
      {children}
    </button>
  );
}

// ── Icons (Lucide paths, 1.5 stroke) ──

interface IconProps {
  size?: number;
  stroke?: string;
  width?: number;
  style?: CSSProperties;
  children: ReactNode;
}

export function Svg({ size = 20, stroke = 'currentColor', width = 1.5, style, children }: IconProps) {
  return (
    <svg style={style} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

export const CloseIcon = ({ size = 22 }: { size?: number }) => (
  <Svg size={size}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </Svg>
);
export const ChevronLeft = ({ size = 18 }: { size?: number }) => (
  <Svg size={size}>
    <path d="m15 18-6-6 6-6" />
  </Svg>
);
export const ChevronRight = ({ size = 20 }: { size?: number }) => (
  <Svg size={size}>
    <path d="m9 18 6-6-6-6" />
  </Svg>
);
export const ArrowRight = ({ size = 18 }: { size?: number }) => (
  <Svg size={size}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </Svg>
);
export const FlameIcon = ({ size = 18 }: { size?: number }) => (
  <Svg size={size} stroke="var(--warn)">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </Svg>
);
/** Check mark; `animated` draws the stroke in. */
export const CheckIcon = ({ size = 16, width = 2, stroke, animated, duration = 0.5, delay = 0, style }: { size?: number; width?: number; stroke?: string; animated?: boolean; duration?: number; delay?: number; style?: CSSProperties }) => (
  <Svg size={size} width={width} stroke={stroke} style={animated ? { strokeDasharray: 30, animation: `draw ${duration}s ${delay}s both`, ...style } : style}>
    <path d="M20 6 9 17l-5-5" />
  </Svg>
);

/** Icon-only close button used at the top of focus screens. */
export function CloseButton({ onClick, label = 'Close' }: { onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick} className="btn btn-ghost btn-icon" style={{ color: 'var(--color-text)' }} aria-label={label}>
      <CloseIcon />
    </button>
  );
}

/** Ghost "‹ Label" button back to a parent screen. */
export function BackLink({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button onClick={onClick} className="btn btn-ghost" style={{ alignSelf: 'flex-start', gap: 4, paddingLeft: 0, fontSize: 15 }}>
      <ChevronLeft />
      {children}
    </button>
  );
}

/** Solid green square with a drawn check, used on completion cards. */
export function DoneBadge({ size = 48, icon = 26, delay = 0.15 }: { size?: number; icon?: number; delay?: number }) {
  return (
    <span style={{ width: size, height: size, display: 'grid', placeItems: 'center', background: 'var(--ok)', color: 'var(--color-bg)' }}>
      <CheckIcon size={icon} animated delay={delay} />
    </span>
  );
}

/** Five-step level meter. */
export function LevelSegments({ level, height = 5, gap = 3, cols = 'repeat(5,1fr)', as = 'div' }: { level: number; height?: number; gap?: number; cols?: string; as?: 'div' | 'span' }) {
  const Tag = as;
  return (
    <Tag style={{ display: 'grid', gridTemplateColumns: cols, gap, width: as === 'span' && cols === 'repeat(5,1fr)' ? '100%' : undefined }}>
      {[0, 1, 2, 3, 4].map(i => (
        <Tag key={i} style={{ height, background: i <= level ? 'var(--color-accent)' : 'var(--color-divider)' }} />
      ))}
    </Tag>
  );
}

/** Thin progress bar under focus-screen headers. */
export function ProgressLine({ pct, transition = 'width .3s' }: { pct: number; transition?: string }) {
  return (
    <div style={{ height: 3, background: 'var(--color-divider)' }}>
      <div style={{ height: '100%', width: pct + '%', background: 'var(--color-accent)', transition }} />
    </div>
  );
}

/** Small segmented toggle (flashcard mode, progress section). */
export function MiniSegment<T>({ options, value, onChange, background }: { options: [label: string, value: T][]; value: T; onChange: (v: T) => void; background?: string }) {
  return (
    <div style={{ display: 'flex', border: BT, background }}>
      {options.map(([label, v]) => {
        const on = v === value;
        return (
          <button
            key={label}
            onClick={() => onChange(v)}
            aria-pressed={on}
            style={{ padding: '6px 12px', border: 0, background: on ? 'var(--color-accent)' : 'transparent', color: on ? 'var(--color-bg)' : 'var(--color-text)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

/** Title + meta line used in focus-screen headers. */
export function FocusTitle({ title, meta, size = 18 }: { title: string; meta: string; size?: number }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <span style={{ ...heading, fontSize: size, lineHeight: 1.1 }}>{title}</span>
      <span style={{ fontSize: 12, color: 'var(--muted)' }}>{meta}</span>
    </div>
  );
}
