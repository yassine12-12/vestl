import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Theme } from '../themes';
import { UserConfig } from '../userConfig';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  userConfig: UserConfig;
  onSave: (cfg: UserConfig) => void;
}

interface Suggestion {
  placeId: number;
  displayName: string;
  shortName: string;
  lat: number;
  lon: number;
}

interface ModeConfig {
  key: string;
  label: string;
  icon: string;
  color: string;
}

const MODES: ModeConfig[] = [
  { key: 'subway',   label: 'U-Bahn',  icon: 'U', color: '#0050a0' },
  { key: 'suburban', label: 'S-Bahn',  icon: 'S', color: '#007a3d' },
  { key: 'tram',     label: 'Tram',    icon: 'T', color: '#c0392b' },
  { key: 'bus',      label: 'Bus',     icon: 'B', color: '#6d28d9' },
];

function shortAddress(displayName: string): string {
  // Turn "34, Alexanderplatz, Mitte, Berlin, 10115, Germany" into "Alexanderplatz, Berlin"
  const parts = displayName.split(', ');
  const road = parts.find(p => /[a-zäöüß]/i.test(p) && !/^\d+$/.test(p) && p !== 'Germany' && p !== 'Deutschland');
  const number = parts[0].match(/^\d+$/) ? parts[0] : '';
  const city = parts.find(p => ['Berlin', 'München', 'Hamburg', 'Frankfurt', 'Köln', 'Stuttgart', 'Dresden'].includes(p));
  return [road, number].filter(Boolean).join(' ') + (city ? `, ${city}` : '');
}

// Pill toggle switch
const Toggle: React.FC<{ on: boolean; onChange: (v: boolean) => void; color: string }> = ({ on, onChange, color }) => (
  <button
    onClick={() => onChange(!on)}
    className="relative flex-shrink-0 w-11 h-6 rounded-full transition-all duration-200 focus:outline-none"
    style={{ backgroundColor: on ? color : 'rgba(255,255,255,0.12)' }}
  >
    <span
      className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-200"
      style={{ left: on ? '1.375rem' : '0.125rem' }}
    />
  </button>
);

export const SettingsModal: React.FC<Props> = ({ isOpen, onClose, theme, userConfig, onSave }) => {
  const [query, setQuery] = useState(userConfig.address);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);
  const [lat, setLat] = useState(userConfig.lat);
  const [lon, setLon] = useState(userConfig.lon);
  const [hiddenModes, setHiddenModes] = useState<string[]>(userConfig.hiddenModes ?? []);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(userConfig.address);
    setLat(userConfig.lat);
    setLon(userConfig.lon);
    setHiddenModes(userConfig.hiddenModes ?? []);
  }, [userConfig, isOpen]);

  const searchAddress = useCallback(async (q: string) => {
    if (q.trim().length < 4) { setSuggestions([]); return; }
    setSearching(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1`;
      const res = await fetch(url, { headers: { 'Accept-Language': 'en', 'User-Agent': 'DoorDashboard/1.0' } });
      const data: any[] = await res.json();
      const results: Suggestion[] = data.map(r => ({
        placeId: r.place_id,
        displayName: r.display_name,
        shortName: shortAddress(r.display_name),
        lat: parseFloat(r.lat),
        lon: parseFloat(r.lon),
      }));
      setSuggestions(results);
      setShowSuggestions(true);
    } catch { /* silently fail */ }
    setSearching(false);
  }, []);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchAddress(val), 450);
  };

  const handleSelectSuggestion = (s: Suggestion) => {
    setQuery(s.shortName || s.displayName);
    setLat(s.lat);
    setLon(s.lon);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const toggleMode = (key: string, on: boolean) => {
    setHiddenModes(prev => on ? prev.filter(m => m !== key) : [...prev, key]);
  };

  const handleSave = () => {
    onSave({ address: query, lat, lon, hiddenModes, hiddenLines: userConfig.hiddenLines ?? [], radius: userConfig.radius ?? 1000 });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: '#0a0f15', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-base font-bold tracking-wide text-white">Settings</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-white/10 text-white/40 hover:text-white text-sm"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">

          {/* ── Address ─────────────────────────────────────────── */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/35 mb-3">Your address</p>

            <div className="relative">
              <div className="flex items-center rounded-xl overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span className="pl-3.5 pr-2 text-white/30 text-sm flex-shrink-0">
                  {searching ? (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  ) : '🔍'}
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => handleQueryChange(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  placeholder="Alexanderplatz, Berlin"
                  className="flex-1 bg-transparent py-3 pr-3 text-sm text-white placeholder-white/25 outline-none"
                />
              </div>

              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  className="absolute left-0 right-0 top-full mt-1.5 rounded-xl overflow-hidden shadow-2xl z-10"
                  style={{ backgroundColor: '#141b24', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {suggestions.map((s, i) => (
                    <button
                      key={s.placeId}
                      onClick={() => handleSelectSuggestion(s)}
                      className="w-full text-left px-4 py-3 text-sm text-white/80 hover:bg-white/08 transition-colors"
                      style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : undefined, backgroundColor: 'transparent' }}
                      onMouseOver={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
                      onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <span className="block font-medium truncate">{s.shortName || s.displayName.split(', ').slice(0, 2).join(', ')}</span>
                      <span className="block text-xs text-white/30 mt-0.5 truncate">{s.displayName.split(', ').slice(2, 4).join(', ')}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Transit modes ────────────────────────────────────── */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/35 mb-3">Show in departures</p>
            <div className="space-y-1">
              {MODES.map(mode => {
                const on = !hiddenModes.includes(mode.key);
                return (
                  <div
                    key={mode.key}
                    className="flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors"
                    style={{ backgroundColor: on ? 'rgba(255,255,255,0.04)' : 'transparent' }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                        style={{ backgroundColor: on ? mode.color : 'rgba(255,255,255,0.1)' }}
                      >
                        {mode.icon}
                      </span>
                      <span className="text-sm font-medium" style={{ color: on ? '#fff' : 'rgba(255,255,255,0.35)' }}>
                        {mode.label}
                      </span>
                    </div>
                    <Toggle on={on} onChange={v => toggleMode(mode.key, v)} color={mode.color} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex gap-3 px-6 pb-6 pt-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-white/08"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: theme.accentColor }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
