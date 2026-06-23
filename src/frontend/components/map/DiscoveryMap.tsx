"use client";
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Tour } from '../../types';
import { formatINR } from '../../utils/currency';

const TOUR_TO_CIRCUIT: Record<string, string> = {
  'varanasi-spiritual': 'Sacred Circuit',
  'hampi-ruins': 'Sacred Circuit',
  'cherrapunji-roots': 'Sacred Circuit',
  'jaisalmer-fort': 'Royal Circuit',
  'udaipur-mewar': 'Royal Circuit',
  'kashmir-meadows': 'Royal Circuit',
  'goa-beach': 'South India Circuit',
  'kerala-houseboats': 'South India Circuit',
  'munnar-tea': 'South India Circuit',
  'andaman-reefs': 'South India Circuit',
};

interface DiscoveryMapProps {
  tours: Tour[];
  activeTourId: string | null;
  onActiveTourChange: (id: string | null) => void;
  onSelectTour: (tour: Tour | null) => void;
}

const createIcon = (tour: Tour, isActive: boolean, simple: boolean) => {
  let count = '10';
  const id = tour.id.toLowerCase();
  if (id.includes('kashmir')) count = '12';
  else if (id.includes('jaisalmer') || id.includes('udaipur')) count = '18';
  else if (id.includes('varanasi')) count = '14';
  else if (id.includes('kerala') || id.includes('munnar')) count = '16';
  else if (id.includes('andaman')) count = '08';
  else if (id.includes('ladakh')) count = '12';
  else if (id.includes('cherrapunji')) count = '11';
  else if (id.includes('hampi')) count = '09';
  else if (id.includes('goa')) count = '08';
  else if (id.includes('kutch')) count = '10';

  return L.divIcon({
    className: `glowing-marker-cyan ${isActive ? 'active' : ''}`,
    html: `
      <div class="relative flex items-center justify-center select-none" style="width: 32px; height: 32px;">
        <span class="text-[10px] font-bold font-sans">${count}</span>
        <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-navy text-white font-mono text-[7px] uppercase tracking-wider whitespace-nowrap border border-white/10">
          ${tour.title.toLowerCase().slice(0, 10)}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

export default function DiscoveryMap({
  tours = [],
  activeTourId,
  onActiveTourChange,
  onSelectTour
}: DiscoveryMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const markerGroupRef = useRef<L.FeatureGroup | null>(null);
  const circuitGroupRef = useRef<L.FeatureGroup | null>(null);
  const polylinesRef = useRef<{ [name: string]: L.Polyline }>({});
  
  const [mounted, setMounted] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const [circuitsVisible, setCircuitsVisible] = useState(!isMobile);
  const [activeScreenPos, setActiveScreenPos] = useState<{ x: number; y: number } | null>(null);
  const [showTapHint, setShowTapHint] = useState(true);

  const activeTour = tours.find(t => t.id === activeTourId);

  // Auto-dismiss tap hint after 3.5s
  useEffect(() => {
    if (!showTapHint) return;
    if (activeTourId || tours.length === 0) {
      setShowTapHint(false);
      return;
    }
    const t = setTimeout(() => setShowTapHint(false), 3500);
    return () => clearTimeout(t);
  }, [showTapHint, activeTourId, tours.length]);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 1. Initialize Map once on mount
  useEffect(() => {
    if (!mounted || !mapContainerRef.current || mapInstanceRef.current) return;

    // Set up Leaflet icon fallbacks
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    const isMobile = mapContainerRef.current.clientWidth < 768;

    // Center map on India by default
    const map = L.map(mapContainerRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      zoomControl: false,
      attributionControl: true,
    });

    mapInstanceRef.current = map;

    // Add zoom control to bottom-right for thumb reach on mobile
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Dark map tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Create marker group layer
    const markerGroup = L.featureGroup().addTo(map);
    markerGroupRef.current = markerGroup;

    // ── CIRCUIT ROUTE LINES (V2 Vibrant Colors) ──
    const circuitGroup = L.featureGroup().addTo(map);
    circuitGroupRef.current = circuitGroup;

    const circuits = [
      {
        name: 'Sacred Circuit',
        color: '#E6355A',
        coords: [[25.3176, 82.9739], [15.3350, 76.4600], [25.2800, 91.7200]] as [number, number][],
      },
      {
        name: 'Royal Circuit',
        color: '#FDB62F',
        coords: [[26.9157, 70.9083], [24.5854, 73.7125], [34.0837, 74.7973]] as [number, number][],
      },
      {
        name: 'South India Circuit',
        color: '#148596',
        coords: [[15.4909, 73.8278], [9.4981, 76.3388], [10.0889, 77.0595], [15.3350, 76.4600], [11.7401, 92.6586]] as [number, number][],
      },
    ];

    circuits.forEach((circuit) => {
      const pl = L.polyline(circuit.coords, {
        color: circuit.color,
        weight: isMobile ? 1 : 1.5,
        opacity: isMobile ? 0.15 : 0.35,
        dashArray: '6, 8',
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(circuitGroup);
      polylinesRef.current[circuit.name] = pl;
    });
  }, [mounted]);

  // 2. Add / update markers when tours list updates
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markerGroup = markerGroupRef.current;
    if (!map || !markerGroup || tours.length === 0) return;

    // Clear old markers
    markerGroup.clearLayers();
    const tempMarkers: { [key: string]: L.Marker } = {};

    tours.forEach((tour) => {
      const lat = tour.latitude;
      const lng = tour.longitude;
      if (!lat || !lng) return;

      const marker = L.marker([lat, lng], { 
        icon: createIcon(tour, tour.id === activeTourId, isMobile) 
      }).addTo(markerGroup);

      marker.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; min-width: 170px; text-align: left; background-color: transparent; padding: 2px; color: #fff;">
          <img src="${tour.bannerImage}" alt="${tour.title}" style="width: 100%; height: 90px; object-fit: cover; border-radius: 12px; margin-bottom: 8px; border: 1px solid rgba(255,255,255,0.05);" />
          <h5 style="font-family: 'Instrument Serif', serif; font-size: 16px; font-weight: 400; color: #fff; margin: 0 0 2px 0;">${tour.title.toLowerCase()}</h5>
          <p style="color: #8FA0AB; font-size: 9px; margin: 0 0 8px 0; font-family: monospace;">📍 ${tour.location.split(',')[0].toUpperCase()}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 8px; margin-top: 5px;">
            <span style="font-weight: 700; font-size: 12px; color: #FDB62F;">${formatINR(tour.price)}</span>
            <button id="popup-btn-${tour.id}" style="background: linear-gradient(135deg, #148596 0%, #286F98 100%); color: #fff; border: none; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 7px 12px; border-radius: 8px; cursor: pointer; min-width: 70px; box-shadow: 0 2px 6px rgba(20, 133, 150, 0.2); transition: all 0.2s;">Inspect</button>
          </div>
        </div>
      `, {
        closeButton: false,
        maxWidth: 220
      });

      tempMarkers[tour.id] = marker;

      marker.on('click', () => {
        onActiveTourChange(tour.id);
      });

      marker.on('popupopen', () => {
        const button = document.getElementById(`popup-btn-${tour.id}`);
        if (button) {
          button.onclick = () => {
            onSelectTour(tour);
          };
        }
      });
    });

    markersRef.current = tempMarkers;
  }, [tours, mapInstanceRef.current, isMobile]);

  // 3. Pan/Zoom to active marker when selected
  const prevActiveRef = useRef<string | null>(null);
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !activeTourId) {
      setActiveScreenPos(null);
      return;
    }

    // Only update icons for old and new active markers, not all
    if (prevActiveRef.current !== activeTourId) {
      const prev = prevActiveRef.current;
      if (prev && markersRef.current[prev]) {
        const prevTour = tours.find(t => t.id === prev);
        if (prevTour) {
          markersRef.current[prev].setIcon(createIcon(prevTour, false, isMobile));
        }
      }
      if (markersRef.current[activeTourId]) {
        const activeTourObj = tours.find(t => t.id === activeTourId);
        if (activeTourObj) {
          markersRef.current[activeTourId].setIcon(createIcon(activeTourObj, true, isMobile));
        }
      }
      prevActiveRef.current = activeTourId;
    }

    const activeMarker = markersRef.current[activeTourId];
    if (activeMarker) {
      const latLng = activeMarker.getLatLng();
      map.flyTo(latLng, 8, { animate: true, duration: 1.4 });
      
      const popupTimeout = setTimeout(() => {
        if (mapInstanceRef.current && markersRef.current[activeTourId]) {
          markersRef.current[activeTourId].openPopup();
        }
      }, 700);
      return () => clearTimeout(popupTimeout);
    }
  }, [activeTourId]);

  // 3.5. Dynamic polyline solid/glow highlights on active tour change
  useEffect(() => {
    Object.entries(polylinesRef.current).forEach(([name, polyline]) => {
      const isCircuitActive = activeTourId ? TOUR_TO_CIRCUIT[activeTourId] === name : false;
      if (isCircuitActive) {
        polyline.setStyle({
          weight: isMobile ? 3 : 4,
          opacity: 0.95,
          dashArray: undefined,
        });
      } else {
        polyline.setStyle({
          weight: isMobile ? 1 : 1.5,
          opacity: isMobile ? 0.15 : 0.35,
          dashArray: '6, 8',
        });
      }
    });
  }, [activeTourId, circuitsVisible, isMobile]);

  // 4. Track marker position for radial background wash overlay (desktop only)
  useEffect(() => {
    if (isMobile) return;
    const map = mapInstanceRef.current;
    if (!map || !activeTourId) {
      setActiveScreenPos(null);
      return;
    }

    const updatePosition = () => {
      const marker = markersRef.current[activeTourId];
      if (marker && mapInstanceRef.current) {
        const latLng = marker.getLatLng();
        const pt = mapInstanceRef.current.latLngToContainerPoint(latLng);
        setActiveScreenPos({ x: pt.x, y: pt.y });
      } else {
        setActiveScreenPos(null);
      }
    };

    updatePosition();

    map.on('move', updatePosition);
    map.on('zoom', updatePosition);
    map.on('viewreset', updatePosition);

    return () => {
      map.off('move', updatePosition);
      map.off('zoom', updatePosition);
      map.off('viewreset', updatePosition);
    };
  }, [activeTourId, isMobile]);

  // 5. Toggle circuit visibility
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !circuitGroupRef.current) return;
    if (circuitsVisible) {
      circuitGroupRef.current.addTo(map);
    } else {
      circuitGroupRef.current.remove();
    }
  }, [circuitsVisible]);

  if (!mounted) {
    return (
      <div className="w-full h-full rounded-[24px] bg-[#081A24] animate-pulse flex flex-col items-center justify-center border border-white/5">
        <span className="text-[10px] font-bold text-white/40 tracking-widest uppercase">Initializing Living Atlas...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Map Container */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full z-0 dark-map" 
      />
      
      {/* Dynamic regional radial wash color overlay */}
      {activeScreenPos && activeTour && (
        <div 
          className="absolute pointer-events-none z-10 transition-all duration-700"
          style={{
            left: activeScreenPos.x - 180,
            top: activeScreenPos.y - 180,
            width: 360,
            height: 360,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${activeTour.accents?.primary || '#E07B39'} 0%, transparent 100%)`,
            opacity: 0.12
          }}
        />
      )}

      {/* Mobile tap hint — auto-dismisses */}
      {showTapHint && !activeTour && isMobile && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 animate-pulse pointer-events-none">
          <div className="bg-night/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 shadow-lg">
            <span className="text-[9px] font-mono uppercase tracking-wider text-white/80">Tap a marker</span>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-wrap items-center gap-2 p-3 pb-[max(12px,env(safe-area-inset-bottom,8px))]">
        <div className="bg-[#0C2533]/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 shadow-sm pointer-events-none text-[9px] text-white/50 font-mono uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E6355A] inline-block animate-pulse"></span>
          <span>Living Atlas</span>
        </div>
        {!isMobile && (
          <button
            onClick={() => setCircuitsVisible(v => !v)}
            className={`px-3 py-2 rounded-2xl border text-[9px] font-mono uppercase tracking-widest transition-all cursor-pointer shadow-sm min-h-[44px] ${
              circuitsVisible
                ? 'bg-white/90 border-gold/40 text-gold'
                : 'bg-white/50 border-cream text-muted/40'
            }`}
          >
            {circuitsVisible ? 'Routes On' : 'Routes Off'}
          </button>
        )}
      </div>
    </div>
  );
}
