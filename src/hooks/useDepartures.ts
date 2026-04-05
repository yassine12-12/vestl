import { useState, useEffect, useRef } from 'react';
import { config } from '../config';
import { DataState, DeparturesData } from '../types';

// Stop ID cache keyed by "lat,lon" so it resets when location changes
let stopCache: { key: string; id: string } | null = null;

async function findNearbyStop(lat: number, lon: number): Promise<string> {
  const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
  if (stopCache?.key === key) return stopCache.id;

  const url = `https://v6.bvg.transport.rest/locations/nearby?latitude=${lat}&longitude=${lon}&results=15&distance=1000`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Stops API error: ${response.status}`);

  const all: any[] = await response.json();
  const stops = all.filter((s: any) => s.type === 'stop' && s.id);
  if (stops.length === 0) throw new Error('No transit stops found nearby');

  // Prefer stops with subway > suburban > tram > bus-only
  const priority = (s: any) => {
    const p = s.products || {};
    if (p.subway) return 3;
    if (p.suburban) return 2;
    if (p.tram) return 1;
    return 0;
  };
  const best = stops.sort((a: any, b: any) => priority(b) - priority(a))[0];
  stopCache = { key, id: best.id };
  return best.id;
}

export const useDepartures = (lat: number, lon: number) => {
  const [departuresState, setDeparturesState] = useState<DataState<DeparturesData>>({
    data: null,
    status: 'idle',
    error: null,
  });

  const lastData = useRef<DeparturesData | null>(null);

  const fetchDepartures = async () => {
    setDeparturesState(prev => ({ ...prev, status: 'loading' }));
    try {
      const stopId = await findNearbyStop(lat, lon);
      const url = `https://v6.bvg.transport.rest/stops/${stopId}/departures?results=20&duration=60`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Departures API error: ${response.status}`);

      const rawData = await response.json();
      const departures = (rawData.departures ?? [])
        .filter((d: any) => d.when)
        .map((d: any) => ({
          tripId: d.tripId ?? String(Math.random()),
          stop: { name: d.stop?.name ?? '' },
          when: d.when,
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
  }, [lat, lon]);

  return departuresState;
};
