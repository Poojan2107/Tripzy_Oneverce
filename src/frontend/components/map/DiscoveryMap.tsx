"use client";
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Tour } from '../../types';
import { getAtmosphere } from '../../utils/atmosphere';
import { formatINR } from '../../utils/currency';

interface DiscoveryMapProps {
  tours: Tour[];
  activeTourId: string | null;
  onActiveTourChange: (id: string | null) => void;
  onSelectTour: (tour: Tour | null) => void;
}

const createIcon = (isActive: boolean) => {
  return L.divIcon({
    className: 'custom-map-marker-crosshair',
    html: `
      <div class="relative flex items-center justify-center" style="transform: translate(-50%, -50%);">
        <!-- Outer wireframe pulse -->
        <div class="absolute w-8 h-8 rounded-full border border-saffron/40 flex items-center justify-center ${isActive ? 'animate-ping scale-110 opacity-75' : 'opacity-0'}"></div>
        
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" class="transition-all duration-500 ${isActive ? 'scale-125' : 'hover:scale-110'}">
          <!-- Crosshair axes -->
          <line x1="16" y1="2" x2="16" y2="30" stroke="${isActive ? '#E07B39' : '#D6A85F'}" stroke-width="0.8" stroke-dasharray="${isActive ? 'none' : '2,2'}" />
          <line x1="2" y1="16" x2="30" y2="16" stroke="${isActive ? '#E07B39' : '#D6A85F'}" stroke-width="0.8" stroke-dasharray="${isActive ? 'none' : '2,2'}" />
          
          <!-- Outer wireframe circle -->
          <circle cx="16" cy="16" r="8" stroke="${isActive ? '#E07B39' : '#D6A85F'}" stroke-width="1" fill="${isActive ? 'rgba(224, 123, 57, 0.12)' : 'rgba(214, 168, 95, 0.03)'}" />
          
          <!-- Inner target ring -->
          <circle cx="16" cy="16" r="4" stroke="${isActive ? '#E07B39' : '#D6A85F'}" stroke-width="1.2" />
          
          <!-- Central coordinate dot -->
          <circle cx="16" cy="16" r="1.5" fill="${isActive ? '#E07B39' : '#D6A85F'}" />
        </svg>
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
  
  const [mounted, setMounted] = useState(false);
  const [circuitsVisible, setCircuitsVisible] = useState(true);
  const [activeScreenPos, setActiveScreenPos] = useState<{ x: number; y: number } | null>(null);

  const activeTour = tours.find(t => t.id === activeTourId);

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

    // Center map on India by default
    const map = L.map(mapContainerRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      zoomControl: true,
      attributionControl: true,
    });

    mapInstanceRef.current = map;

    // Light map tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Create marker group layer
    const markerGroup = L.featureGroup().addTo(map);
    markerGroupRef.current = markerGroup;

    // ── CIRCUIT ROUTE LINES (Editorial Cartography) ──
    const circuitGroup = L.featureGroup().addTo(map);
    circuitGroupRef.current = circuitGroup;

    const circuits = [
      {
        name: 'Sacred Circuit',
        color: '#E07B39',
        coords: [[25.3176, 82.9739], [15.3350, 76.4600], [25.2800, 91.7200]] as [number, number][],
      },
      {
        name: 'Royal Circuit',
        color: '#D6A85F',
        coords: [[26.9157, 70.9083], [24.5854, 73.7125], [34.0837, 74.7973]] as [number, number][],
      },
      {
        name: 'South India Circuit',
        color: '#00B0FF',
        coords: [[15.4909, 73.8278], [9.4981, 76.3388], [10.0889, 77.0595], [15.3350, 76.4600], [11.7401, 92.6586]] as [number, number][],
      },
    ];

    circuits.forEach((circuit) => {
      L.polyline(circuit.coords, {
        color: circuit.color,
        weight: 1.5,
        opacity: 0.35,
        dashArray: '6, 8',
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(circuitGroup);
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
        icon: createIcon(tour.id === activeTourId) 
      }).addTo(markerGroup);

      marker.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; min-width: 160px; text-align: left; background-color: #F8F5EE; padding: 2px;">
          <img src="${tour.bannerImage}" alt="${tour.title}" style="width: 100%; height: 90px; object-fit: cover; border-radius: 8px; margin-bottom: 6px;" />
          <h5 style="font-family: 'Instrument Serif', serif; font-size: 15px; font-weight: 500; color: #0F172A; margin: 0 0 2px 0; font-style: italic; lowercase;">${tour.title.toLowerCase()}</h5>
          <p style="color: #334155; font-size: 9px; margin: 0 0 6px 0;">📍 ${tour.location.split(',')[0]}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #ECE6DA; padding-top: 5px; margin-top: 5px;">
            <span style="font-weight: 700; font-size: 11px; color: #0F172A;">{formatINR(tour.price)}</span>
            <button id="popup-btn-${tour.id}" style="background-color: #0F172A; color: #fff; border: none; font-size: 8px; font-weight: 600; padding: 3px 8px; border-radius: 4px; cursor: pointer;">Inspect</button>
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
  }, [tours, mapInstanceRef.current]);

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
        markersRef.current[prev].setIcon(createIcon(false));
      }
      if (markersRef.current[activeTourId]) {
        markersRef.current[activeTourId].setIcon(createIcon(true));
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

  // 4. Track marker position for radial background wash overlay
  useEffect(() => {
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
  }, [activeTourId]);

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
      <div className="w-full h-full rounded-[24px] bg-cream/40 animate-pulse flex flex-col items-center justify-center border border-cream">
        <span className="text-[10px] font-bold text-muted tracking-widest uppercase">Initializing Living Atlas...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Map Container */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full z-0" 
        style={{
          filter: 'sepia(0.20) contrast(0.96) saturate(0.85) hue-rotate(4deg)'
        }}
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

      <div className="absolute bottom-4 left-4 z-10 flex gap-2">
        <div className="bg-white/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-cream shadow-sm pointer-events-none text-[9px] text-muted/60 font-mono uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-saffron inline-block animate-pulse"></span>
          <span>Living Atlas Cartography</span>
        </div>
        <button
          onClick={() => setCircuitsVisible(v => !v)}
          className={`px-3 py-2 rounded-2xl border text-[9px] font-mono uppercase tracking-widest transition-all cursor-pointer shadow-sm ${
            circuitsVisible
              ? 'bg-white/90 border-gold/40 text-gold'
              : 'bg-white/50 border-cream text-muted/40'
          }`}
        >
          {circuitsVisible ? 'Routes On' : 'Routes Off'}
        </button>
      </div>
    </div>
  );
}
