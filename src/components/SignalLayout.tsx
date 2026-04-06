import React, { useState, useEffect } from 'react';
import { Theme } from '../themes';
import { DataState, WeatherData, DeparturesData, Departure } from '../types';
import { WeatherIcon } from './WeatherIcon';

// ─── BVG line colours ─────────────────────────────────────────────────────────

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
  bus:      { bg: '#5c3d8f', fg: '#fff' },
};

function getLineColor(name: string, mode: string) {
  return LINE_COLORS[name] ?? MODE_COLORS[mode] ?? { bg: '#333', fg: '#fff' };
}

function formatMins(when: string): { mins: number; label: string } {
  const mins = Math.round((new Date(when).getTime() - Date.now()) / 60000);
  if (mins <= 0) return { mins: 0, label: 'NOW' };
  return { mins, label: String(mins) };
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface SignalLayoutProps {
  theme: Theme;
  weatherState: DataState<WeatherData>;
  departuresState: DataState<DeparturesData>;
  hiddenModes?: string[];
}

// ─── Departure row ────────────────────────────────────────────────────────────

interface RowProps {
  dep: Departure;
  rowIndex: number;
  totalRows: number;
}

const SignalRow: React.FC<RowProps> = ({ dep, rowIndex, totalRows }) => {
  const { mins, label } = formatMins(dep.when);
  const urgent = mins <= 2;
  const soon = mins <= 5 && !urgent;
  const lc = getLineColor(dep.line.name, dep.line.mode);
  const delay = dep.delay && dep.delay > 30 ? `+${Math.round(dep.delay / 60)}m` : null;
  const isLast = rowIndex === totalRows - 1;

  const countdownColor = urgent ? '#ef4444' : soon ? '#f59e0b' : 'rgba(255,255,255,0.9)';
  const rowBg = rowIndex % 2 === 0 ? 'rgba(255,255,255,0.0)' : 'rgba(255,255,255,0.017)';

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.045)',
        background: rowBg,
        minHeight: 0,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Coloured left stripe */}
      <div
        style={{
          width: 6,
          alignSelf: 'stretch',
          backgroundColor: lc.bg,
          flexShrink: 0,
        }}
      />

      {/* Line badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: lc.bg,
          color: lc.fg,
          borderRadius: 7,
          padding: '0 0.85rem',
          height: '2.4rem',
          minWidth: '4.2rem',
          marginLeft: '1.8rem',
          flexShrink: 0,
          fontSize: 'clamp(0.82rem, 1.9vh, 1.15rem)',
          fontWeight: 900,
          letterSpacing: '0.02em',
        }}
      >
        {dep.line.name}
      </div>

      {/* Direction + stop row */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          padding: '0 2rem 0 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.3rem',
        }}
      >
        <div
          style={{
            fontSize: 'clamp(1.05rem, 2.6vh, 1.9rem)',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.9)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            letterSpacing: '-0.015em',
            lineHeight: 1.1,
          }}
        >
          {dep.direction}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {dep.stop?.name && (
            <span
              style={{
                fontSize: '0.57rem',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.22)',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              {dep.stop.name}
            </span>
          )}
          {delay && (
            <span
              style={{
                fontSize: '0.57rem',
                fontWeight: 700,
                color: '#f59e0b',
                backgroundColor: 'rgba(245,158,11,0.14)',
                padding: '0.1rem 0.38rem',
                borderRadius: 3,
                letterSpacing: '0.06em',
              }}
            >
              {delay}
            </span>
          )}
        </div>
      </div>

      {/* Countdown */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          padding: '0 2.8rem 0 1rem',
          flexShrink: 0,
          minWidth: '8rem',
        }}
      >
        <span
          style={{
            fontSize: mins === 0
              ? 'clamp(1.5rem, 3.2vh, 2.6rem)'
              : 'clamp(2rem, 5.2vh, 4.2rem)',
            fontWeight: mins <= 5 ? 700 : 200,
            color: countdownColor,
            letterSpacing: mins === 0 ? '0.02em' : '-0.055em',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            transition: 'color 0.5s ease',
          }}
          className={urgent ? 'live-pulse' : undefined}
        >
          {label}
        </span>
        {mins > 0 && (
          <span
            style={{
              fontSize: '0.52rem',
              fontWeight: 700,
              color: countdownColor,
              opacity: 0.45,
              letterSpacing: '0.2em',
              marginTop: '0.2rem',
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

// ─── Loading skeleton ─────────────────────────────────────────────────────────

const SignalSkeleton: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '1.8rem',
          padding: '0 2.8rem',
          borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.045)' : 'none',
        }}
      >
        <div className="shimmer" style={{ width: 6, alignSelf: 'stretch', margin: '-1px 0' }} />
        <div className="shimmer" style={{ width: '4.2rem', height: '2.4rem', borderRadius: 7, marginLeft: '1.8rem' }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div className="shimmer" style={{ height: '1.4rem', width: `${55 + i * 8}%`, borderRadius: 4 }} />
          <div className="shimmer" style={{ height: '0.7rem', width: '30%', borderRadius: 3 }} />
        </div>
        <div className="shimmer" style={{ width: '4rem', height: '3.5rem', borderRadius: 4 }} />
      </div>
    ))}
  </div>
);

