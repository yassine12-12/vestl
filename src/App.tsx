import { useState, useEffect, useCallback } from 'react';
import { BvgLayout, BvgVariant, VariantCfg } from './components/BvgLayout';
import { ThemeSelector } from './components/ThemeSelector';
import { useWeather } from './hooks/useWeather';
import { useDepartures } from './hooks/useDepartures';
import { themes, Theme, getTheme } from './themes/index';
import { ThemeCustomization, DEFAULT_CUSTOMIZATION } from './types';
import { UserConfig, getUserConfig, saveUserConfig } from './userConfig';
import { config as defaultConfig } from './config';

// ─── Color helpers ─────────────────────────────────────────────────────────────

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function dimColor(color: string, alpha: number): string {
  if (/^#[0-9a-f]{6}/i.test(color)) return hexToRgba(color, alpha);
  if (color.startsWith('rgba(')) return color.replace(/,\s*[\d.]+\)$/, `,${alpha})`);
  if (color.startsWith('rgb(')) return color.replace('rgb(', 'rgba(').replace(')', `,${alpha})`);
  return color;
}

const GLOW_IDS = new Set(['terminal-green', 'matrix', 'dark-neon', 'tron', 'cyberpunk', 'berlin-night']);

function themeToVariantCfg(theme: Theme): VariantCfg {
  const color = theme.timeColor;
  const font = theme.fontFamily ?? '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';
  const isMonospace = /mono|courier|consolas/i.test(font);
  const hasGlow = theme.style === 'retro' || GLOW_IDS.has(theme.id);
  const glow = hasGlow
    ? `0 0 8px ${dimColor(color, 0.65)}, 0 0 2px ${dimColor(color, 0.9)}`
    : null;

  return {
    bg: theme.background,
    color,
    colorDim: theme.textSecondary ?? dimColor(color, 0.45),
    colorFaint: dimColor(color, 0.22),
    divider: dimColor(color, 0.12),
    glow,
    font,
    rowSize: 'clamp(2.6rem, 6.5vh, 5.8rem)',
    nextSize: 'clamp(1.5rem, 3.6vh, 3.2rem)',
    headerSize: 'clamp(2rem, 4.5vh, 3.8rem)',
    rowPadding: '1rem 2.4rem',
    maxRows: 8,
    showStrip: false,
    lineColRatio: isMonospace ? 2.0 : 2.6,
    urgentColor: theme.accentColor !== color ? theme.accentColor : undefined,
  };
}

// ─── Board variant map ─────────────────────────────────────────────────────────

const BOARD_VARIANT_MAP: Record<string, BvgVariant> = {
  'bvg': 'amber', 'bvg-green': 'green', 'bvg-large': 'large', 'bvg-clean': 'clean',
  'sbahn': 'sbahn', 'nova': 'nova', 'paper': 'paper', 'metro': 'metro', 'signal': 'signal',
  'bvg-icons': 'icons', 'bvg-yellow': 'yellow', 'bvg-day': 'day', 'bvg-paper-icons': 'paper-icons',
};

function App() {
  const [userConfig, setUserConfig] = useState<UserConfig>(() => {
    const saved = getUserConfig();
    return saved ?? { address: defaultConfig.MY_ADDRESS, lat: defaultConfig.MY_LAT, lon: defaultConfig.MY_LON, hiddenModes: [], hiddenLines: [], radius: 1000 };
  });

  const weatherState = useWeather(userConfig.lat, userConfig.lon);
  const departuresState = useDepartures(userConfig.lat, userConfig.lon, userConfig.radius ?? 1000);

  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('dashboardTheme');
    return saved ? (themes.find(t => t.id === saved) ?? getTheme(saved)) : themes[0];
  });

  const [customization, setCustomization] = useState<ThemeCustomization>(() => {
    const saved = localStorage.getItem('dashboardCustomization');
    return saved ? JSON.parse(saved) : DEFAULT_CUSTOMIZATION;
  });

  useEffect(() => {
    localStorage.setItem('dashboardTheme', currentTheme.id);
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem('dashboardCustomization', JSON.stringify(customization));
  }, [customization]);

  const handleSaveConfig = useCallback((cfg: UserConfig) => {
    saveUserConfig(cfg);
    setUserConfig(cfg);
  }, []);

  const boardVariant = BOARD_VARIANT_MAP[customization.layout];
  const customCfg = boardVariant ? undefined : themeToVariantCfg(currentTheme);

  return (
    <>
      <BvgLayout
        theme={currentTheme}
        weatherState={weatherState}
        departuresState={departuresState}
        hiddenModes={userConfig.hiddenModes}
        hiddenLines={userConfig.hiddenLines ?? []}
        variant={boardVariant ?? 'amber'}
        customCfg={customCfg}
        address={userConfig.address}
      />
      <ThemeSelector
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        customization={customization}
        onCustomizationChange={setCustomization}
        userConfig={userConfig}
        onSaveConfig={handleSaveConfig}
        departuresState={departuresState}
      />
    </>
  );
}

export default App;
