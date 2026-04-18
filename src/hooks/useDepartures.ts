import { useState, useEffect, useRef } from 'react';
import { config } from '../config';
import { DataState, DeparturesData } from '../types';

// Stop IDs cache keyed by "lat,lon,radius"
let stopCache: { key: string; ids: string[] } | null = null;

// Primary mode of a stop — subway and suburban are separate buckets so both
// can appear without being collapsed into one 'rail' slot.
function modeOf(s: any): 'subway' | 'suburban' | 'tram' | 'bus' {
  const p = s.products || {};
  if (p.subway)    return 'subway';
  if (p.suburban)  return 'suburban';
  if (p.tram)      return 'tram';
  return 'bus';
}

async function findNearbyStops(lat: number, lon: number, radius: number): Promise<string[]> {
  const key = `${lat.toFixed(4)},${lon.toFixed(4)},${radius}`;
  if (stopCache?.key === key) return stopCache.ids;

  const url = `https://v6.bvg.transport.rest/locations/nearby?latitude=${lat}&longitude=${lon}&results=20&distance=${radius}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Stops API error: ${response.status}`);

  const all: any[] = await response.json();
  const stops = all.filter((s: any) => s.type === 'stop' && s.id);
  if (stops.length === 0) throw new Error('No transit stops found nearby');

  // Sort by distance. Pick the closest stop of each HIGH-QUALITY mode (subway,
  // suburban, tram) — up to 3. Bus is added only as a last resort if fewer
  // than 2 quality stops exist within the radius.
  // This means: tram at 200m + S-Bahn at 360m + U-Bahn at 500m, NOT a bus
  // stop at 325m displacing the U-Bahn 500m away.
  stops.sort((a: any, b: any) => (a.distance ?? 0) - (b.distance ?? 0));

  const HIGH_QUALITY = new Set(['subway', 'suburban', 'tram']);
  const seenModes = new Set<string>();
  const ids: string[] = [];

  for (const s of stops) {
    if (ids.length >= 3) break;
    const mode = modeOf(s);
    if (HIGH_QUALITY.has(mode) && !seenModes.has(mode)) {
      seenModes.add(mode);
      ids.push(s.id);
    }
  }

  // Fallback: if we found fewer than 2 stops (e.g. bus-only area), add buses
  if (ids.length < 2) {
    for (const s of stops) {
      if (ids.length >= 3) break;
      if (modeOf(s) === 'bus' && !seenModes.has('bus')) {
        seenModes.add('bus');
        ids.push(s.id);
      }
    }
  }

  stopCache = { key, ids };
  return ids;
}

export const useDepartures = (lat: number, lon: number, radius = 1000) => {
  const [departuresState, setDeparturesState] = useState<DataState<DeparturesData>>({
    data: null,
    status: 'idle',
    error: null,
  });

  const lastData = useRef<DeparturesData | null>(null);

  const fetchDepartures = async () => {
    setDeparturesState(prev => ({ ...prev, status: 'loading' }));
    try {
      const stopIds = await findNearbyStops(lat, lon, radius);

      // Fetch all stops in parallel, ignore individual failures
      const results = await Promise.allSettled(
        stopIds.map(id =>
          fetch(`https://v6.bvg.transport.rest/stops/${id}/departures?results=25&duration=90`)
            .then(r => r.ok ? r.json() : Promise.reject(new Error(`${r.status}`)))
        )
      );

      const allRaw: any[] = results.flatMap(r =>
        r.status === 'fulfilled' ? (r.value.departures ?? []) : []
      );

      if (allRaw.length === 0 && results.every(r => r.status === 'rejected')) {
        throw new Error('Alle Abfragen fehlgeschlagen');
      }

      // Deduplicate by tripId
      const seen = new Set<string>();
      const departures = allRaw
        .filter((d: any) => d.when ?? d.plannedWhen)
        .filter((d: any) => {
          const id = d.tripId ?? `${d.line?.name}|${d.direction}|${d.when ?? d.plannedWhen}`;
          if (seen.has(id)) return false;
          seen.add(id);
          return true;
        })
        .map((d: any) => ({
          tripId: d.tripId ?? String(Math.random()),
          stop: { name: d.stop?.name ?? '' },
          when: d.when ?? d.plannedWhen,
          delay: d.delay ?? null,
          platform: d.platform ?? null,
          direction: d.direction ?? '',
          line: {
            name: d.line?.name ?? '',
            mode: d.line?.product ?? d.line?.mode ?? 'bus',
            product: d.line?.product ?? 'bus',
          },
        }));

      const data: DeparturesData = { departures };
      lastData.current = data;
      setDeparturesState({ data, status: 'success', error: null });
    } catch (error) {
      setDeparturesState({
        data: lastData.current,
        status: lastData.current ? 'success' : 'error',
        error: error instanceof Error ? error.message : 'Failed to fetch departures',
      });
    }
  };

  useEffect(() => {
    lastData.current = null; // reset stale data when location changes
    fetchDepartures();
    const interval = setInterval(fetchDepartures, config.REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [lat, lon, radius]);

  return departuresState;
};
