import React from 'react';
import { DataState, DeparturesData, Departure } from '../types';
import { Theme } from '../themes';

// ─── BVG official line colours ───────────────────────────────────────────────

const LINE_COLORS: Record<string, { bg: string; fg: string }> = {
  // U-Bahn
  U1:  { bg: '#55b947', fg: '#000' },
  U2:  { bg: '#d9222a', fg: '#fff' },
  U3:  { bg: '#16683d', fg: '#fff' },
  U4:  { bg: '#ffcf00', fg: '#000' },
  U5:  { bg: '#7e5330', fg: '#fff' },
  U6:  { bg: '#7d4499', fg: '#fff' },
  U7:  { bg: '#528dba', fg: '#fff' },
  U8:  { bg: '#224f86', fg: '#fff' },
  U9:  { bg: '#f3791d', fg: '#fff' },
  // S-Bahn
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

function getLineColor(lineName: string, mode: string): { bg: string; fg: string } {
  // exact match first
  if (LINE_COLORS[lineName]) return LINE_COLORS[lineName];
  // mode fallback
  return MODE_COLORS[mode] ?? { bg: '#444', fg: '#fff' };
}

// ─── Time formatting ──────────────────────────────────────────────────────────

function formatMins(when: string): { label: string; urgent: boolean } {
  const diffMs = new Date(when).getTime() - Date.now();
  const mins = Math.round(diffMs / 60000);
  if (mins <= 0) return { label: 'now', urgent: true };
  if (mins === 1) return { label: '1 min', urgent: true };
  return { label: `${mins} min`, urgent: false };
}

function formatClock(when: string): string {
  return new Date(when).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

function formatDelay(delay: number | null): string | null {
  if (!delay || delay <= 30) return null;
  const mins = Math.round(delay / 60);
  return `+${mins}m`;
}

// ─── Mode section header ──────────────────────────────────────────────────────

const MODE_LABELS: Record<string, string> = {
  subway:   'U-Bahn',
  suburban: 'S-Bahn',
  tram:     'Tram',
  bus:      'Bus',
};

// ─── Departure row ────────────────────────────────────────────────────────────

interface DepRowProps {
  dep: Departure;
  theme: Theme;
  isLast: boolean;
}

const DepRow: React.FC<DepRowProps> = ({ dep, theme, isLast }) => {
  const { label: timeLabel, urgent } = formatMins(dep.when);
  const clockLabel = formatClock(dep.when);
  const delayStr = formatDelay(dep.delay);
  const lineColor = getLineColor(dep.line.name, dep.line.mode);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.65rem 0',
        borderBottom: isLast ? 'none' : `1px solid ${theme.textColor}0d`,
      }}
    >
      {/* Line badge */}
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '2.2rem',
          height: '1.4rem',
          borderRadius: '0.25rem',
          backgroundColor: lineColor.bg,
          color: lineColor.fg,
          fontSize: '0.72rem',
          fontWeight: 900,
          letterSpacing: '0.02em',
          flexShrink: 0,
          padding: '0 0.35rem',
        }}
      >
        {dep.line.name}
      </span>

      {/* Direction */}
      <span
        style={{
          flex: 1,
          fontSize: '0.82rem',
          fontWeight: 400,
          color: theme.textColor,
          opacity: 0.85,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          letterSpacing: '0.01em',
        }}
      >
        {dep.direction}
      </span>

      {/* Time block */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', flexShrink: 0 }}>
        {/* Delay pill */}
        {delayStr && (
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 700,
              color: '#f59e0b',
              backgroundColor: 'rgba(245,158,11,0.12)',
              borderRadius: '0.2rem',
              padding: '0.1rem 0.3rem',
              letterSpacing: '0.03em',
            }}
          >
            {delayStr}
          </span>
        )}

        {/* Clock time (secondary, dimmer) */}
        <span
          style={{
            fontSize: '0.62rem',
            fontWeight: 400,
            color: theme.textSecondary,
            opacity: 0.5,
            letterSpacing: '0.03em',
            minWidth: '2.2rem',
            textAlign: 'right',
          }}
        >
          {clockLabel}
        </span>

        {/* Minutes countdown (primary) */}
        <span
          style={{
            fontSize: urgent ? '0.95rem' : '0.85rem',
            fontWeight: 700,
            color: urgent ? theme.accentColor : theme.textColor,
            letterSpacing: urgent ? '-0.02em' : '0',
            minWidth: '3.4rem',
            textAlign: 'right',
            opacity: urgent ? 1 : 0.9,
          }}
          className={urgent ? 'live-pulse' : undefined}
        >
          {timeLabel}
        </span>
      </div>
    </div>
  );
};