// ─── Main layout ──────────────────────────────────────────────────────────────

export const SignalLayout: React.FC<SignalLayoutProps> = ({
  weatherState,
  departuresState,
  hiddenModes = [],
}) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const weatherData = weatherState.status === 'success' ? weatherState.data : null;

  const deps: Departure[] = departuresState.data?.departures
    ? departuresState.data.departures
        .filter(d => !hiddenModes.includes(d.line.mode))
        .sort((a, b) => new Date(a.when).getTime() - new Date(b.when).getTime())
        .slice(0, 6)
    : [];

  const timeStr = now.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const dateStr = now
    .toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })
    .toUpperCase();

  const isLoading =
    departuresState.status === 'idle' || departuresState.status === 'loading';

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#09090b',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Segoe UI", Arial, sans-serif',
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 2.8rem',
          height: '20vh',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
          gap: '2rem',
        }}
      >
        {/* Time */}
        <div
          style={{
            fontSize: 'clamp(3rem, 7.5vh, 6rem)',
            fontWeight: 100,
            color: 'rgba(255,255,255,0.96)',
            letterSpacing: '-0.055em',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            minWidth: 'max-content',
          }}
        >
          {timeStr}
        </div>

        {/* Date — centered */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <span
            style={{
              fontSize: 'clamp(0.6rem, 1.3vh, 0.9rem)',
              fontWeight: 600,
              letterSpacing: '0.22em',
              color: 'rgba(255,255,255,0.22)',
              textTransform: 'uppercase',
            }}
          >
            {dateStr}
          </span>
        </div>

        {/* Weather — right */}
        {weatherData && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.9rem',
              minWidth: 'max-content',
              padding: '0.8rem 1.2rem',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <WeatherIcon
              code={weatherData.weather[0]?.id ?? 0}
              color="rgba(255,255,255,0.65)"
              size={32}
            />
            <div>
              <div
                style={{
                  fontSize: 'clamp(1.5rem, 3vh, 2.2rem)',
                  fontWeight: 200,
                  color: 'rgba(255,255,255,0.9)',
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {Math.round(weatherData.main.temp)}°
              </div>
              <div
                style={{
                  fontSize: '0.56rem',
                  color: 'rgba(255,255,255,0.25)',
                  marginTop: '0.25rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                }}
              >
                {weatherData.weather[0]?.description}
              </div>
            </div>
            <div
              style={{
                borderLeft: '1px solid rgba(255,255,255,0.08)',
                paddingLeft: '0.9rem',
                marginLeft: '0.1rem',
              }}
            >
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.01em',
                }}
              >
                feels {Math.round(weatherData.main.feels_like)}°
              </div>
              <div
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.25)',
                  marginTop: '0.2rem',
                  letterSpacing: '0.01em',
                }}
              >
                {weatherData.main.humidity}% hum
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Departure board ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {isLoading ? (
          <SignalSkeleton />
        ) : departuresState.status === 'error' || deps.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.15)',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
              }}
            >
              {departuresState.status === 'error' ? 'Transit unavailable' : 'No departures'}
            </span>
          </div>
        ) : (
          deps.map((dep, i) => (
            <SignalRow
              key={`${dep.tripId}-${i}`}
              dep={dep}
              rowIndex={i}
              totalRows={deps.length}
            />
          ))
        )}
      </div>

      {/* ── Wordmark ────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: '1.2rem',
          right: '2.2rem',
          fontSize: '0.48rem',
          fontWeight: 700,
          letterSpacing: '0.35em',
          color: 'rgba(255,255,255,0.1)',
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}
      >
        VESTL
      </div>
    </div>
  );
};
