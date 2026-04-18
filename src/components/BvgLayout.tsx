import React, { useState, useEffect } from 'react';
import { DataState, WeatherData, DeparturesData, Departure } from '../types';
import { Theme } from '../themes';

// ─── Variant config ───────────────────────────────────────────────────────────

export type BvgVariant = 'amber' | 'green' | 'large' | 'clean' | 'sbahn' | 'nova' | 'paper' | 'metro' | 'signal' | 'icons' | 'yellow' | 'day' | 'paper-icons';

export interface VariantCfg {
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
  rowPadding: string;    // vertical padding per row (controls row density)
  maxRows: number;
  showStrip: boolean;    // colored left strip per row
  showBadges?: boolean;  // BVG-style line badges instead of strip
  rowAltBg?: string;     // alternating row tint (defaults to subtle white overlay)
  urgentColor?: string;
  lineColRatio?: number; // line-name col = rowFontVh * ratio; unset → fixed '9rem' (for VT323)
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
    rowSize: 'clamp(2.6rem, 6.5vh, 5.8rem)',
    nextSize: 'clamp(1.5rem, 3.6vh, 3.2rem)',
    headerSize: 'clamp(2rem, 4.5vh, 3.8rem)',
    rowPadding: '1rem 2.4rem',
    maxRows: 8,
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
    rowSize: 'clamp(2.6rem, 6.5vh, 5.8rem)',
    nextSize: 'clamp(1.5rem, 3.6vh, 3.2rem)',
    headerSize: 'clamp(2rem, 4.5vh, 3.8rem)',
    rowPadding: '1rem 2.4rem',
    maxRows: 8,
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
    rowPadding: '1.4rem 2.4rem',
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
    rowPadding: '0 0',
    maxRows: 9,
    showStrip: true,
  },
  sbahn: {
    bg: '#0047BB',
    color: '#ffffff',
    colorDim: 'rgba(255,255,255,0.55)',
    colorFaint: 'rgba(255,255,255,0.30)',
    divider: 'rgba(255,255,255,0.12)',
    glow: null,
    font: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
    rowSize: 'clamp(2.6rem, 6.5vh, 5.8rem)',
    nextSize: 'clamp(1.5rem, 3.6vh, 3.2rem)',
    headerSize: 'clamp(2rem, 4.5vh, 3.8rem)',
    rowPadding: '1rem 2.4rem',
    maxRows: 8,
    showStrip: false,
    urgentColor: '#ffe066',
    lineColRatio: 2.6,
  },
  nova: {
    bg: '#050510',
    color: '#00d4ff',
    colorDim: 'rgba(0,212,255,0.55)',
    colorFaint: 'rgba(0,212,255,0.28)',
    divider: 'rgba(0,212,255,0.12)',
    glow: '0 0 10px rgba(0,212,255,0.7), 0 0 3px rgba(0,212,255,0.95)',
    font: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
    rowSize: 'clamp(2.6rem, 6.5vh, 5.8rem)',
    nextSize: 'clamp(1.5rem, 3.6vh, 3.2rem)',
    headerSize: 'clamp(2rem, 4.5vh, 3.8rem)',
    rowPadding: '1rem 2.4rem',
    maxRows: 8,
    showStrip: false,
    urgentColor: '#ff2d78',
    lineColRatio: 2.6,
  },
  paper: {
    bg: '#f7f4ec',
    color: '#1a1a18',
    colorDim: '#6a6a62',
    colorFaint: '#9a9a92',
    divider: '#d4d0c8',
    glow: null,
    font: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
    rowSize: 'clamp(2.6rem, 6.5vh, 5.8rem)',
    nextSize: 'clamp(1.5rem, 3.6vh, 3.2rem)',
    headerSize: 'clamp(2rem, 4.5vh, 3.8rem)',
    rowPadding: '1rem 2.4rem',
    maxRows: 8,
    showStrip: false,
    urgentColor: '#cc0000',
    lineColRatio: 2.6,
  },
  metro: {
    bg: '#111318',
    color: 'rgba(255,255,255,0.92)',
    colorDim: 'rgba(255,255,255,0.45)',
    colorFaint: 'rgba(255,255,255,0.22)',
    divider: 'rgba(255,255,255,0.07)',
    glow: null,
    font: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
    rowSize: 'clamp(2.6rem, 6.5vh, 5.8rem)',
    nextSize: 'clamp(1.5rem, 3.6vh, 3.2rem)',
    headerSize: 'clamp(2rem, 4.5vh, 3.8rem)',
    rowPadding: '1rem 2.4rem',
    maxRows: 8,
    showStrip: false,
    urgentColor: '#ef4444',
    lineColRatio: 2.6,
  },
  signal: {
    bg: '#09090b',
    color: 'rgba(255,255,255,0.92)',
    colorDim: 'rgba(255,255,255,0.38)',
    colorFaint: 'rgba(255,255,255,0.20)',
    divider: 'rgba(255,255,255,0.05)',
    glow: null,
    font: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
    rowSize: 'clamp(2.6rem, 6.5vh, 5.8rem)',
    nextSize: 'clamp(1.5rem, 3.6vh, 3.2rem)',
    headerSize: 'clamp(2rem, 4.5vh, 3.8rem)',
    rowPadding: '1rem 2.4rem',
    maxRows: 8,
    showStrip: false,
    urgentColor: '#ef4444',
    lineColRatio: 2.6,
  },
  icons: {
    bg: '#08080c',
    color: 'rgba(255,255,255,0.93)',
    colorDim: 'rgba(255,255,255,0.48)',
    colorFaint: 'rgba(255,255,255,0.24)',
    divider: 'rgba(255,255,255,0.07)',
    glow: null,
    font: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
    rowSize: 'clamp(1rem, 2.6vh, 2.2rem)',
    nextSize: 'clamp(0.8rem, 1.8vh, 1.5rem)',
    headerSize: 'clamp(0.9rem, 2vh, 1.6rem)',
    rowPadding: '0 0',
    maxRows: 8,
    showStrip: true,
    showBadges: true,
    urgentColor: '#ef4444',
    lineColRatio: 2.6,
  },
  yellow: {
    bg: '#0a0900',
    color: '#FFDD00',
    colorDim: 'rgba(255,221,0,0.42)',
    colorFaint: 'rgba(255,221,0,0.20)',
    divider: 'rgba(255,221,0,0.12)',
    glow: '0 0 10px rgba(255,221,0,0.6), 0 0 3px rgba(255,221,0,0.9)',
    font: "'VT323', 'Courier New', monospace",
    rowSize: 'clamp(2.6rem, 6.5vh, 5.8rem)',
    nextSize: 'clamp(1.5rem, 3.6vh, 3.2rem)',
    headerSize: 'clamp(2rem, 4.5vh, 3.8rem)',
    rowPadding: '1rem 2.4rem',
    maxRows: 8,
    showStrip: false,
    lineColRatio: 2.0,
  },
  day: {
    bg: '#FFDD00',
    color: '#0a0900',
    colorDim: 'rgba(10,9,0,0.50)',
    colorFaint: 'rgba(10,9,0,0.28)',
    divider: 'rgba(10,9,0,0.12)',
    glow: null,
    font: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
    rowSize: 'clamp(2.6rem, 6.5vh, 5.8rem)',
    nextSize: 'clamp(1.5rem, 3.6vh, 3.2rem)',
    headerSize: 'clamp(2rem, 4.5vh, 3.8rem)',
    rowPadding: '1rem 2.4rem',
    maxRows: 8,
    showStrip: false,
    urgentColor: '#cc0000',
    lineColRatio: 2.6,
  },
  'paper-icons': {
    bg: '#f7f4ec',
    color: '#1a1a18',
    colorDim: '#6a6a62',
    colorFaint: '#9a9a92',
    divider: '#d4d0c8',
    glow: null,
    font: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
    rowSize: 'clamp(1rem, 2.6vh, 2.2rem)',
    nextSize: 'clamp(0.8rem, 1.8vh, 1.5rem)',
    headerSize: 'clamp(0.9rem, 2vh, 1.6rem)',
    rowPadding: '0 0',
    maxRows: 9,
    showStrip: true,
    showBadges: true,
    rowAltBg: 'rgba(0,0,0,0.03)',
    urgentColor: '#cc0000',
    lineColRatio: 2.6,
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

// ─── BVG line badge ───────────────────────────────────────────────────────────

const LIGHT_BG = new Set(['U4']); // yellow bg → needs dark text

const BvgLineBadge: React.FC<{ name: string; mode: string; fvh: number }> = ({ name, mode, fvh }) => {
  const bg = lineColor(name, mode);
  const isSuburban = mode === 'suburban';
  const short = name.length <= 2;
  const radius = isSuburban && short ? '50%' : `${Math.max(3, fvh * 0.14)}vh`;
  const h = `${fvh * 1.15}vh`;
  const fontSize = `${fvh * 0.6}vh`;
  const padding = short ? '0' : `0 ${fvh * 0.22}vh`;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: bg,
      borderRadius: radius,
      height: h, minWidth: h,
      padding,
      color: LIGHT_BG.has(name) ? '#111' : '#fff',
      fontSize,
      fontWeight: 900,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
      flexShrink: 0,
      letterSpacing: '-0.02em',
      lineHeight: 1,
    }}>
      {name}
    </span>
  );
};

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