// ─── Group by mode, sort, limit ───────────────────────────────────────────────

interface ModeGroup {
  mode: string;
  stopName: string;
  departures: Departure[];
}

function buildGroups(departures: Departure[], hiddenModes: string[]): ModeGroup[] {
  const map = new Map<string, Departure[]>();
  departures.forEach(d => {
    if (hiddenModes.includes(d.line.mode)) return;
    const key = d.line.mode;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(d);
  });

  const order = ['subway', 'suburban', 'tram', 'bus'];
  return order
    .filter(m => map.has(m))
    .map(m => {
      const deps = map.get(m)!.sort(
        (a, b) => new Date(a.when).getTime() - new Date(b.when).getTime()
      );
      return {
        mode: m,
        stopName: deps[0]?.stop?.name ?? '',
        departures: deps.slice(0, 3),
      };
    });
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

const Skeleton: React.FC<{ theme: Theme }> = ({ theme: _theme }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
    {[70, 90, 60, 80].map((w, i) => (
      <div
        key={i}
        className="shimmer"
        style={{ height: '2rem', width: `${w}%`, borderRadius: '0.375rem', opacity: 0.5 + i * 0.1 }}
      />
    ))}
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

interface DeparturesCardProps {
  departuresState: DataState<DeparturesData>;
  theme: Theme;
  hiddenModes?: string[];
}

export const DeparturesCard: React.FC<DeparturesCardProps> = ({
  departuresState,
  theme,
  hiddenModes = [],
}) => {
  const { data, status } = departuresState;

  if (status === 'loading' || status === 'idle') {
    return <Skeleton theme={theme} />;
  }

  if (status === 'error') {
    return (
      <span style={{ fontSize: '0.7rem', color: theme.textSecondary, opacity: 0.4 }}>
        Transit unavailable
      </span>
    );
  }

  if (!data || data.departures.length === 0) {
    return (
      <span style={{ fontSize: '0.7rem', color: theme.textSecondary, opacity: 0.4 }}>
        No departures
      </span>
    );
  }

  const groups = buildGroups(data.departures, hiddenModes);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
      {groups.map(group => (
        <div key={group.mode}>
          {/* Group header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '0.3rem',
            }}
          >
            {/* Mode icon pill */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '1.3rem',
                height: '1.3rem',
                borderRadius: '50%',
                backgroundColor: MODE_COLORS[group.mode]?.bg ?? '#444',
                color: '#fff',
                fontSize: '0.6rem',
                fontWeight: 900,
                letterSpacing: '0.02em',
                flexShrink: 0,
              }}
            >
              {MODE_LABELS[group.mode]?.[0] ?? '?'}
            </span>

            {/* Mode label */}
            <span
              style={{
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: theme.textSecondary,
                opacity: 0.55,
              }}
            >
              {MODE_LABELS[group.mode] ?? group.mode}
            </span>

            {/* Stop name */}
            {group.stopName && (
              <>
                <span style={{ color: theme.textSecondary, opacity: 0.2, fontSize: '0.55rem' }}>·</span>
                <span
                  style={{
                    fontSize: '0.58rem',
                    fontWeight: 400,
                    color: theme.textSecondary,
                    opacity: 0.35,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {group.stopName}
                </span>
              </>
            )}

            {/* Hairline */}
            <div
              style={{
                flex: 1,
                height: '1px',
                backgroundColor: theme.textColor,
                opacity: 0.06,
              }}
            />
          </div>

          {/* Departure rows */}
          <div>
            {group.departures.map((dep, idx) => (
              <DepRow
                key={`${dep.tripId}-${idx}`}
                dep={dep}
                theme={theme}
                isLast={idx === group.departures.length - 1}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
