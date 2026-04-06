import React, { useState, useEffect } from 'react';
import { DataState, WeatherData, DeparturesData, Departure } from '../types';
import { Theme } from '../themes';

// ─── Variant config ───────────────────────────────────────────────────────────

export type BvgVariant = 'amber' | 'green' | 'large' | 'clean';

interface VariantCfg {
  bg: string;
  color: string;
  colorDim: string;
  colorFaint: string;
  divider: string;
  glow: string | null;
  font: string;
  rowSize: string;       // clamp for main row text
  nextSize: string;      // clamp for following times
  headerSize: string;    // clamp for header bar text
  maxRows: number;
  showStrip: boolean;    // colored left strip per row
}

const VARIANTS: Record<BvgVariant, VariantCfg> = {
  amber: {
    bg: '#000000',
    color: '#ffb200',
    colorDim: 'rgba(255,178,0,0.40)',
    colorFaint: 'rgba(255,178,0,0.22)',
    divider: 'rgba(255,178,0,0.12)',
    glow: '0 0 8px rgba(255,178,0,0.6), 0 0 2px rgba(255,178,0,0.9)',
    font: "'VT323', 'Courier New', monospace",
    rowSize: 'clamp(2rem, 4.8vh, 4.2rem)',
    nextSize: 'clamp(1.2rem, 2.8vh, 2.4rem)',
    headerSize: 'clamp(1.6rem, 3.5vh, 3rem)',
    maxRows: 6,
    showStrip: false,
  },
  green: {
    bg: '#000d02',
    color: '#00e05a',
    colorDim: 'rgba(0,224,90,0.42)',
    colorFaint: 'rgba(0,224,90,0.22)',
    divider: 'rgba(0,224,90,0.14)',
    glow: '0 0 10px rgba(0,224,90,0.65), 0 0 3px rgba(0,224,90,0.9)',
    font: "'VT323', 'Courier New', monospace",
    rowSize: 'clamp(2rem, 4.8vh, 4.2rem)',
    nextSize: 'clamp(1.2rem, 2.8vh, 2.4rem)',
    headerSize: 'clamp(1.6rem, 3.5vh, 3rem)',
    maxRows: 6,
    showStrip: false,
  },
  large: {
    bg: '#000000',
    color: '#ffb200',
    colorDim: 'rgba(255,178,0,0.40)',
    colorFaint: 'rgba(255,178,0,0.20)',
    divider: 'rgba(255,178,0,0.10)',
    glow: '0 0 12px rgba(255,178,0,0.7), 0 0 3px rgba(255,178,0,0.95)',
    font: "'VT323', 'Courier New', monospace",
    rowSize: 'clamp(2.8rem, 7vh, 6rem)',
    nextSize: 'clamp(1.6rem, 3.8vh, 3.2rem)',
    headerSize: 'clamp(2rem, 4.5vh, 3.8rem)',
    maxRows: 4,
    showStrip: false,
  },
  clean: {
    bg: '#0c0c0f',
    color: 'rgba(255,255,255,0.92)',
    colorDim: 'rgba(255,255,255,0.38)',
    colorFaint: 'rgba(255,255,255,0.20)',
    divider: 'rgba(255,255,255,0.07)',
    glow: null,
    font: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
    rowSize: 'clamp(1rem, 2.6vh, 2.2rem)',
    nextSize: 'clamp(0.8rem, 1.8vh, 1.5rem)',
    headerSize: 'clamp(0.9rem, 2vh, 1.6rem)',
    maxRows: 7,
    showStrip: true,
  },
};

// ─── BVG line colours (for clean strip) ──────────────────────────────────────

