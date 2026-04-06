import React from 'react';
import { DataState, DeparturesData, Departure } from '../types';
import { Theme } from '../themes';

// ─────────────────────────────────────────────────────────────────────────────
// VestlBoard — large-format departure board, designed for a 3:1 wide screen
// Each departure is a full-height band. Information is the visual.
// ─────────────────────────────────────────────────────────────────────────────

// BVG official line colours
const LINE_COLORS: Record<string, { bg: string; fg: string }> = {
  U1:  { bg: '#55b947', fg: '#000' },
  U2:  { bg: '#d9222a', fg: '#fff' },
  U3:  { bg: '#16683d', fg: '#fff' },
  U4:  { bg: '#ffcf00', fg: '#000' },
  U5:  { bg: '#7e5330', fg: '#fff' },
  U6:  { bg: '#7d4499', fg: '#fff' },
  U7:  { bg: '#528dba', fg: '#fff' },
  U8:  { bg: '#224f86', fg: '#fff' },
  U9:  { bg: '#f3791d', fg: '#fff' },
  S1:  { bg: '#da5cbc', fg: '#fff' },
  S2:  { bg: '#007734', fg: '#fff' },
  S3:  { bg: '#0065b3', fg: '#fff' },
  S5:  { bg: '#f54f2c', fg: '#fff' },
  S7:  { bg: '#716ba6', fg: '#fff' },
  S75: { bg: '#716ba6', fg: '#fff' },
  S8:  { bg: '#55b947', fg: '#000' },
  S85: { bg: '#55b947', fg: '#000' },
  S9:  { bg: '#a04f75', fg: '#fff' },
  S25: { bg: '#007734', fg: '#fff' },
  S26: { bg: '#007734', fg: '#fff' },
  S41: { bg: '#bb9430', fg: '#fff' },
  S42: { bg: '#bd6312', fg: '#fff' },
  S45: { bg: '#c48f3a', fg: '#fff' },
  S46: { bg: '#c48f3a', fg: '#fff' },
  S47: { bg: '#c48f3a', fg: '#fff' },
};

const MODE_COLORS: Record<string, { bg: string; fg: string }> = {
  subway:   { bg: '#0050a0', fg: '#fff' },
  suburban: { bg: '#007734', fg: '#fff' },
  tram:     { bg: '#cc0000', fg: '#fff' },
  bus:      { bg: '#7d4499', fg: '#fff' },
};

function getLineColor(name: string, mode: string) {
  return LINE_COLORS[name] ?? MODE_COLORS[mode] ?? { bg: '#222', fg: '#fff' };
}

function formatMins(when: string): { label: string; mins: number } {
  const mins = Math.round((new Date(when).getTime() - Date.now()) / 60000);
  if (mins <= 0) return { label: 'NOW', mins: 0 };
  return { label: String(mins), mins };
}

function pickDepartures(departures: Departure[], hiddenModes: string[], count = 5): Departure[] {
  return departures
    .filter(d => !hiddenModes.includes(d.line.mode))
    .sort((a, b) => new Date(a.when).getTime() - new Date(b.when).getTime())
    .slice(0, count);
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

const WideSkeletion: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1px' }}>
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="shimmer"
        style={{ flex: 1, opacity: 0.25 + i * 0.06 }}
      />
    ))}
  </div>
);

// ─── Single departure row ─────────────────────────────────────────────────────

interface RowProps {
  dep: Departure;
  theme: Theme;
  isLast: boolean;
}

const WideRow: React.FC<RowProps> = ({ dep, theme, isLast }) => {
  const { label, mins } = formatMins(dep.when);
  const urgent = mins <= 2;
  const soon = mins <= 5 && !urgent;
  const lc = getLineColor(dep.line.name, dep.line.mode);
  const delay = dep.delay && dep.delay > 30 ? `+${Math.round(dep.delay / 60)}m` : null;

  const countdownColor = urgent
    ? '#EF4444'
    : soon
    ? '#F59E0B'
    : theme.textColor;

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: '1.8rem',
        padding: '0 2.5rem',
        borderBottom: isLast ? 'none' : `1px solid ${theme.textColor}09`,
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      {/* ── Line badge ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: lc.bg,
          color: lc.fg,
          borderRadius: '5px',
          padding: '0 0.9rem',
          height: '2rem',
          minWidth: '3.8rem',
          flexShrink: 0,
          fontSize: '0.95rem',
          fontWeight: 900,
          letterSpacing: '0.03em',
        }}
      >
        {dep.line.name}
      </div>

      {/* ── Direction + stop ── */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        <div
          style={{
            fontSize: 'clamp(1rem, 1.8vh, 1.35rem)',
            fontWeight: 300,
            color: theme.textColor,
            opacity: 0.90,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            letterSpacing: '-0.01em',
            lineHeight: 1.1,
          }}
        >
          {dep.direction}
        </div>
        {dep.stop?.name && (
          <div
            style={{
              fontSize: '0.6rem',
              fontWeight: 500,
              color: theme.textSecondary,
              opacity: 0.30,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            {dep.stop.name}{delay ? ` · ${delay} DELAY` : ''}
          </div>
        )}
      </div>

      {/* ── Countdown ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          flexShrink: 0,
          minWidth: '5rem',
        }}
      >
        <span
          style={{
            fontSize: mins === 0 ? 'clamp(1.2rem, 2.2vh, 1.6rem)' : 'clamp(1.6rem, 3.2vh, 2.4rem)',
            fontWeight: mins <= 5 ? 700 : 200,
            color: countdownColor,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            transition: 'color 0.6s ease',
          }}
          className={urgent ? 'live-pulse' : undefined}
        >
          {label}
        </span>
        {mins > 0 && (
          <span
            style={{
              fontSize: '0.55rem',
              fontWeight: 600,
              color: countdownColor,
              opacity: 0.45,
              letterSpacing: '0.14em',
              marginTop: '0.15rem',
              textTransform: 'uppercase',
            }}
          >
            MIN
          </span>
        )}
      </div>
    </div>
  );
};

// ─── Main board ───────────────────────────────────────────────────────────────

interface VestlBoardProps {
  departuresState: DataState<DeparturesData>;
  theme: Theme;
  hiddenModes?: string[];
}

export const VestlBoard: React.FC<VestlBoardProps> = ({
  departuresState,
  theme,
  hiddenModes = [],
}) => {
  const { data, status } = departuresState;

  if (status === 'loading' || status === 'idle') {
    return <WideSkeletion />;
  }

  if (status === 'error') {
    return (
      <div
        style={{
          display: 'flex',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 2.5rem',
        }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            color: theme.textSecondary,
            opacity: 0.25,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          Transit unavailable
        </span>
      </div>
    );
  }

  if (!data || data.departures.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 2.5rem',
        }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            color: theme.textSecondary,
            opacity: 0.25,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          No departures
        </span>
      </div>
    );
  }

  const deps = pickDepartures(data.departures, hiddenModes, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {deps.map((dep, i) => (
        <WideRow
          key={`${dep.tripId}-${i}`}
          dep={dep}
          theme={theme}
          isLast={i === deps.length - 1}
        />
      ))}
    </div>
  );
};
