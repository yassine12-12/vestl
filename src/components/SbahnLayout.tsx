import React, { useState, useEffect } from 'react';
import { DataState, WeatherData, DeparturesData, Departure } from '../types';
import { Theme } from '../themes';

// ─── Official BVG/S-Bahn line colours ─────────────────────────────────────────

const LINE_COLORS: Record<string, { bg: string; fg: string }> = {
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
};
const MODE_COLORS: Record<string, { bg: string; fg: string }> = {
  subway:   { bg: '#003c8f', fg: '#fff' },
  suburban: { bg: '#007734', fg: '#fff' },
  tram:     { bg: '#cc0000', fg: '#fff' },
  bus:      { bg: '#5c3d8f', fg: '#fff' },
};
const lc = (n: string, m: string) => LINE_COLORS[n] ?? MODE_COLORS[m] ?? { bg: '#fff', fg: '#003FA0' };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getMins(w: string) { return Math.round((new Date(w).getTime() - Date.now()) / 60000); }
function fmt(w: string) { const m = getMins(w); return m <= 0 ? 'sofort' : `${m} min`; }
function isUrgent(w: string) { return getMins(w) <= 2; }

interface GRow { key: string; lineName: string; lineMode: string; direction: string; whens: string[]; }

function buildGroups(deps: Departure[], hidden: string[]): GRow[] {
  const map = new Map<string, GRow>();
  deps.filter(d => !hidden.includes(d.line.mode))
    .sort((a, b) => new Date(a.when).getTime() - new Date(b.when).getTime())
    .forEach(d => {
      const k = `${d.line.name}||${d.direction}`;
      if (!map.has(k)) map.set(k, { key: k, lineName: d.line.name, lineMode: d.line.mode, direction: d.direction, whens: [] });
      const g = map.get(k)!; if (g.whens.length < 3) g.whens.push(d.when);
    });
  const groups = Array.from(map.values());
  const earliest = new Map<string, number>();
  groups.forEach(g => { const t = new Date(g.whens[0]).getTime(); if (!earliest.has(g.lineName) || t < earliest.get(g.lineName)!) earliest.set(g.lineName, t); });
  groups.sort((a, b) => { const la = earliest.get(a.lineName)!, lb = earliest.get(b.lineName)!; return la !== lb ? la - lb : new Date(a.whens[0]).getTime() - new Date(b.whens[0]).getTime(); });
  const cnt = new Map<string, number>(); const out: GRow[] = [];
  for (const g of groups) { const c = cnt.get(g.lineName) ?? 0; if (c >= 2) continue; cnt.set(g.lineName, c + 1); out.push(g); if (out.length === 8) break; }
  return out;
}

// ─── Line badge — rounded pill matching real S-Bahn signs ─────────────────────

const LineBadge: React.FC<{ name: string; mode: string }> = ({ name, mode }) => {
  const col = lc(name, mode);
  // S-Bahn style: circle prefix + number  /  U-Bahn style: same
  const prefix = name.startsWith('S') ? 'S' : name.startsWith('U') ? 'U' : null;
  const num    = prefix ? name.slice(1) : null;

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      background: col.bg, borderRadius: 999,
      height: 'clamp(2rem, 4.5vh, 3.8rem)',
      minWidth: 'clamp(2rem, 4.5vh, 3.8rem)',
      flexShrink: 0,
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    }}>
      {prefix && num ? (
        <>
          {/* Letter circle */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 'clamp(2rem, 4.5vh, 3.8rem)',
            height: '100%',
            background: 'rgba(0,0,0,0.18)',
            fontSize: 'clamp(1rem, 2.4vh, 2rem)',
            fontWeight: 900, color: col.fg,
            letterSpacing: 0, lineHeight: 1,
            flexShrink: 0,
          }}>{prefix}</div>
          {/* Number */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            paddingLeft: 'clamp(0.3rem, 0.6vw, 0.6rem)',
            paddingRight: 'clamp(0.5rem, 1vw, 0.9rem)',
            fontSize: 'clamp(1rem, 2.4vh, 2rem)',
            fontWeight: 900, color: col.fg,
            letterSpacing: 0, lineHeight: 1,
          }}>{num}</div>
        </>
      ) : (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 clamp(0.6rem, 1.2vw, 1rem)',
          fontSize: 'clamp(0.9rem, 2.2vh, 1.8rem)',
          fontWeight: 900, color: col.fg, lineHeight: 1,
        }}>{name}</div>
      )}
    </div>
  );
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props { theme: Theme; weatherState: DataState<WeatherData>; departuresState: DataState<DeparturesData>; hiddenModes?: string[]; }