const LINE_COLORS: Record<string, string> = {
  U1:'#55b947', U2:'#d9222a', U3:'#16683d', U4:'#ffcf00', U5:'#7e5330',
  U6:'#7d4499', U7:'#528dba', U8:'#224f86', U9:'#f3791d',
  S1:'#da5cbc', S2:'#007734', S3:'#0065b3', S5:'#f54f2c',
  S7:'#716ba6', S8:'#55b947', S9:'#a04f75',
};
const MODE_COLORS: Record<string, string> = {
  subway:'#0050a0', suburban:'#007734', tram:'#cc0000', bus:'#5c3d8f',
};
function lineColor(name: string, mode: string): string {
  return LINE_COLORS[name] ?? MODE_COLORS[mode] ?? '#444';
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getMins(when: string): number {
  return Math.round((new Date(when).getTime() - Date.now()) / 60000);
}
function formatAbfahrt(when: string): string {
  const m = getMins(when);
  return m <= 0 ? 'sofort' : `${m} min`;
}

interface GroupedRow {
  key: string;
  lineName: string;
  lineMode: string;
  direction: string;
  whens: string[];
}

function groupDepartures(deps: Departure[], hiddenModes: string[], maxRows: number): GroupedRow[] {
  const map = new Map<string, GroupedRow>();
  deps
    .filter(d => !hiddenModes.includes(d.line.mode))
    .sort((a, b) => new Date(a.when).getTime() - new Date(b.when).getTime())
    .forEach(d => {
      const key = `${d.line.name}||${d.direction}`;
      if (!map.has(key)) map.set(key, { key, lineName: d.line.name, lineMode: d.line.mode, direction: d.direction, whens: [] });
      const g = map.get(key)!;
      if (g.whens.length < 3) g.whens.push(d.when);
    });

  const groups = Array.from(map.values());

  const lineEarliest = new Map<string, number>();
  groups.forEach(g => {
    const t = new Date(g.whens[0]).getTime();
    if (!lineEarliest.has(g.lineName) || t < lineEarliest.get(g.lineName)!)
      lineEarliest.set(g.lineName, t);
  });

  groups.sort((a, b) => {
    const la = lineEarliest.get(a.lineName)!;
    const lb = lineEarliest.get(b.lineName)!;
    if (la !== lb) return la - lb;
    return new Date(a.whens[0]).getTime() - new Date(b.whens[0]).getTime();
  });

  const lineCount = new Map<string, number>();
  const result: GroupedRow[] = [];
  for (const g of groups) {
    const c = lineCount.get(g.lineName) ?? 0;
    if (c >= 2) continue;
    lineCount.set(g.lineName, c + 1);
    result.push(g);
    if (result.length === maxRows) break;
  }
  return result;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const BvgSkeleton: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
    {[...Array(4)].map((_, i) => (
      <div key={i} className="shimmer" style={{
        flex: 1, margin: '3px 0', borderRadius: 2,
        opacity: 0.12 + i * 0.03,
        background: `linear-gradient(90deg, transparent, ${color}20, transparent)`,
        backgroundSize: '200% 100%',
        animation: 'shimmerSlide 1.8s ease-in-out infinite',
      }} />
    ))}
  </div>
);

// ─── Props ────────────────────────────────────────────────────────────────────

interface BvgLayoutProps {
  theme: Theme;
  weatherState: DataState<WeatherData>;
  departuresState: DataState<DeparturesData>;
  hiddenModes?: string[];
  variant?: BvgVariant;
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export const BvgLayout: React.FC<BvgLayoutProps> = ({
  weatherState,
  departuresState,
  hiddenModes = [],
  variant = 'amber',
}) => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const cfg = VARIANTS[variant];
  const isLoading = departuresState.status === 'idle' || departuresState.status === 'loading';
  const allDeps: Departure[] = departuresState.data?.departures ?? [];
  const groups = groupDepartures(allDeps, hiddenModes, cfg.maxRows);
  const stopName = allDeps.find(d => !hiddenModes.includes(d.line.mode))?.stop?.name ?? '';
  const weather = weatherState.status === 'success' ? weatherState.data : null;

  const timeStr = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', hour12: false });
  const dateStr = now.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase();

  const isClean = variant === 'clean';

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: cfg.bg,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: cfg.font,
    }}>

      {/* ── Header bar ───────────────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: isClean ? '1.8rem' : '2rem',
        padding: isClean ? '0.9rem 2.4rem' : '0.55rem 2.4rem',
        borderBottom: `1px solid ${cfg.divider}`,
      }}>
        <span style={{
          fontSize: isClean ? 'clamp(1.4rem, 3.5vh, 2.8rem)' : `clamp(2rem, 4.5vh, 3.8rem)`,
          color: cfg.color,
          letterSpacing: isClean ? '-0.03em' : '0.05em',
          lineHeight: 1,
          fontWeight: isClean ? 200 : 400,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {timeStr}
        </span>

        {isClean && (
          <span style={{ fontSize: cfg.headerSize, color: cfg.colorDim, letterSpacing: '0.12em', lineHeight: 1, fontWeight: 600, textTransform: 'uppercase' }}>
            {dateStr}
          </span>
        )}

        {weather && (
          <>
            <span style={{ fontSize: cfg.headerSize, color: cfg.colorDim, lineHeight: 1, fontWeight: isClean ? 300 : 400, letterSpacing: isClean ? '0' : '0.04em' }}>
              {Math.round(weather.main.temp)}°C
            </span>
            <span style={{ fontSize: isClean ? `clamp(0.75rem, 1.6vh, 1.3rem)` : `clamp(1.2rem, 2.5vh, 2.2rem)`, color: cfg.colorFaint, lineHeight: 1, letterSpacing: isClean ? '0.02em' : '0.04em' }}>
              {weather.weather[0]?.description}
            </span>
          </>
        )}

        {stopName && (
          <span style={{
            marginLeft: 'auto',
            fontSize: isClean ? `clamp(0.65rem, 1.4vh, 1.1rem)` : `clamp(1rem, 2vh, 1.8rem)`,
            color: cfg.colorFaint,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            lineHeight: 1,
            fontWeight: isClean ? 500 : 400,
          }}>
            {stopName}
          </span>
        )}
      </div>

      {/* ── Departure rows ────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: `0 ${isClean ? '0' : '2.4rem'} ${isClean ? '0' : '1rem'}`, minHeight: 0 }}>
        {isLoading ? (
          <div style={{ padding: isClean ? '0 2.4rem' : '0', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <BvgSkeleton color={cfg.color} />
          </div>
        ) : groups.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: cfg.colorDim, fontSize: '2rem', letterSpacing: '0.15em' }}>KEINE ABFAHRTEN</span>
          </div>
        ) : (
          groups.map((group, i) => {
            const firstMins = getMins(group.whens[0]);
            const urgent = firstMins <= 2;
            const isLast = i === groups.length - 1;
            const lc = lineColor(group.lineName, group.lineMode);
            const textGlow = cfg.glow && urgent ? cfg.glow : 'none';

            if (isClean) {
              // ── Clean variant: strip + sans-serif ────────────────────────────
              return (
                <div key={group.key} style={{
                  flex: 1, display: 'flex', alignItems: 'center',
                  borderBottom: isLast ? 'none' : `1px solid ${cfg.divider}`,
                  minHeight: 0,
                  background: i % 2 === 1 ? 'rgba(255,255,255,0.018)' : 'transparent',
                }}>
                  {/* Color strip */}
                  <div style={{ width: 5, alignSelf: 'stretch', background: lc, flexShrink: 0 }} />

                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '6rem 1fr auto', alignItems: 'center', padding: '0 2rem 0 1.6rem', gap: '0.5rem' }}>
                    <span style={{ fontSize: cfg.rowSize, fontWeight: 700, color: cfg.color, letterSpacing: '-0.01em', lineHeight: 1 }}
                      className={urgent ? 'live-pulse' : undefined}>
                      {group.lineName}
                    </span>
                    <span style={{ fontSize: cfg.rowSize, fontWeight: 300, color: cfg.color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1, paddingRight: '2rem' }}>
                      {group.direction}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.2rem', whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: cfg.rowSize, fontWeight: urgent ? 700 : 400, color: urgent ? '#ef4444' : cfg.color, lineHeight: 1 }}
                        className={urgent ? 'live-pulse' : undefined}>
                        {formatAbfahrt(group.whens[0])}
                      </span>
                      {group.whens.slice(1).map((w, j) => (
                        <span key={j} style={{ fontSize: cfg.nextSize, color: cfg.colorDim, lineHeight: 1 }}>
                          {formatAbfahrt(w)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            // ── Pixel variants (amber / green / large) ────────────────────────
            return (
              <div key={group.key} style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: '6.5rem 1fr auto',
                alignItems: 'center',
                padding: '0 2.4rem',
                borderBottom: isLast ? 'none' : `1px solid ${cfg.divider}`,
                minHeight: 0,
              }}>
                <span style={{ fontSize: cfg.rowSize, color: cfg.color, letterSpacing: '0.04em', lineHeight: 1, textShadow: textGlow }}
                  className={urgent ? 'live-pulse' : undefined}>
                  {group.lineName}
                </span>
                <span style={{ fontSize: cfg.rowSize, color: cfg.color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '0.04em', paddingRight: '2rem', lineHeight: 1 }}>
                  {group.direction}
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.4rem', whiteSpace: 'nowrap' }}>
                  <span style={{ fontSize: cfg.rowSize, color: cfg.color, letterSpacing: '0.04em', lineHeight: 1, textShadow: textGlow }}
                    className={urgent ? 'live-pulse' : undefined}>
                    {formatAbfahrt(group.whens[0])}
                  </span>
                  {group.whens.slice(1).map((w, j) => (
                    <span key={j} style={{ fontSize: cfg.nextSize, color: cfg.colorDim, letterSpacing: '0.04em', lineHeight: 1 }}>
                      {formatAbfahrt(w)}
                    </span>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
