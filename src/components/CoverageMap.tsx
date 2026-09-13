import { useEffect, useRef, useState } from 'react';
import type { Map as LeafletMap, Marker as LeafletMarker, TileLayer as LeafletTileLayer } from 'leaflet';
import type { ServiceLocation } from '@types';
import { SERVICE_LOCATIONS } from '@data/coverage';
import 'leaflet/dist/leaflet.css';
import '@styles/coverage.css';

interface CustomLeafletMap extends LeafletMap {
  _customLightTiles?: LeafletTileLayer;
  _customSatTiles?: LeafletTileLayer;
}

// Peta difokuskan pada titik lokasi layanan (tanpa garis koridor tol)
interface CoverageMapProps {
  initialCityId?: string;
  onSelectCity?: (city: ServiceLocation) => void;
}

export default function CoverageMap({
  initialCityId = 'malang',
  onSelectCity,
}: CoverageMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<CustomLeafletMap | null>(null);
  const markersRef = useRef<Record<string, LeafletMarker>>({});
  
  const [activeCity, setActiveCity] = useState<ServiceLocation>(
    SERVICE_LOCATIONS.find((l) => l.id === initialCityId) || SERVICE_LOCATIONS[0]
  );
  const [mapMode, setMapMode] = useState<'voyager' | 'satellite'>('voyager');

  // Dynamically load Leaflet and initialize map on client-side
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isSubscribed = true;
    let resizeHandler: (() => void) | null = null;

    // Dynamic import of Leaflet
    import('leaflet').then((L) => {
      if (!isSubscribed || !mapContainerRef.current) return;

      // Clean up previous instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize map centered at East Java corridor
      const map = L.map(mapContainerRef.current, {
        center: [-7.65, 112.70],
        zoom: 9,
        scrollWheelZoom: false,
        attributionControl: false,
        zoomControl: false,
      });

      // Custom Clean Zoom Control on top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Layer 1: Esri World Street Map (Clean architectural road map, high-res, no watermark)
      const lightTiles = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 18,
        }
      );

      // Layer 2: Esri World Imagery (Satellite)
      const satTiles = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 18,
        }
      );

      // Default to architectural voyager tiles
      lightTiles.addTo(map);
      const customMap = map as CustomLeafletMap;
      customMap._customLightTiles = lightTiles;
      customMap._customSatTiles = satTiles;

      // Add Custom Glowing Markers for Each Location
      SERVICE_LOCATIONS.forEach((loc) => {
        const latLng = loc.latLng || [-7.9498, 112.6088];
        const isBase = loc.isBase;

        // Custom pulsing HTML marker
        const markerHtml = `
          <div class="custom-leaflet-pin-wrapper ${isBase ? 'is-hq-pin' : 'is-branch-pin'}">
            <div class="pin-pulse-wave"></div>
            <div class="pin-pulse-wave wave-delayed"></div>
            <div class="pin-dot-core">
              <span class="pin-inner-symbol">${isBase ? '★' : '•'}</span>
            </div>
            <div class="pin-label-tag">
              <span class="pin-city-text">${loc.shortName}</span>
              <span class="pin-status-text">${loc.travelTime || (isBase ? 'Base Utama' : 'Area Layanan')}</span>
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: markerHtml,
          className: 'leaflet-custom-marker-container',
          iconSize: [160, 48],
          iconAnchor: [20, 24],
          popupAnchor: [60, -20],
        });

        const marker = L.marker(latLng, { icon: customIcon }).addTo(map);

        // Rich Interactive Popup
        const popupContent = `
          <div class="leaflet-popup-card">
            <div class="popup-card-header">
              <span class="popup-badge ${isBase ? 'is-hq' : ''}">${loc.badge}</span>
              <h4 class="popup-title">${loc.name}</h4>
              <p class="popup-subtitle">${loc.address}</p>
            </div>
            <div class="popup-stats-grid">
              <div class="popup-stat-item">
                <span class="stat-label">Estimasi Waktu Tempuh:</span>
                <span class="stat-value highlight">${loc.travelTime}</span>
              </div>
              <div class="popup-stat-item">
                <span class="stat-label">Status Survei:</span>
                <span class="stat-value text-success font-weight-bold">${isBase ? '100% GRATIS' : 'Terjadwal Gratis'}</span>
              </div>
            </div>
            <div class="popup-action-wrap">
              <a href="https://wa.me/6281335335304?text=Halo%20Bina%20Project,%20saya%20ingin%20konsultasi%20proyek%20di%20${encodeURIComponent(loc.city)}" target="_blank" rel="noopener noreferrer" class="popup-wa-cta">
                <span>Konsultasi Wilayah Ini</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2Z"/></svg>
              </a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 320,
          className: 'bina-architectural-popup',
          closeButton: true,
        });

        marker.on('click', () => {
          setActiveCity(loc);
          if (onSelectCity) onSelectCity(loc);
        });

        markersRef.current[loc.id] = marker;
      });

      mapInstanceRef.current = map;

      // Force recalculation of container bounds for crisp tile rendering
      map.invalidateSize();
      setTimeout(() => {
        if (isSubscribed && mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 250);

      // Handle window resize dynamically
      resizeHandler = () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      };
      window.addEventListener('resize', resizeHandler);
    });

    return () => {
      isSubscribed = false;
      if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle City Switch (Smooth FlyTo & Open Marker Popup)
  const handleSelectCity = (loc: ServiceLocation) => {
    setActiveCity(loc);
    if (onSelectCity) onSelectCity(loc);

    if (mapInstanceRef.current && loc.latLng) {
      const zoomLevel = loc.isBase ? 11 : 10.5;
      mapInstanceRef.current.flyTo(loc.latLng, zoomLevel, {
        duration: 1.2,
        easeLinearity: 0.25,
      });

      // Auto open popup after fly
      const marker = markersRef.current[loc.id];
      if (marker) {
        setTimeout(() => {
          marker.openPopup();
        }, 1100);
      }
    }
  };

  // Switch Between Architectural Map and Satellite Imagery
  const toggleMapMode = (mode: 'voyager' | 'satellite') => {
    setMapMode(mode);
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (mode === 'satellite') {
      if (map._customLightTiles) map.removeLayer(map._customLightTiles);
      if (map._customSatTiles) map.addLayer(map._customSatTiles);
    } else {
      if (map._customSatTiles) map.removeLayer(map._customSatTiles);
      if (map._customLightTiles) map.addLayer(map._customLightTiles);
    }
  };

  // Reset View to full service area
  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([-7.65, 112.70], 9, {
        duration: 1,
      });
    }
  };

  return (
    <div className="coverage-map-modern-container">
      {/* Map Control Toolbar */}
      <div className="coverage-map-top-bar">
        <div className="coverage-bar-left">
          <div className="live-indicator-pill">
            <span className="pulsing-radar-dot"></span>
            <span className="live-pill-text">PETA WILAYAH LAYANAN JAWA TIMUR</span>
          </div>
        </div>

        {/* City Filter Pills */}
        <div className="coverage-city-pill-tabs">
          {SERVICE_LOCATIONS.map((loc) => {
            const isSelected = activeCity.id === loc.id;
            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => handleSelectCity(loc)}
                className={`city-pill-btn ${isSelected ? 'active' : ''} ${loc.isHQ ? 'is-hq' : ''}`}
              >
                {loc.isHQ && <span className="hq-icon">★</span>}
                <span className="city-btn-name">{loc.shortName}</span>
              </button>
            );
          })}
        </div>

        {/* Map View Mode Switchers */}
        <div className="coverage-map-tools">
          <div className="map-view-toggle-group">
            <button
              type="button"
              onClick={() => toggleMapMode('voyager')}
              className={`tool-btn ${mapMode === 'voyager' ? 'active' : ''}`}
              title="Tampilan Peta Arsitektur"
            >
              Arsitektur
            </button>
            <button
              type="button"
              onClick={() => toggleMapMode('satellite')}
              className={`tool-btn ${mapMode === 'satellite' ? 'active' : ''}`}
              title="Tampilan Foto Satelit"
            >
              Satelit
            </button>
          </div>
          <button
            type="button"
            onClick={handleResetView}
            className="tool-btn reset-btn"
            title="Reset Sudut Pandang Seluruh Wilayah"
          >
            Reset
          </button>
        </div>
      </div>

      {/* The Leaflet Canvas */}
      <div className="coverage-leaflet-viewport">
        <div ref={mapContainerRef} className="coverage-map-actual-canvas" />

        {/* Floating Quick Legend (Bottom Left) */}
        <div className="coverage-floating-legend">
          <div className="legend-header">
            <span className="legend-title">WILAYAH LAYANAN</span>
          </div>
          <div className="legend-item">
            <span className="legend-bullet hq-bullet">★</span>
            <span className="legend-text"><strong>Base Utama Malang</strong> (Studio & Workshop)</span>
          </div>
          <div className="legend-item">
            <span className="legend-bullet branch-bullet">•</span>
            <span className="legend-text"><strong>Area Pasuruan & Surabaya</strong> (Proyek Aktif)</span>
          </div>
        </div>
      </div>

      {/* Simple Clean Bottom Bar */}
      <div className="coverage-map-simple-footer">
        <div className="coverage-footer-left">
          <span className="coverage-hq-dot"></span>
          <span className="coverage-hq-text">
            <strong>Kantor Pusat:</strong> Jl. Watumujur II No.6, Kota Malang
          </span>
          <span className="coverage-hq-sep">•</span>
          <span className="coverage-active-note">
            Wilayah Terpilih: <strong>{activeCity.name}</strong> ({activeCity.role})
          </span>
        </div>
        <a
          href={`https://wa.me/6281335335304?text=Halo%20Bina%20Project,%20saya%20ingin%20konsultasi%20proyek%20di%20${encodeURIComponent(activeCity.name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="coverage-simple-wa-btn"
          aria-label={`Konsultasi WhatsApp untuk wilayah ${activeCity.name}`}
        >
          <span>Konsultasi Wilayah Ini</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2Z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