// ─── Layout ───────────────────────────────────────────────────────────────────

export const SbahnLayout: React.FC<Props> = ({ weatherState, departuresState, hiddenModes = [] }) => {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  const groups = buildGroups(departuresState.data?.departures ?? [], hiddenModes);
  const weather = weatherState.status === 'success' ? weatherState.data : null;
  const stopName = (departuresState.data?.departures ?? []).find(d => !hiddenModes.includes(d.line.mode))?.stop?.name ?? '';
  const isLoading = departuresState.status === 'idle' || departuresState.status === 'loading';

  const numRows = Math.max(1, groups.length);
  const headerVh = 14;
  const rowHVh = (100 - headerVh) / numRows;
  const rowFontVh = rowHVh * 0.82;
  const nextFontVh = rowFontVh * 0.52;

  const timeStr = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', hour12: false });

  // S-Bahn BVG blue
  const BLUE   = '#0047BB';
  const WHITE  = '#ffffff';
  const WHITE2 = 'rgba(255,255,255,0.55)';
  const WHITE3 = 'rgba(255,255,255,0.30)';
  const DIV    = 'rgba(255,255,255,0.12)';

  return (
    <div style={{
      width: '100vw', height: '100vh', overflow: 'hidden',
      background: BLUE,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Arial", sans-serif',
      display: 'flex', flexDirection: 'column',
      color: WHITE,
    }}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: '2rem',
        padding: '1.8vh 2.4rem',
        borderBottom: `1px solid ${DIV}`,
        background: 'rgba(0,0,0,0.15)',
      }}>
        <span style={{
          fontSize: '8vh', fontWeight: 200,
          color: WHITE, letterSpacing: '-0.04em', lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}>{timeStr}</span>

        {weather && <>
          <span style={{ fontSize: '6vh', fontWeight: 300, color: WHITE2, letterSpacing: '-0.02em', lineHeight: 1 }}>
            {Math.round(weather.main.temp)}°C
          </span>
          <span style={{ fontSize: '4vh', fontWeight: 300, color: WHITE3, textTransform: 'capitalize', letterSpacing: '0.03em' }}>
            {weather.weather[0]?.description}
          </span>
        </>}

        {stopName && (
          <span style={{ marginLeft: 'auto', fontSize: '3.5vh', fontWeight: 600, letterSpacing: '0.2em', color: WHITE3, textTransform: 'uppercase' }}>
            {stopName}
          </span>
        )}
      </div>

      {/* ── Rows ───────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} style={{
              flex: 1, margin: '0', borderBottom: `1px solid ${DIV}`,
              background: i % 2 === 0 ? 'rgba(0,0,0,0.08)' : 'transparent',
            }} />
          ))
        ) : groups.map((g, i) => {
          const urgent = isUrgent(g.whens[0]);
          const isLast = i === groups.length - 1;

          return (
            <div key={g.key} style={{
              height: `${rowHVh}vh`, display: 'flex', alignItems: 'center',
              padding: '0 2.4rem', gap: '1.6rem',
              borderBottom: isLast ? 'none' : `1px solid ${DIV}`,
              background: i % 2 === 0 ? 'rgba(0,0,0,0.10)' : 'transparent',
              overflow: 'hidden',
            }}>
              {/* Badge */}
              <LineBadge name={g.lineName} mode={g.lineMode} />

              {/* Direction */}
              <span style={{
                flex: 1, fontSize: `${rowFontVh}vh`, fontWeight: 400,
                color: WHITE, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                letterSpacing: '-0.01em', lineHeight: 1,
              }}>{g.direction}</span>

              {/* Following times (dimmed) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.4rem', flexShrink: 0 }}>
                {g.whens.slice(1).map((w, j) => (
                  <span key={j} style={{
                    fontSize: `${nextFontVh}vh`, fontWeight: 300,
                    color: WHITE3, letterSpacing: '0', lineHeight: 1, whiteSpace: 'nowrap',
                  }}>{fmt(w)}</span>
                ))}

                {/* Primary time */}
                <span style={{
                  fontSize: `${rowFontVh}vh`,
                  fontWeight: urgent ? 700 : 400,
                  color: urgent ? '#ffe066' : WHITE,
                  letterSpacing: urgent ? '-0.03em' : '0',
                  lineHeight: 1, whiteSpace: 'nowrap',
                  textShadow: urgent ? '0 0 20px rgba(255,224,102,0.6)' : 'none',
                  minWidth: '7rem', textAlign: 'right',
                }} className={urgent ? 'live-pulse' : undefined}>
                  {fmt(g.whens[0])}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
