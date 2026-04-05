import React, { useState, useEffect, useRef, useCallback } from 'react';
import { themes, Theme } from '../themes';
import { berlinThemes } from '../themes/berlinThemes';
import { ThemeCustomization } from '../types';
import { UserConfig } from '../userConfig';
import { ClockPreview } from './ClockPreview';

// ─── Props ─────────────────────────────────────────────────────────────────

interface Props {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  customization: ThemeCustomization;
  onCustomizationChange: (c: ThemeCustomization) => void;
  userConfig: UserConfig;
  onSaveConfig: (cfg: UserConfig) => void;
}

// ─── Toggle switch ──────────────────────────────────────────────────────────

const Toggle: React.FC<{ on: boolean; onChange: (v: boolean) => void }> = ({ on, onChange }) => (
  <button
    onClick={() => onChange(!on)}
    className="relative flex-shrink-0 w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none"
    style={{ backgroundColor: on ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.12)' }}
  >
    <span
      className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200"
      style={{
        left: on ? '1.25rem' : '0.125rem',
        backgroundColor: on ? '#0a0f15' : 'rgba(255,255,255,0.4)',
      }}
    />
  </button>
);

// ─── Section label ──────────────────────────────────────────────────────────

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
    {children}
  </p>
);

// ─── Address suggestion types ───────────────────────────────────────────────

interface Suggestion {
  placeId: number;
  short: string;
  sub: string;
  lat: number;
  lon: number;
}

function parseAddress(displayName: string): { short: string; sub: string } {
  const parts = displayName.split(', ');
  const num = parts[0]?.match(/^\d/) ? parts[0] : '';
  const road = parts.find(p => /[a-zäöüß]/i.test(p) && !/^\d+$/.test(p) && !['Germany', 'Deutschland'].includes(p)) ?? '';
  const city = parts.find(p => ['Berlin', 'Hamburg', 'München', 'Frankfurt', 'Köln', 'Stuttgart', 'Dresden', 'Leipzig'].includes(p)) ?? parts[2] ?? '';
  const short = num ? `${road} ${num}`.trim() : road;
  return { short: short || parts[0], sub: city };
}

// ─── THEME TAB ──────────────────────────────────────────────────────────────

const BERLIN_IDS = berlinThemes.map(t => t.id);

const ThemeRow: React.FC<{ theme: Theme; active: boolean; onClick: () => void }> = ({ theme, active, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left"
    style={{
      backgroundColor: active ? 'rgba(255,255,255,0.07)' : 'transparent',
      border: `1px solid ${active ? 'rgba(255,255,255,0.11)' : 'rgba(255,255,255,0.0)'}`,
    }}
    onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
    onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent'; }}
  >
    <div className="flex gap-1 flex-shrink-0">
      <div className="w-6 h-9 rounded-md" style={{ background: theme.background, backgroundImage: theme.backgroundImage }} />
      <div className="w-2 h-9 rounded-md" style={{ backgroundColor: theme.accentColor }} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium" style={{ color: active ? '#fff' : 'rgba(255,255,255,0.65)' }}>
        {theme.name}
      </p>
      <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
        {theme.clockStyle?.startsWith('analog') ? 'Analog' : 'Digital'}
      </p>
    </div>
    {active && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: theme.accentColor }} />}
  </button>
);