function groupDepartures(deps: Departure[], hiddenModes: string[], hiddenLines: string[], maxRows: number): GroupedRow[] {
  const map = new Map<string, GroupedRow>();
  deps
    .filter(d => !hiddenModes.includes(d.line.mode))
    .filter(d => !hiddenLines.includes(`${d.line.name}||${d.direction}`))
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
  hiddenLines?: string[];
  variant?: BvgVariant;
  customCfg?: VariantCfg;
  address?: string;
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export const BvgLayout: React.FC<BvgLayoutProps> = ({
  weatherState,
  departuresState,
  hiddenModes = [],
  hiddenLines = [],
  variant = 'amber',
  customCfg,
  address,
}) => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const cfg = customCfg ?? VARIANTS[variant];
  const isLoading = departuresState.status === 'idle' || departuresState.status === 'loading';
  const allDeps: Departure[] = departuresState.data?.departures ?? [];
  const groups = groupDepartures(allDeps, hiddenModes, hiddenLines, cfg.maxRows);

  const weather = weatherState.status === 'success' ? weatherState.data : null;

  const timeStr = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', hour12: false });
  const dateStr = now.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase();

  const isClean = cfg.showStrip;

  // Dynamic sizing — rows get exact equal heights filling available space.
  // Row height drives font size; no vertical padding (alignItems: center).
  const numRows    = Math.max(1, groups.length);
  const headerVh   = 14;                          // header bar ~14vh (bigger fonts)
  const rowHVh     = (100 - headerVh) / numRows; // each row gets exact slice
  const rowFontVh  = rowHVh * 0.75;              // font = 82% of row height
  const nextFontVh = rowFontVh * 0.52;

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
        padding: isClean ? '0.9rem 2.4rem' : '1.8vh 2.4rem',
        borderBottom: `1px solid ${cfg.divider}`,
      }}>
        <span style={{
          fontSize: isClean ? 'clamp(1.4rem, 3.5vh, 2.8rem)' : `8vh`,
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
            <span style={{ fontSize: isClean ? cfg.headerSize : '6vh', color: cfg.colorDim, lineHeight: 1, fontWeight: isClean ? 300 : 400, letterSpacing: isClean ? '0' : '0.04em' }}>
              {Math.round(weather.main.temp)}°C
            </span>
            <span style={{ fontSize: isClean ? `clamp(0.75rem, 1.6vh, 1.3rem)` : `4vh`, color: cfg.colorFaint, lineHeight: 1, letterSpacing: isClean ? '0.02em' : '0.04em' }}>
              {weather.weather[0]?.description}
            </span>
          </>
        )}

        {address && (
          <span style={{
            marginLeft: 'auto',
            fontSize: isClean ? `clamp(0.65rem, 1.4vh, 1.1rem)` : `3.5vh`,
            color: cfg.colorFaint,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            lineHeight: 1,
            fontWeight: isClean ? 500 : 400,
          }}>
            {address}
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
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <span style={{ color: cfg.colorDim, fontSize: '2rem', letterSpacing: '0.15em' }}>
              {departuresState.status === 'error'
                ? 'API FEHLER'
                : allDeps.length > 0
                  ? 'ALLE MODI AUSGEBLENDET'
                  : 'KEINE ABFAHRTEN'}
            </span>
            <span style={{ color: cfg.colorFaint, fontSize: '0.85rem', letterSpacing: '0.08em', textAlign: 'center', maxWidth: '40rem' }}>
              {departuresState.status === 'error'
                ? departuresState.error ?? 'Unbekannter Fehler'
                : allDeps.length > 0
                  ? 'Alle Verkehrsmittel deaktiviert — Einstellungen öffnen und mindestens einen Modus aktivieren'
                  : 'Keine Verbindungen in den nächsten 60 Minuten'}
            </span>
          </div>
        ) : (
          groups.map((group, i) => {
            const firstMins = getMins(group.whens[0]);
            const urgent = firstMins <= 2;
            const isLast = i === groups.length - 1;
            const lc = lineColor(group.lineName, group.lineMode);

            if (cfg.showBadges) {
              // ── Icons variant: BVG line badges ───────────────────────────────
              const urgentC = cfg.urgentColor ?? '#ef4444';
              return (
                <div key={group.key} style={{
                  height: `${rowHVh}vh`,
                  display: 'flex', alignItems: 'center',
                  gap: `${rowFontVh * 0.55}vh`,
                  padding: `0 2rem`,
                  borderBottom: isLast ? 'none' : `1px solid ${cfg.divider}`,
                  background: i % 2 === 1 ? (cfg.rowAltBg ?? 'rgba(255,255,255,0.018)') : 'transparent',
                  overflow: 'hidden',
                }}>
                  <BvgLineBadge name={group.lineName} mode={group.lineMode} fvh={rowFontVh} />
                  <span style={{ fontSize: `${rowFontVh}vh`, fontWeight: 300, color: cfg.color, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1 }}>
                    {group.direction}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: `${rowFontVh * 0.5}vh`, whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: `${rowFontVh}vh`, fontWeight: urgent ? 700 : 400, color: urgent ? urgentC : cfg.color, lineHeight: 1 }}
                      className={urgent ? 'live-pulse' : undefined}>
                      {formatAbfahrt(group.whens[0])}
                    </span>
                    {group.whens.slice(1).map((w, j) => (
                      <span key={j} style={{ fontSize: `${rowFontVh * 0.52}vh`, color: cfg.colorDim, lineHeight: 1 }}>
                        {formatAbfahrt(w)}
                      </span>
                    ))}
                  </div>
                </div>
              );
            }

            if (isClean) {
              // ── Clean variant: strip + sans-serif ────────────────────────────
              return (
                <div key={group.key} style={{
                  display: 'flex', alignItems: 'center',
                  borderBottom: isLast ? 'none' : `1px solid ${cfg.divider}`,
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

            // ── Pixel variants ────────────────────────────────────────────────
            const fs  = `${rowFontVh}vh`;
            const fsN = `${nextFontVh}vh`;
            const urgentC = cfg.urgentColor ?? cfg.color;
            const primaryColor = urgent ? urgentC : cfg.color;
            const primaryGlow  = urgent ? (cfg.glow ?? 'none') : 'none';
            const lineCol = cfg.lineColRatio ? `${(rowFontVh * cfg.lineColRatio).toFixed(2)}vh` : '9rem';
            return (
              <div key={group.key} style={{
                height: `${rowHVh}vh`,
                display: 'grid',
                gridTemplateColumns: `${lineCol} 1fr auto`,
                alignItems: 'center',
                padding: '0 2.4rem',
                borderBottom: isLast ? 'none' : `1px solid ${cfg.divider}`,
                background: i % 2 === 1 ? 'rgba(0,0,0,0.06)' : 'transparent',
                overflow: 'hidden',
              }}>
                <span style={{ fontSize: fs, color: cfg.color, letterSpacing: '0.04em', lineHeight: 1, overflow: 'hidden', textOverflow: 'clip', whiteSpace: 'nowrap' }}>
                  {group.lineName}
                </span>
                <span style={{ fontSize: fs, color: cfg.color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '0.04em', paddingRight: '2rem', lineHeight: 1 }}>
                  {group.direction}
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.4rem', whiteSpace: 'nowrap' }}>
                  <span style={{ fontSize: fs, fontWeight: urgent ? 700 : 400, color: primaryColor, letterSpacing: '0.04em', lineHeight: 1, textShadow: primaryGlow }}
                    className={urgent ? 'live-pulse' : undefined}>
                    {formatAbfahrt(group.whens[0])}
                  </span>
                  {group.whens.slice(1).map((w, j) => (
                    <span key={j} style={{ fontSize: fsN, color: cfg.colorDim, letterSpacing: '0.04em', lineHeight: 1 }}>
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
