import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Theme } from '../themes';
import { berlinThemes } from '../themes/berlinThemes';
import { vestlThemes } from '../themes/vestlThemes';
import { ThemeCustomization, DataState, DeparturesData } from '../types';
import { UserConfig } from '../userConfig';
import { MiniMap } from './MiniMap';

// ─── Props ──────────────────────────────────────────────────────────────────

interface Props {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  customization: ThemeCustomization;
  onCustomizationChange: (c: ThemeCustomization) => void;
  userConfig: UserConfig;
  onSaveConfig: (cfg: UserConfig) => void;
  departuresState: DataState<DeparturesData>;
}


// ─── Section label ───────────────────────────────────────────────────────────

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', color: 'rgba(255,255,255,0.4)' }}>
    {children}
  </p>
);

// ─── Section divider ─────────────────────────────────────────────────────────

const SectionHeader: React.FC<{ label: string }> = ({ label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
    <p style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.55)' }}>
      {label}
    </p>
    <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }} />
  </div>
);

// ─── Address suggestion types ────────────────────────────────────────────────

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

// ─── BOARDS ──────────────────────────────────────────────────────────────────

const BOARDS = [
  { value: 'bvg-green', label: 'BVG Green',  desc: 'Neon green LED',      bg: '#000d02', accent: '#00e05a', fav: true  },
  { value: 'bvg',       label: 'BVG Amber',  desc: 'Classic amber LED',   bg: '#020100', accent: '#ffb200', fav: true  },
  { value: 'bvg-clean', label: 'BVG Clean',  desc: 'Minimal white',       bg: '#080808', accent: '#e0e0e0', fav: false },
  { value: 'bvg-large', label: 'BVG Large',  desc: 'Big text display',    bg: '#000d02', accent: '#00e05a', fav: false },
  { value: 'bvg-icons',   label: 'BVG Icons',   desc: 'Official line badges', bg: '#08080c', accent: '#005BAC', fav: true  },
  { value: 'bvg-yellow',  label: 'BVG Yellow',  desc: 'Corporate yellow LED', bg: '#0a0900', accent: '#FFDD00', fav: true  },
  { value: 'bvg-day',         label: 'BVG Day',        desc: 'Yellow ground, black',  bg: '#FFDD00', accent: '#0a0900', fav: false },
  { value: 'bvg-paper-icons', label: 'Paper + Icons',  desc: 'Warm paper, BVG badges', bg: '#f7f4ec', accent: '#1a1a18', fav: true  },
  { value: 'signal',    label: 'Signal',     desc: 'Swiss airport style', bg: '#050505', accent: '#F59E0B', fav: false },
  { value: 'sbahn',     label: 'S-Bahn',     desc: 'Berlin S-Bahn',       bg: '#001505', accent: '#007734', fav: false },
  { value: 'metro',     label: 'Metro',      desc: 'Metro board',         bg: '#00050f', accent: '#4488ff', fav: false },
  { value: 'nova',      label: 'Nova',       desc: 'Nova layout',         bg: '#080410', accent: '#a855f7', fav: false },
  { value: 'paper',     label: 'Paper',      desc: 'Paper texture',       bg: '#14120c', accent: '#c8a96e', fav: false },
] as const;

const BOARD_VALUES = BOARDS.map(b => b.value) as string[];

const BoardRow: React.FC<{
  board: typeof BOARDS[number];
  active: boolean;
  onClick: () => void;
}> = ({ board, active, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl text-left"
    style={{
      backgroundColor: active ? 'rgba(255,255,255,0.07)' : 'transparent',
      border: `1px solid ${active ? 'rgba(255,255,255,0.11)' : 'rgba(255,255,255,0.0)'}`,
    }}
    onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
    onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent'; }}
  >
    {/* Color swatch */}
    <div className="flex gap-1 flex-shrink-0">
      <div className="w-6 h-9 rounded-md" style={{ backgroundColor: board.bg }} />
      <div className="w-2 h-9 rounded-md" style={{ backgroundColor: board.accent }} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5">
        <p className="text-sm font-medium" style={{ color: active ? '#fff' : 'rgba(255,255,255,0.65)' }}>
          {board.label}
        </p>
        {board.fav && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
            style={{ backgroundColor: `${board.accent}22`, color: board.accent }}>
            fav
          </span>
        )}
      </div>
      <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
        {board.desc}
      </p>
    </div>
    {active && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: board.accent }} />}
  </button>
);