const ThemeTab: React.FC<{ currentTheme: Theme; onThemeChange: (t: Theme) => void }> = ({ currentTheme, onThemeChange }) => {
  const berlinList = berlinThemes as Theme[];
  const otherList  = themes.filter(t => !BERLIN_IDS.includes(t.id));

  return (
    <div>
      {/* Berlin — always visible at top */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-xs font-semibold tracking-wider" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Berlin
          </p>
          <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
        </div>
        <div className="space-y-0.5">
          {berlinList.map(theme => (
            <ThemeRow key={theme.id} theme={theme} active={theme.id === currentTheme.id} onClick={() => onThemeChange(theme)} />
          ))}
        </div>
      </div>

      {/* Everything else */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <p className="text-xs font-semibold tracking-wider" style={{ color: 'rgba(255,255,255,0.55)' }}>
            More
          </p>
          <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
        </div>
        <div className="space-y-0.5">
          {otherList.map(theme => (
            <ThemeRow key={theme.id} theme={theme} active={theme.id === currentTheme.id} onClick={() => onThemeChange(theme)} />
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── DISPLAY TAB ────────────────────────────────────────────────────────────

const CLOCK_GROUPS = [
  { label: 'Digital', styles: [
    { value: 'digital', label: 'Digital' },
    { value: 'digital-segment', label: '7-Segment' },
    { value: 'digital-flip', label: 'Flip' },
    { value: 'digital-binary', label: 'Binary' },
  ]},
  { label: 'Dress', styles: [
    { value: 'analog-dress-elegant', label: 'Dress' },
    { value: 'analog-bauhaus', label: 'Bauhaus' },
    { value: 'analog-skeleton', label: 'Skeleton' },
    { value: 'analog-art-deco', label: 'Art Deco' },
  ]},
  { label: 'Sport', styles: [
    { value: 'analog-pilot', label: 'Pilot' },
    { value: 'analog-diver', label: 'Diver' },
    { value: 'analog-racing', label: 'Racing' },
    { value: 'analog-military', label: 'Field' },
  ]},
  { label: 'Complications', styles: [
    { value: 'analog-moonphase', label: 'Moon Phase' },
    { value: 'analog-grand-complication', label: 'Grand Comp.' },
    { value: 'analog-worldtime', label: 'World Time' },
    { value: 'analog-tourbillon', label: 'Tourbillon' },
  ]},
];

const LAYOUTS = [
  { value: 'default', label: 'Default' },
  { value: 'split', label: 'Split' },
  { value: 'centered', label: 'Centered' },
  { value: 'compact', label: 'Compact' },
  { value: 'minimal', label: 'Minimal' },
];

const DisplayTab: React.FC<{
  theme: Theme;
  customization: ThemeCustomization;
  onChange: (c: ThemeCustomization) => void;
}> = ({ theme, customization, onChange }) => {
  const set = (patch: Partial<ThemeCustomization>) => onChange({ ...customization, ...patch });

  return (
    <div className="space-y-6">

      {/* Layout */}
      <div>
        <Label>Layout</Label>
        <div className="flex flex-wrap gap-1.5">
          {LAYOUTS.map(l => {
            const active = customization.layout === l.value;
            return (
              <button
                key={l.value}
                onClick={() => set({ layout: l.value as any })}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{
                  backgroundColor: active ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
                  color: active ? '#fff' : 'rgba(255,255,255,0.4)',
                }}
              >
                {l.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clock size */}
      <div>
        <Label>Clock size</Label>
        <div className="flex gap-1.5">
          {(['small', 'medium', 'large'] as const).map(s => {
            const active = customization.clockSize === s;
            return (
              <button
                key={s}
                onClick={() => set({ clockSize: s })}
                className="flex-1 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors"
                style={{
                  backgroundColor: active ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
                  color: active ? '#fff' : 'rgba(255,255,255,0.4)',
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clock style */}
      <div>
        <Label>Clock style</Label>
        <div className="space-y-4">
          {CLOCK_GROUPS.map(group => (
            <div key={group.label}>
              <p className="text-[10px] text-white/20 mb-2">{group.label}</p>
              <div className="grid grid-cols-4 gap-2">
                {group.styles.map(style => (
                  <div key={style.value} className="flex flex-col items-center gap-1">
                    <ClockPreview
                      clockStyle={style.value}
                      color={theme.accentColor}
                      size={52}
                      isSelected={customization.clockStyle === style.value}
                      onClick={() => set({ clockStyle: style.value as any })}
                    />
                    <span className="text-[9px] text-center leading-tight" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {style.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Widgets */}
      <div>
        <Label>Widgets</Label>
        <div className="space-y-px">
          {[
            { key: 'showWeather' as const, label: 'Weather' },
            { key: 'showDepartures' as const, label: 'Transit' },
            { key: 'showDate' as const, label: 'Date' },
            { key: 'showSeconds' as const, label: 'Seconds' },
          ].map(row => (
            <div key={row.key} className="flex items-center justify-between py-2.5 px-3 rounded-lg"
                 style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{row.label}</span>
              <Toggle on={!!customization[row.key]} onChange={v => set({ [row.key]: v })} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

// ─── LOCATION TAB ───────────────────────────────────────────────────────────

const MODES = [
  { key: 'subway',   label: 'U-Bahn', icon: 'U', color: '#0050a0' },
  { key: 'suburban', label: 'S-Bahn', icon: 'S', color: '#007a3d' },
  { key: 'tram',     label: 'Tram',   icon: 'T', color: '#c0392b' },
  { key: 'bus',      label: 'Bus',    icon: 'B', color: '#6d28d9' },
];

const ModeToggle: React.FC<{ on: boolean; onChange: (v: boolean) => void; color: string }> = ({ on, onChange, color }) => (
  <button
    onClick={() => onChange(!on)}
    className="relative flex-shrink-0 w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none"
    style={{ backgroundColor: on ? color : 'rgba(255,255,255,0.1)' }}
  >
    <span
      className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200"
      style={{ left: on ? '1.25rem' : '0.125rem' }}
    />
  </button>
);

const LocationTab: React.FC<{
  userConfig: UserConfig;
  onSave: (cfg: UserConfig) => void;
}> = ({ userConfig, onSave }) => {
  const [query, setQuery] = useState(userConfig.address);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSug, setShowSug] = useState(false);
  const [searching, setSearching] = useState(false);
  const [lat, setLat] = useState(userConfig.lat);
  const [lon, setLon] = useState(userConfig.lon);
  const [hiddenModes, setHiddenModes] = useState<string[]>(userConfig.hiddenModes ?? []);
  const [saved, setSaved] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setQuery(userConfig.address);
    setLat(userConfig.lat);
    setLon(userConfig.lon);
    setHiddenModes(userConfig.hiddenModes ?? []);
  }, [userConfig]);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 4) { setSuggestions([]); return; }
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=4&addressdetails=1`,
        { headers: { 'Accept-Language': 'en', 'User-Agent': 'DoorDashboard/1.0' } }
      );
      const data: any[] = await res.json();
      setSuggestions(data.map(r => {
        const { short, sub } = parseAddress(r.display_name);
        return { placeId: r.place_id, short, sub, lat: parseFloat(r.lat), lon: parseFloat(r.lon) };
      }));
      setShowSug(true);
    } catch { /* silently fail */ }
    setSearching(false);
  }, []);

  const handleQueryChange = (v: string) => {
    setQuery(v);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => search(v), 450);
  };

  const handleSelect = (s: Suggestion) => {
    setQuery(s.short + (s.sub ? `, ${s.sub}` : ''));
    setLat(s.lat);
    setLon(s.lon);
    setSuggestions([]);
    setShowSug(false);
  };

  const handleSave = () => {
    onSave({ address: query, lat, lon, hiddenModes });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">

      {/* Address search */}
      <div>
        <Label>Address</Label>
        <div className="relative">
          <div
            className="flex items-center rounded-xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
          >
            {searching ? (
              <svg className="ml-3 w-3.5 h-3.5 flex-shrink-0 opacity-30" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="31.4" strokeDashoffset="10"/>
              </svg>
            ) : (
              <svg className="ml-3 w-3.5 h-3.5 flex-shrink-0 opacity-25" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
              </svg>
            )}
            <input
              type="text"
              value={query}
              onChange={e => handleQueryChange(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSug(true)}
              placeholder="Alexanderplatz, Berlin"
              className="flex-1 bg-transparent py-2.5 px-2.5 text-sm text-white placeholder-white/20 outline-none"
            />
          </div>

          {showSug && suggestions.length > 0 && (
            <div
              className="absolute left-0 right-0 top-full mt-1 rounded-xl overflow-hidden z-10"
              style={{ backgroundColor: '#111820', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {suggestions.map((s, i) => (
                <button
                  key={s.placeId}
                  onClick={() => handleSelect(s)}
                  className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                  style={{
                    borderTop: i > 0 ? '1px solid rgba(255,255,255,0.04)' : undefined,
                    color: 'rgba(255,255,255,0.75)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span className="block font-medium">{s.short}</span>
                  {s.sub && <span className="block text-xs opacity-40 mt-0.5">{s.sub}</span>}
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="text-[10px] mt-2" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Right-click your address on Google Maps to find coordinates if needed.
        </p>
      </div>

      {/* Transit modes */}
      <div>
        <Label>Show in departures</Label>
        <div className="space-y-px">
          {MODES.map(mode => {
            const on = !hiddenModes.includes(mode.key);
            return (
              <div key={mode.key}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg"
                style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black text-white flex-shrink-0"
                    style={{ backgroundColor: on ? mode.color : 'rgba(255,255,255,0.08)' }}
                  >
                    {mode.icon}
                  </span>
                  <span className="text-sm" style={{ color: on ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)' }}>
                    {mode.label}
                  </span>
                </div>
                <ModeToggle
                  on={on}
                  onChange={v => setHiddenModes(prev => v ? prev.filter(m => m !== mode.key) : [...prev, mode.key])}
                  color={mode.color}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
        style={{
          backgroundColor: saved ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.08)',
          color: saved ? 'rgba(255,255,255,0.5)' : '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {saved ? 'Saved' : 'Save'}
      </button>

    </div>
  );
};

// ─── Main component ─────────────────────────────────────────────────────────

type Tab = 'theme' | 'display' | 'location';

export const ThemeSelector: React.FC<Props> = ({
  currentTheme, onThemeChange,
  customization, onCustomizationChange,
  userConfig, onSaveConfig,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('theme');

  return (
    <>
      {/* Single minimal trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-40 w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-100"
        style={{
          backgroundColor: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.09)',
          opacity: 0.5,
          color: 'rgba(255,255,255,0.6)',
        }}
        title="Settings"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="flex-1" onClick={() => setIsOpen(false)} />

          {/* Right-side panel */}
          <div
            className="relative flex flex-col panel-slide-in"
            style={{
              width: '360px',
              backgroundColor: '#080c10',
              borderLeft: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="text-[11px] font-semibold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Dashboard
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 flex items-center justify-center rounded transition-opacity hover:opacity-100"
                style={{ color: 'rgba(255,255,255,0.3)', opacity: 0.7 }}
              >
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex px-5 pt-3 pb-0 gap-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {(['theme', 'display', 'location'] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="flex-1 py-2 text-[11px] font-semibold uppercase tracking-wider transition-colors"
                  style={{
                    color: tab === t ? '#fff' : 'rgba(255,255,255,0.25)',
                    borderBottom: tab === t ? '1px solid rgba(255,255,255,0.6)' : '1px solid transparent',
                    marginBottom: '-1px',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {tab === 'theme' && (
                <ThemeTab currentTheme={currentTheme} onThemeChange={onThemeChange} />
              )}
              {tab === 'display' && (
                <DisplayTab theme={currentTheme} customization={customization} onChange={onCustomizationChange} />
              )}
              {tab === 'location' && (
                <LocationTab userConfig={userConfig} onSave={onSaveConfig} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
