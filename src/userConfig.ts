export interface UserConfig {
  address: string;
  lat: number;
  lon: number;
  hiddenModes: string[]; // e.g. ['suburban', 'bus']
}

const CONFIG_KEY = 'doorDashUserConfig';

export function getUserConfig(): UserConfig | null {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (typeof p.lat !== 'number' || typeof p.lon !== 'number') return null;
    return p as UserConfig;
  } catch {
    return null;
  }
}

export function saveUserConfig(cfg: UserConfig): void {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
  // Clear cached stop so it re-detects for the new location
  try { localStorage.removeItem('nearbyStopId'); } catch { /* ignore */ }
}