// ─── THEME ROW ───────────────────────────────────────────────────────────────

const ThemeRow: React.FC<{ theme: Theme; active: boolean; onClick: () => void }> = ({ theme, active, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl text-left"
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

// ─── THEME TAB ───────────────────────────────────────────────────────────────

const ThemeTab: React.FC<{
  currentTheme: Theme;
  onThemeChange: (t: Theme) => void;
  customization: ThemeCustomization;
  onCustomizationChange: (c: ThemeCustomization) => void;
}> = ({ currentTheme, onThemeChange, customization, onCustomizationChange }) => {

  const isBoardActive = BOARD_VALUES.includes(customization.layout);
  const setLayout = (value: string) =>
    onCustomizationChange({ ...customization, layout: value as ThemeCustomization['layout'] });

  const vestlList  = vestlThemes as Theme[];
  const berlinList = berlinThemes as Theme[];

  const ThemeSection = ({ label, list }: { label: string; list: Theme[] }) => (
    <div className="mb-5">
      <SectionHeader label={label} />
      <div className="space-y-0.5">
        {list.map(theme => (
          <ThemeRow
            key={theme.id}
            theme={theme}
            active={!isBoardActive && theme.id === currentTheme.id}
            onClick={() => {
              if (isBoardActive) setLayout('default');
              onThemeChange(theme);
            }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {/* ── Boards ── */}
      <div className="mb-6">
        <SectionHeader label="Boards" />
        <div className="space-y-0.5">
          {BOARDS.map(board => (
            <BoardRow
              key={board.value}
              board={board}
              active={customization.layout === board.value}
              onClick={() => setLayout(board.value)}
            />
          ))}
        </div>
      </div>

      {/* Divider between boards and color themes */}
      <div className="mb-5 flex items-center gap-2">
        <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
        <span className="text-[9px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.18)' }}>
          Color themes
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
      </div>

      <ThemeSection label="VESTL"  list={vestlList} />
      <ThemeSection label="Berlin" list={berlinList} />
    </div>
  );
};

// ─── LOCATION TAB ────────────────────────────────────────────────────────────

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

const LINE_COLORS: Record<string, string> = {
  U1:'#55b947',U2:'#d9222a',U3:'#16683d',U4:'#ffcf00',U5:'#7e5330',
  U6:'#7d4499',U7:'#528dba',U8:'#224f86',U9:'#f3791d',
  S1:'#da5cbc',S2:'#007734',S3:'#0065b3',S5:'#f54f2c',
  S7:'#716ba6',S8:'#55b947',S9:'#a04f75',
};
const MODE_COLORS: Record<string, string> = {
  subway:'#0050a0',suburban:'#007734',tram:'#cc0000',bus:'#5c3d8f',
};
const badgeColor = (name: string, mode: string) => LINE_COLORS[name] ?? MODE_COLORS[mode] ?? '#444';


const LocationTab: React.FC<{
  userConfig: UserConfig;
  onSave: (cfg: UserConfig) => void;
  departuresState: DataState<DeparturesData>;
}> = ({ userConfig, onSave, departuresState }) => {
  const [query, setQuery]             = useState(userConfig.address);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSug, setShowSug]         = useState(false);
  const [searching, setSearching]     = useState(false);
  const [locating, setLocating]       = useState(false);
  const [locateError, setLocateError] = useState('');
  const [lat, setLat]                 = useState(userConfig.lat);
  const [lon, setLon]                 = useState(userConfig.lon);
  const [hiddenModes, setHiddenModes] = useState<string[]>(userConfig.hiddenModes ?? []);
  const [hiddenLines, setHiddenLines] = useState<string[]>(userConfig.hiddenLines ?? []);
  const [radius, setRadius]           = useState(userConfig.radius ?? 1000);
  const [saved, setSaved]             = useState(false);
  const debounce      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userTypingRef = useRef(false);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setQuery(userConfig.address);
    setLat(userConfig.lat);
    setLon(userConfig.lon);
    setHiddenModes(userConfig.hiddenModes ?? []);
    setHiddenLines(userConfig.hiddenLines ?? []);
    setRadius(userConfig.radius ?? 1000);
  }, [userConfig]);

  // Build unique line+direction combos from live data
  const lineGroups = React.useMemo(() => {
    const deps = departuresState.data?.departures ?? [];
    const seen = new Map<string, { lineName: string; lineMode: string; direction: string }>();
    deps.forEach(d => {
      const key = `${d.line.name}||${d.direction}`;
      if (!seen.has(key)) seen.set(key, { lineName: d.line.name, lineMode: d.line.mode, direction: d.direction });
    });
    return Array.from(seen.values()).sort((a, b) => a.lineName.localeCompare(b.lineName));
  }, [departuresState.data]);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 3) { setSuggestions([]); setShowSug(false); return; }
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1`,
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
    userTypingRef.current = true;
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => { userTypingRef.current = false; }, 2000);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => search(v), 280);
  };

  const handleSelect = (s: Suggestion) => {
    setQuery(s.short + (s.sub ? `, ${s.sub}` : ''));
    setLat(s.lat);
    setLon(s.lon);
    setSuggestions([]);
    setShowSug(false);
  };

  const handleLocate = () => {
    if (!navigator.geolocation) { setLocateError('Not supported'); return; }
    setLocating(true);
    setLocateError('');
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude } = pos.coords;
        setLat(latitude);
        setLon(longitude);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { 'Accept-Language': 'en', 'User-Agent': 'DoorDashboard/1.0' } }
          );
          const data = await res.json();
          const { short, sub } = parseAddress(data.display_name);
          setQuery(short + (sub ? `, ${sub}` : ''));
        } catch {
          setQuery(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        }
        setLocating(false);
      },
      err => {
        setLocateError(err.code === 1 ? 'Access denied' : 'Could not locate');
        setLocating(false);
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleSave = () => {
    onSave({ address: query, lat, lon, hiddenModes, hiddenLines, radius });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">

      {/* Address */}
      <div>
        <Label>Address</Label>
        <div className="relative">
          <div
            className="flex items-center rounded-xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
          >
            {searching ? (
              <svg className="ml-3 w-3.5 h-3.5 flex-shrink-0 animate-spin opacity-30" viewBox="0 0 24 24" fill="none">
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
            {/* Locate me button */}
            <button
              onClick={handleLocate}
              disabled={locating}
              title="Auto-detect my location"
              className="mr-2 w-7 h-7 flex-shrink-0 rounded-lg flex items-center justify-center transition-colors"
              style={{ backgroundColor: 'rgba(255,255,255,0.07)', color: locating ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.55)' }}
              onMouseEnter={e => { if (!locating) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.13)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'; }}
            >
              {locating ? (
                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="31.4" strokeDashoffset="10"/>
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="7" strokeDasharray="2 4"/>
                </svg>
              )}
            </button>
          </div>

          {showSug && suggestions.length > 0 && (
            <div
              className="absolute left-0 right-0 top-full mt-1 rounded-xl overflow-hidden"
              style={{ backgroundColor: '#111820', border: '1px solid rgba(255,255,255,0.08)', zIndex: 9999 }}
            >
              {suggestions.map((s, i) => (
                <button
                  key={s.placeId}
                  onClick={() => handleSelect(s)}
                  className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                  style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.04)' : undefined, color: 'rgba(255,255,255,0.75)' }}
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
        {locateError && (
          <p className="text-[10px] mt-1.5" style={{ color: '#ef4444' }}>{locateError}</p>
        )}
        <div className="mt-3">
          <MiniMap lat={lat} lon={lon} radius={radius} onChange={async (nlat, nlon) => {
            setLat(nlat);
            setLon(nlon);
            if (userTypingRef.current) return;
            try {
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${nlat}&lon=${nlon}&format=json`,
                { headers: { 'Accept-Language': 'en', 'User-Agent': 'DoorDashboard/1.0' } }
              );
              const data = await res.json();
              const { short, sub } = parseAddress(data.display_name);
              setQuery(short + (sub ? `, ${sub}` : ''));
            } catch { /* keep existing query */ }
          }} />
          <p className="text-[10px] mt-1.5" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Drag the pin or click to adjust position.
          </p>
        </div>
      </div>

      {/* Radius slider */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label>Search radius</Label>
          <span className="text-xs font-semibold tabular-nums" style={{ color: 'rgba(255,255,255,0.65)' }}>
            {radius >= 1000 ? `${(radius / 1000).toFixed(1).replace('.0', '')} km` : `${radius} m`}
          </span>
        </div>
        <input
          type="range"
          min={100}
          max={2000}
          step={50}
          value={radius}
          onChange={e => setRadius(Number(e.target.value))}
          className="w-full h-1 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: 'rgba(255,255,255,0.7)', backgroundColor: 'rgba(255,255,255,0.1)' }}
        />
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>100 m</span>
          <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>2 km</span>
        </div>
      </div>

      {/* Transit modes */}
      <div>
        <Label>Transport types</Label>
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

      {/* Line / direction filter */}
      {lineGroups.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Lines & directions</Label>
            {hiddenLines.length > 0 && (
              <button
                onClick={() => setHiddenLines([])}
                className="text-[10px] font-semibold"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                Show all
              </button>
            )}
          </div>
          <div className="space-y-px">
            {lineGroups.map(({ lineName, lineMode, direction }) => {
              const key = `${lineName}||${direction}`;
              const on = !hiddenLines.includes(key);
              const color = badgeColor(lineName, lineMode);
              return (
                <div key={key}
                  className="flex items-center justify-between py-2 px-3 rounded-lg"
                  style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="flex-shrink-0 px-1.5 py-0.5 rounded text-[11px] font-black"
                      style={{ backgroundColor: on ? color : 'rgba(255,255,255,0.08)', color: on ? '#fff' : 'rgba(255,255,255,0.3)', minWidth: '2rem', textAlign: 'center' }}
                    >
                      {lineName}
                    </span>
                    <span
                      className="text-xs truncate"
                      style={{ color: on ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)' }}
                    >
                      {direction}
                    </span>
                  </div>
                  <ModeToggle on={on} onChange={v => setHiddenLines(prev => v ? prev.filter(k => k !== key) : [...prev, key])} color={color} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Save — sticky so it's always visible */}
      <div style={{
        position: 'sticky',
        bottom: 0,
        backgroundColor: '#080c10',
        paddingTop: '12px',
        paddingBottom: '24px',
        marginTop: '8px',
        zIndex: 10,
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
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

    </div>
  );
};

// ─── Main ────────────────────────────────────────────────────────────────────

type Tab = 'theme' | 'location';

export const ThemeSelector: React.FC<Props> = ({
  currentTheme, onThemeChange,
  customization, onCustomizationChange,
  userConfig, onSaveConfig,
  departuresState,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('theme');
  const [btnVisible, setBtnVisible] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const show = () => {
      setBtnVisible(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setBtnVisible(false), 3000);
    };
    show();
    window.addEventListener('mousemove', show);
    window.addEventListener('touchstart', show);
    return () => {
      window.removeEventListener('mousemove', show);
      window.removeEventListener('touchstart', show);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        title="Settings"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 40,
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.18)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '2px solid rgba(255,255,255,0.5)',
          color: '#fff',
          boxShadow: '0 6px 32px rgba(0,0,0,0.8)',
          cursor: 'pointer',
          opacity: btnVisible ? 1 : 0,
          transition: 'opacity 0.6s ease',
          pointerEvents: btnVisible ? 'auto' : 'none',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      </button>

      {isOpen && (
        <>
        <div
          className="fixed inset-0 z-40"
          style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(2px)' }}
          onClick={() => setIsOpen(false)}
        />

        <div
          className="fixed flex flex-col panel-slide-in"
          style={{
            top: 0,
            right: 0,
            bottom: 0,
            zIndex: 50,
            width: 'clamp(420px, 38vw, 720px)',
            fontSize: '16px',
            backgroundColor: '#080c10',
            borderLeft: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '-8px 0 48px rgba(0,0,0,0.7)',
          }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-5"
                 style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="text-sm font-semibold tracking-widest uppercase"
                    style={{ color: 'rgba(255,255,255,0.35)' }}>
                Dashboard
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full transition-all hover:bg-white/10 hover:opacity-100"
                style={{ color: 'rgba(255,255,255,0.5)', opacity: 0.85 }}
              >
                <svg width="16" height="16" viewBox="0 0 11 11" fill="none">
                  <path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex px-6 pt-3 pb-0 gap-1"
                 style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {(['theme', 'location'] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="flex-1 py-3 text-sm font-semibold uppercase tracking-wider transition-colors"
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {tab === 'theme' && (
                <ThemeTab
                  currentTheme={currentTheme}
                  onThemeChange={onThemeChange}
                  customization={customization}
                  onCustomizationChange={onCustomizationChange}
                />
              )}
              {tab === 'location' && (
                <LocationTab userConfig={userConfig} onSave={onSaveConfig} departuresState={departuresState} />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};
