import React, { useState, useEffect } from 'react';
import { Theme } from '../themes';
import { DataState, WeatherData, ThemeCustomization } from '../types';
import { AnalogClock } from './AnalogClock';
import { ClockRenderer } from './ClockRenderer';
import { ThemeBackground } from './ThemeBackground';
import { WeatherIcon } from './WeatherIcon';

// Crossfading background layer — re-mounts (fade-in) whenever theme.id changes
const BackgroundLayer: React.FC<{ theme: Theme }> = ({ theme }) => (
  <>
    <div
      key={theme.id}
      className="theme-bg-fade"
      style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: theme.background,
        backgroundImage: theme.backgroundImage,
      }}
    />
    <ThemeBackground themeId={theme.id} />
  </>
);

interface LayoutProps {
  children: React.ReactNode;
  theme: Theme;
  weatherState: DataState<WeatherData>;
  customization: ThemeCustomization;
}

// ─── Clock renderer helpers ──────────────────────────────────────────────────

const PREMIUM_STYLES = [
  'grand-complication', 'perpetual-calendar', 'moonphase', 'tourbillon',
  'worldtime', 'power-reserve', 'bauhaus', 'dress-elegant', 'skeleton',
  'art-deco', 'pilot', 'diver', 'racing', 'military', 'asymmetric',
  'retrograde', 'digital-hybrid', 'jumping-hour', 'railroad', 'pocket-watch',
  'marine-chronometer', 'observatoire', 'colorful', 'binary', 'flip', 'segment',
  'neon-plasma', 'crystal-prism', 'kintsugi', 'astrolabe', 'vortex-orrery',
];

const CLOCK_SIZES = { small: 180, medium: 280, large: 360 };

// ─── Weather block variants ───────────────────────────────────────────────────

/** Compact inline — used in split left / default right col */
const WeatherInline: React.FC<{ data: WeatherData; theme: Theme; large?: boolean }> = ({ data, theme, large }) => {
  const temp = Math.round(data.main.temp);
  const feels = Math.round(data.main.feels_like);
  const desc = data.weather[0]?.description ?? '';
  const code = data.weather[0]?.id ?? 0;
  const iconSize = large ? 56 : 40;
  const tempSize = large ? '3.2rem' : '2.2rem';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: large ? '1rem' : '0.65rem' }}>
      <WeatherIcon code={code} color={theme.textColor} size={iconSize} />
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
          <span
            style={{
              fontSize: tempSize,
              fontWeight: 200,
              color: theme.textColor,
              lineHeight: 1,
              letterSpacing: '-0.04em',
            }}
          >
            {temp}°
          </span>
          {large && (
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 300,
                color: theme.textSecondary,
                opacity: 0.55,
                letterSpacing: '0.02em',
              }}
            >
              feels {feels}°
            </span>
          )}
        </div>
        <span
          style={{
            display: 'block',
            fontSize: '0.62rem',
            fontWeight: 400,
            color: theme.textSecondary,
            opacity: 0.5,
            marginTop: '0.2rem',
            textTransform: 'capitalize',
            letterSpacing: '0.04em',
          }}
        >
          {desc}
        </span>
      </div>
    </div>
  );
};

/** Stacked full — used in centered / minimal layouts */
const WeatherStacked: React.FC<{ data: WeatherData; theme: Theme }> = ({ data, theme }) => {
  const temp = Math.round(data.main.temp);
  const feels = Math.round(data.main.feels_like);
  const hum = data.main.humidity;
  const desc = data.weather[0]?.description ?? '';
  const code = data.weather[0]?.id ?? 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <WeatherIcon code={code} color={theme.textColor} size={52} />
      <div style={{ textAlign: 'center' }}>
        <span
          style={{
            display: 'block',
            fontSize: '3rem',
            fontWeight: 200,
            color: theme.textColor,
            lineHeight: 1,
            letterSpacing: '-0.05em',
          }}
        >
          {temp}°
        </span>
        <span
          style={{
            display: 'block',
            fontSize: '0.62rem',
            fontWeight: 400,
            color: theme.textSecondary,
            opacity: 0.5,
            marginTop: '0.3rem',
            textTransform: 'capitalize',
            letterSpacing: '0.06em',
          }}
        >
          {desc}
        </span>
        <span
          style={{
            display: 'block',
            fontSize: '0.58rem',
            fontWeight: 300,
            color: theme.textSecondary,
            opacity: 0.35,
            marginTop: '0.2rem',
            letterSpacing: '0.05em',
          }}
        >
          feels {feels}° · {hum}% hum
        </span>
      </div>
    </div>
  );
};

