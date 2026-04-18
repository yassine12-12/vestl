export interface UserConfig {
  address: string;
  lat: number;
  lon: number;
  hiddenModes: string[];   // e.g. ['suburban', 'bus']
  hiddenLines: string[];   // e.g. ['M10||S+U Warschauer Str.']
  radius: number;          // meters, e.g. 800
}

const CONFIG_KEY = 'doorDashUserConfig';

export function getUserConfig(): UserConfig | null {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (typeof p.lat !== 'number' || typeof p.lon !== 'number') return null;
    // Migrate old configs that lack newer fields
    return {
      hiddenModes: [],
      hiddenLines: [],
      radius: 1000,
      ...p,
    } as UserConfig;
  } catch {
    return null;
  }
}

export function saveUserConfig(cfg: UserConfig): void {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
  // Clear cached stop so it re-detects for the new location
  try { localStorage.removeItem('nearbyStopId'); } catch { /* ignore */ }
}
