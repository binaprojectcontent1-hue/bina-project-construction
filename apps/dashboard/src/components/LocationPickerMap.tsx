import React, { useEffect, useRef } from 'react';
import type { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationPickerMapProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}

const PRESET_CITIES = [
  { name: 'Kota Malang', lat: -7.9780, lng: 112.6300 },
  { name: 'Kota Batu', lat: -7.8700, lng: 112.5270 },
  { name: 'Kab. Malang', lat: -8.1500, lng: 112.5700 },
  { name: 'Surabaya', lat: -7.2575, lng: 112.7521 },
  { name: 'Sidoarjo', lat: -7.4478, lng: 112.7183 },
  { name: 'Pasuruan', lat: -7.6453, lng: 112.9075 },
];

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({ lat, lng, onChange }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);

  // Initialize Leaflet
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isSubscribed = true;

    import('leaflet').then((L) => {
      if (!isSubscribed || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const initialLat = lat || -7.9780;
      const initialLng = lng || 112.6300;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Custom Clean Architectural Pin
      const pinHtml = `
        <div style="display:flex;flex-direction:column;align-items:center;cursor:grab;">
          <div style="background:#0F172A;color:#FFFFFF;border:2px solid #E67E22;border-radius:9999px;padding:4px 8px;font-size:11px;font-weight:700;display:flex;align-items:center;gap:4px;box-shadow:0 4px 10px rgba(0,0,0,0.25);">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>Pin Proyek</span>
          </div>
          <div style="width:2px;height:8px;background:#E67E22;"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: pinHtml,
        className: 'location-picker-pin',
        iconSize: [80, 36],
        iconAnchor: [40, 34],
      });

      const marker = L.marker([initialLat, initialLng], {
        icon: customIcon,
        draggable: true,
      }).addTo(map);

      // Drag event
      marker.on('dragend', () => {
        const position = marker.getLatLng();
        onChange(Number(position.lat.toFixed(6)), Number(position.lng.toFixed(6)));
      });

      // Click on map to reposition pin
      map.on('click', (e) => {
        const { lat: newLat, lng: newLng } = e.latlng;
        marker.setLatLng([newLat, newLng]);
        onChange(Number(newLat.toFixed(6)), Number(newLng.toFixed(6)));
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;

      // Invalidate size after modal render animation completes
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    });

    return () => {
      isSubscribed = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update marker position if prop lat/lng change from outside (e.g. preset button)
  useEffect(() => {
    if (markerRef.current && mapInstanceRef.current && lat && lng) {
      markerRef.current.setLatLng([lat, lng]);
      mapInstanceRef.current.panTo([lat, lng]);
    }
  }, [lat, lng]);

  const handleCityJump = (cLat: number, cLng: number) => {
    onChange(cLat, cLng);
    if (mapInstanceRef.current && markerRef.current) {
      markerRef.current.setLatLng([cLat, cLng]);
      mapInstanceRef.current.flyTo([cLat, cLng], 13, { duration: 0.8 });
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Titik Lokasi Proyek (Klik / Geser Pin)
        </label>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Lokasi Ditentukan
        </span>
      </div>

      {/* Quick City Presets */}
      <div className="flex flex-wrap items-center gap-1.5 pb-1">
        <span className="text-[11px] text-slate-500 font-medium">Lompat Cepat:</span>
        {PRESET_CITIES.map((city) => (
          <button
            key={city.name}
            type="button"
            onClick={() => handleCityJump(city.lat, city.lng)}
            className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          >
            {city.name}
          </button>
        ))}
      </div>

      {/* Mini Map Canvas */}
      <div className="relative rounded-xl overflow-hidden border border-slate-700/80 shadow-inner bg-slate-900">
        <div ref={mapContainerRef} className="w-full h-56 z-0" />
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed">
        💡 <strong className="text-slate-300">Privasi Klien Terjamin:</strong> Cukup tempatkan pin pada perkiraan kawasan proyek. Angka koordinat desimal tidak akan pernah ditampilkan ke publik di website.
      </p>
    </div>
  );
};