// ─── Date string ──────────────────────────────────────────────────────────────

function buildDate(now: Date): string {
  return now.toLocaleDateString('de-DE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).toUpperCase();
}

// ─── Main component ───────────────────────────────────────────────────────────

export const Layout: React.FC<LayoutProps> = ({ children, theme, weatherState, customization }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateString = buildDate(now);
  const styleWithoutPrefix = customization.clockStyle.replace('analog-', '').replace('digital-', '');
  const isAnalog = customization.clockStyle.startsWith('analog-');
  const isPremium = PREMIUM_STYLES.includes(styleWithoutPrefix);
  const analogStyle = customization.clockStyle.replace('analog-', '') as any;
  const clockSize = CLOCK_SIZES[customization.clockSize];
  const weatherData = weatherState.status === 'success' ? weatherState.data : null;

  const bg = {
    position: 'relative' as const,
    isolation: 'isolate' as const,
    // background applied by BackgroundLayer (crossfades on theme change)
    fontFamily: theme.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
  };

  const renderClock = () => {
    if (isPremium) {
      return (
        <ClockRenderer
          size={clockSize}
          color={theme.timeColor}
          backgroundColor={theme.background.includes('gradient') ? 'rgba(0,0,0,0.2)' : 'transparent'}
          style={styleWithoutPrefix as any}
          showSeconds={customization.showSeconds}
          showComplications={customization.showComplications}
        />
      );
    }
    if (isAnalog) {
      return (
        <AnalogClock
          size={clockSize}
          color={theme.timeColor}
          backgroundColor={theme.background.includes('gradient') ? 'rgba(0,0,0,0.2)' : 'transparent'}
          showNumbers={true}
          style={analogStyle}
          showSeconds={customization.showSeconds}
        />
      );
    }
    return (
      <h1
        className="font-extralight tracking-tighter leading-none"
        style={{
          fontSize: customization.clockSize === 'large' ? '16rem' : customization.clockSize === 'small' ? '10rem' : '14rem',
          fontWeight: 100,
          letterSpacing: '-0.05em',
          color: theme.timeColor,
        }}
      >
        {now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', hour12: false })}
      </h1>
    );
  };

  const dateEl = customization.showDate ? (
    <p
      style={{
        fontSize: '0.6rem',
        fontWeight: 600,
        letterSpacing: '0.14em',
        color: theme.textSecondary,
        opacity: 0.45,
        marginTop: '0.6rem',
        textTransform: 'uppercase',
      }}
    >
      {dateString}
    </p>
  ) : null;

  // ── SPLIT ────────────────────────────────────────────────────────────────────
  if (customization.layout === 'split') {
    return (
      <div className="min-h-screen flex" style={bg}>
        <BackgroundLayer theme={theme} />

        {/* Left — Clock, date, weather */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: '40%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem',
            borderRight: `1px solid ${theme.textColor}0f`,
          }}
        >
          {renderClock()}
          {dateEl}

          {customization.showWeather && weatherData && (
            <div style={{ marginTop: 'auto', paddingTop: '2.5rem' }}>
              <WeatherInline data={weatherData} theme={theme} large />
            </div>
          )}
        </div>

        {/* Right — Departures */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: '60%',
            display: 'flex',
            alignItems: 'center',
            padding: '2.5rem 3rem',
          }}
        >
          {customization.showDepartures && (
            <div style={{ width: '100%' }}>{children}</div>
          )}
        </div>
      </div>
    );
  }

  // ── CENTERED ─────────────────────────────────────────────────────────────────
  if (customization.layout === 'centered') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={bg}>
        <BackgroundLayer theme={theme} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginBottom: '2rem' }}>
          {renderClock()}
          {dateEl}
        </div>

        {customization.showWeather && weatherData && (
          <div style={{ position: 'relative', zIndex: 1, marginBottom: '2rem' }}>
            <WeatherStacked data={weatherData} theme={theme} />
          </div>
        )}

        {customization.showDepartures && (
          <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '56rem', padding: '0 2rem' }}>
            {children}
          </div>
        )}
      </div>
    );
  }

  // ── MINIMAL ───────────────────────────────────────────────────────────────────
  if (customization.layout === 'minimal') {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={bg}>
        <BackgroundLayer theme={theme} />
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '72rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
            <div>
              {renderClock()}
              {dateEl}
            </div>
            {customization.showWeather && weatherData && (
              <div style={{ paddingBottom: '0.25rem' }}>
                <WeatherInline data={weatherData} theme={theme} large />
              </div>
            )}
          </div>
          {customization.showDepartures && <div>{children}</div>}
        </div>
      </div>
    );
  }

  // ── COMPACT ───────────────────────────────────────────────────────────────────
  if (customization.layout === 'compact') {
    return (
      <div className="min-h-screen flex flex-col p-4" style={bg}>
        <BackgroundLayer theme={theme} />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
            paddingBottom: '0.75rem',
            borderBottom: `1px solid ${theme.textColor}0d`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            {renderClock()}
            {customization.showDate && (
              <span
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  color: theme.textSecondary,
                  opacity: 0.4,
                  textTransform: 'uppercase',
                }}
              >
                {dateString}
              </span>
            )}
          </div>
          {customization.showWeather && weatherData && (
            <WeatherInline data={weatherData} theme={theme} />
          )}
        </div>
        {customization.showDepartures && (
          <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>{children}</div>
        )}
      </div>
    );
  }

  // ── WIDE (3:1) — Vestl native layout ────────────────────────────────────────
  // Left ~22%: time, date, weather — ambient
  // Right ~78%: departures as full-height rows — dominant
  if (customization.layout === 'wide') {
    return (
      <div
        style={{
          ...bg,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        <BackgroundLayer theme={theme} />

        {/* ── Left panel: ambient info ── */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: '22%',
            flexShrink: 0,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 2.5rem',
            borderRight: `1px solid ${theme.textColor}09`,
          }}
        >
          {/* Time — the only clock on wide layout */}
          <div
            style={{
              fontSize: 'clamp(2.8rem, 4.5vw, 5rem)',
              fontWeight: 100,
              color: theme.timeColor,
              letterSpacing: '-0.05em',
              lineHeight: 1,
              fontFamily: theme.fontFamily,
            }}
          >
            {now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', hour12: false })}
          </div>

          {/* Date */}
          {customization.showDate && (
            <div
              style={{
                fontSize: '0.6rem',
                fontWeight: 600,
                letterSpacing: '0.2em',
                color: theme.textSecondary,
                opacity: 0.38,
                marginTop: '0.7rem',
                textTransform: 'uppercase',
              }}
            >
              {dateString}
            </div>
          )}

          {/* Weather */}
          {customization.showWeather && weatherData && (
            <div style={{ marginTop: '1.8rem' }}>
              <WeatherInline data={weatherData} theme={theme} />
            </div>
          )}

          {/* VESTL wordmark — bottom left, very subtle */}
          <div
            style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '2.5rem',
              fontSize: '0.55rem',
              fontWeight: 700,
              letterSpacing: '0.3em',
              color: theme.textSecondary,
              opacity: 0.18,
              textTransform: 'uppercase',
            }}
          >
            VESTL
          </div>
        </div>

        {/* ── Right panel: departure board ── */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            flex: 1,
            height: '100%',
            overflow: 'hidden',
          }}
        >
          {customization.showDepartures && children}
        </div>
      </div>
    );
  }

  // ── DEFAULT ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex" style={bg}>
      <ThemeBackground themeId={theme.id} />

      {/* Left — Clock */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '33.333%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          borderRight: `1px solid ${theme.textColor}0a`,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {renderClock()}
          {dateEl}
        </div>
      </div>

      {/* Right — Weather + Departures */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '66.667%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '2rem 2.5rem',
          gap: '1.75rem',
        }}
      >
        {customization.showWeather && weatherData && (
          <WeatherInline data={weatherData} theme={theme} />
        )}
        {customization.showDepartures && <div>{children}</div>}
      </div>
    </div>
  );
};
