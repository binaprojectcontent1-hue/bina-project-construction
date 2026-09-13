import { useEffect, useRef, useState } from 'react';
import type { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';
import type { LiveProject } from '../types/liveProject';
import { FALLBACK_LIVE_PROJECTS } from '../data/liveProjects';
import { createClient } from '@supabase/supabase-js';
import 'leaflet/dist/leaflet.css';
import '@styles/coverage.css';

interface LiveProjectsMapProps {
  initialCategory?: string;
}

export default function LiveProjectsMap({ initialCategory = 'all' }: LiveProjectsMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LeafletMarker[]>([]);

  const [projects, setProjects] = useState<LiveProject[]>(FALLBACK_LIVE_PROJECTS);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch live projects from Supabase or fallback
  useEffect(() => {
    let isMounted = true;

    async function loadProjects() {
      const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseAnonKey) {
        try {
          const supabase = createClient(supabaseUrl, supabaseAnonKey);
          const { data, error } = await supabase
            .from('live_projects')
            .select('*')
            .eq('is_active', true)
            .order('progress', { ascending: false });

          if (!error && data && data.length > 0) {
            if (isMounted) {
              setProjects(data as LiveProject[]);
              setIsLoading(false);
              return;
            }
          }
        } catch (err) {
          console.warn('[LiveProjectsMap] Supabase fetch fallback to local data:', err);
        }
      }

      if (isMounted) {
        setProjects(FALLBACK_LIVE_PROJECTS);
        setIsLoading(false);
      }
    }

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter projects by category
  const filteredProjects = projects.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  // Initialize Map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isSubscribed = true;

    import('leaflet').then((L) => {
      if (!isSubscribed || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Default center: Malang Raya area
      const map = L.map(mapContainerRef.current, {
        center: [-7.95, 112.63],
        zoom: 10,
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Esri World Street Map (Clean architectural road map, high-res, no watermark)
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 18,
        }
      ).addTo(map);

      mapInstanceRef.current = map;
      renderMarkers(L, map, filteredProjects);
    });

    return () => {
      isSubscribed = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when filteredProjects changes
  useEffect(() => {
    if (typeof window === 'undefined' || !mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      if (!mapInstanceRef.current) return;
      renderMarkers(L, mapInstanceRef.current, filteredProjects);
    });
  }, [filteredProjects, selectedCategory]);

  const renderMarkers = (L: any, map: LeafletMap, projectList: LiveProject[]) => {
    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (projectList.length === 0) return;

    const bounds = L.latLngBounds([]);

    projectList.forEach((proj) => {
      const latLng: [number, number] = [proj.lat, proj.lng];
      bounds.extend(latLng);

      // Minimalist Elegant Architectural Pin (clean, no pulsing radar)
      const markerHtml = `
        <div class="live-project-pin-container">
          <div class="live-project-pin-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 21h18"/>
              <path d="M5 21V7l8-4v18"/>
              <path d="M19 21V11l-6-4"/>
              <path d="M9 9v.01"/>
              <path d="M9 12v.01"/>
              <path d="M9 15v.01"/>
              <path d="M9 18v.01"/>
            </svg>
            <span class="live-project-pin-pct">${proj.progress}%</span>
          </div>
          <div class="live-project-pin-stem"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'live-project-marker-wrapper',
        iconSize: [64, 40],
        iconAnchor: [32, 38],
        popupAnchor: [0, -38],
      });

      const marker = L.marker(latLng, { icon: customIcon }).addTo(map);

      // Safe consultation message without leaking exact homeowner address
      const waText = encodeURIComponent(
        `Halo Tim Bina Project, saya melihat info proyek "${proj.title}" di daerah ${proj.area_name} pada peta proyek berjalan. Saya ingin konsultasi pengerjaan serupa untuk rencana bangunan saya.`
      );
      const waUrl = `https://wa.me/6281335335304?text=${waText}`;

      // Minimalist architectural popup card
      const popupHtml = `
        <div class="live-project-popup-card">
          ${
            proj.image_url
              ? `<div class="live-project-popup-thumb" style="background-image: url('${proj.image_url}')">
                  <span class="live-project-popup-category">${proj.category}</span>
                </div>`
              : `<div class="live-project-popup-category-bar"><span class="live-project-popup-category">${proj.category}</span></div>`
          }
          <div class="live-project-popup-body">
            <h4 class="live-project-popup-title">${proj.title}</h4>
            <div class="live-project-popup-area">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>
              <span>${proj.area_name}</span>
            </div>

            <div class="live-project-progress-wrap">
              <div class="live-project-progress-header">
                <span class="live-project-stage-label">Tahap Pekerjaan:</span>
                <span class="live-project-progress-num">${proj.progress}%</span>
              </div>
              <p class="live-project-stage-desc">${proj.stage}</p>
              <div class="live-project-progress-track">
                <div class="live-project-progress-fill" style="width: ${proj.progress}%;"></div>
              </div>
            </div>

            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="live-project-wa-cta">
              <span>Tanya Proyek Serupa</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2Z"/></svg>
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        className: 'live-project-custom-popup',
        maxWidth: 290,
        minWidth: 260,
      });

      markersRef.current.push(marker);
    });

    if (projectList.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }
  };

  const categories = [
    { id: 'all', label: 'Semua Proyek' },
    { id: 'konstruksi', label: 'Konstruksi Baru' },
    { id: 'renovasi', label: 'Renovasi' },
    { id: 'interior', label: 'Interior' },
  ];

  return (
    <div className="live-projects-map-wrapper">
      {/* Top Floating Control Bar */}
      <div className="live-projects-hud-bar">
        <div className="live-projects-hud-info">
          <div className="live-indicator-pill">
            <span className="live-pulse-dot"></span>
            <span className="live-indicator-title">LIVE ON-GOING PROJECTS</span>
          </div>
          <p className="live-projects-count-desc">
            {isLoading
              ? 'Memuat data proyek...'
              : `${filteredProjects.length} Titik Proyek Aktif Sedang Berjalan`}
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="live-projects-category-filters">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`live-cat-filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map Element */}
      <div ref={mapContainerRef} className="live-projects-map-canvas" />

      {/* Privacy Notice Footer */}
      <div className="live-projects-privacy-note">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <span>Titik peta merepresentasikan perkiraan kawasan proyek demi menjaga privasi & kenyamanan pemilik hunian.</span>
      </div>

      <style>{`
        .live-projects-map-wrapper {
          position: relative;
          width: 100%;
          border-radius: 1.25rem;
          overflow: hidden;
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04);
          background: #f8fafc;
        }

        .live-projects-hud-bar {
          position: absolute;
          top: 1rem;
          left: 1rem;
          right: 1rem;
          z-index: 1000;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.875rem 1.25rem;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 1rem;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
        }

        .live-projects-hud-info {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .live-indicator-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }

        .live-pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #E67E22;
          box-shadow: 0 0 0 2px rgba(230, 126, 34, 0.25);
        }

        .live-indicator-title {
          font-size: 0.6875rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #B45309;
        }

        .live-projects-count-desc {
          margin: 0;
          font-size: 0.875rem;
          font-weight: 700;
          color: #0F172A;
        }

        .live-projects-category-filters {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          flex-wrap: wrap;
        }

        .live-cat-filter-btn {
          border: none;
          background: #F1F5F9;
          color: #475569;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.4rem 0.75rem;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .live-cat-filter-btn:hover {
          background: #E2E8F0;
          color: #0F172A;
        }

        .live-cat-filter-btn.active {
          background: #0F172A;
          color: #FFFFFF;
          box-shadow: 0 4px 10px rgba(15, 23, 42, 0.15);
        }

        .live-projects-map-canvas {
          width: 100%;
          height: 540px;
          z-index: 1;
        }

        .live-projects-privacy-note {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.875rem;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          border-radius: 0.75rem;
          font-size: 0.6875rem;
          color: #64748B;
          border: 1px solid rgba(226, 232, 240, 0.8);
          max-width: 440px;
          line-height: 1.35;
        }

        /* Marker Pin Styling */
        .live-project-marker-wrapper {
          background: transparent;
          border: none;
        }

        .live-project-pin-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .live-project-pin-container:hover {
          transform: translateY(-4px) scale(1.06);
        }

        .live-project-pin-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.3rem 0.55rem;
          background: #0F172A;
          color: #FFFFFF;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          border: 2px solid #E67E22;
          box-shadow: 0 6px 14px rgba(15, 23, 42, 0.25);
        }

        .live-project-pin-pct {
          color: #FBBF24;
        }

        .live-project-pin-stem {
          width: 2px;
          height: 8px;
          background: #E67E22;
          border-radius: 1px;
        }

        /* Popup Card Styling */
        .live-project-custom-popup .leaflet-popup-content-wrapper {
          padding: 0;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 20px 30px -10px rgba(15, 23, 42, 0.2);
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .live-project-custom-popup .leaflet-popup-content {
          margin: 0;
          line-height: 1.4;
        }

        .live-project-popup-card {
          font-family: inherit;
        }

        .live-project-popup-thumb {
          height: 110px;
          background-size: cover;
          background-position: center;
          position: relative;
          padding: 0.6rem;
        }

        .live-project-popup-category-bar {
          padding: 0.75rem 0.875rem 0.25rem;
        }

        .live-project-popup-category {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.2rem 0.55rem;
          border-radius: 9999px;
          background: #E67E22;
          color: #FFFFFF;
        }

        .live-project-popup-body {
          padding: 0.875rem;
        }

        .live-project-popup-title {
          font-size: 0.9375rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 0.35rem;
          line-height: 1.3;
        }

        .live-project-popup-area {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748B;
          margin-bottom: 0.75rem;
        }

        .live-project-progress-wrap {
          background: #F8FAFC;
          border-radius: 0.625rem;
          padding: 0.6rem 0.75rem;
          border: 1px solid #E2E8F0;
          margin-bottom: 0.75rem;
        }

        .live-project-progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.2rem;
        }

        .live-project-stage-label {
          font-size: 0.6875rem;
          color: #64748B;
          font-weight: 600;
        }

        .live-project-progress-num {
          font-size: 0.8125rem;
          font-weight: 800;
          color: #D97706;
        }

        .live-project-stage-desc {
          font-size: 0.75rem;
          font-weight: 600;
          color: #1E293B;
          margin: 0 0 0.45rem;
        }

        .live-project-progress-track {
          height: 6px;
          width: 100%;
          background: #E2E8F0;
          border-radius: 9999px;
          overflow: hidden;
        }

        .live-project-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #F59E0B, #E67E22);
          border-radius: 9999px;
          transition: width 0.5s ease;
        }

        .live-project-wa-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          width: 100%;
          padding: 0.55rem;
          background: #0F172A;
          color: #FFFFFF;
          font-size: 0.75rem;
          font-weight: 700;
          border-radius: 0.5rem;
          text-decoration: none;
          transition: background 0.15s ease;
        }

        .live-project-wa-cta:hover {
          background: #1E293B;
          color: #FBBF24;
        }

        @media (max-width: 640px) {
          .live-projects-hud-bar {
            position: static;
            border-radius: 0;
            border-left: none;
            border-right: none;
            border-top: none;
          }
          .live-projects-map-canvas {
            height: 420px;
          }
          .live-projects-privacy-note {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
