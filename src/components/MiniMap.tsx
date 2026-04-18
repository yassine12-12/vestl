import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Props {
  lat: number;
  lon: number;
  radius?: number;
  onChange: (lat: number, lon: number) => void;
}

export const MiniMap: React.FC<Props> = ({ lat, lon, radius = 1000, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<L.Map | null>(null);
  const markerRef    = useRef<L.Marker | null>(null);
  const circleRef    = useRef<L.Circle | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [lat, lon],
      zoom: 15,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    const circle = L.circle([lat, lon], {
      radius,
      color: 'rgba(99,179,237,0.85)',
      fillColor: 'rgba(99,179,237,0.1)',
      fillOpacity: 1,
      weight: 1.5,
    }).addTo(map);

    const marker = L.marker([lat, lon], { draggable: true }).addTo(map);

    marker.on('dragend', () => {
      const { lat: mlat, lng: mlon } = marker.getLatLng();
      circle.setLatLng([mlat, mlon]);
      onChange(mlat, mlon);
    });

    map.on('click', (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      circle.setLatLng(e.latlng);
      onChange(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current    = map;
    markerRef.current = marker;
    circleRef.current = circle;

    return () => {
      map.remove();
      mapRef.current    = null;
      markerRef.current = null;
      circleRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync marker, circle position + radius when props change (geocode / geolocate / slider)
  useEffect(() => {
    if (!mapRef.current || !markerRef.current || !circleRef.current) return;
    const ll = L.latLng(lat, lon);
    markerRef.current.setLatLng(ll);
    circleRef.current.setLatLng(ll);
    circleRef.current.setRadius(radius);
    mapRef.current.setView(ll, mapRef.current.getZoom(), { animate: true });
  }, [lat, lon, radius]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '200px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    />
  );
};
