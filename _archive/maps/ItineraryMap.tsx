"use client";
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface ItineraryMapProps {
  days: any[];
  activeDay?: number;
}

export default function ItineraryMap({ days = [], activeDay = 0 }: ItineraryMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [mounted, setMounted] = useState(false);

  const itinerary = days;

  const markerGroupRef = useRef<L.FeatureGroup | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 1. Initialize Map ONCE on mount
  useEffect(() => {
    if (!mounted || !mapContainerRef.current || mapInstanceRef.current) return;

    // Reset default Leaflet icon urls
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    const map = L.map(mapContainerRef.current, {
      center: [20.5937, 78.9629],
      zoom: 10,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    mapInstanceRef.current = map;

    // CartoDB Voyager map tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    markerGroupRef.current = L.featureGroup().addTo(map);
  }, [mounted]);

  // 2. Add / update markers and route line when itinerary or activeDay changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markerGroup = markerGroupRef.current;
    if (!map || !markerGroup) return;

    markerGroup.clearLayers();
    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }

    const mappedDays = itinerary.filter((day: any) => 
      day && 
      day.latitude != null && 
      day.longitude != null && 
      !isNaN(parseFloat(day.latitude)) && 
      !isNaN(parseFloat(day.longitude))
    );
    if (mappedDays.length === 0) return;

    const latlngs: L.LatLngExpression[] = [];

    mappedDays.forEach((day: any, index: number) => {
      const lat = parseFloat(day.latitude);
      const lng = parseFloat(day.longitude);
      latlngs.push([lat, lng]);

      const isActive = index === activeDay;
      const dayMarkerIcon = L.divIcon({
        className: 'itinerary-day-marker',
        html: `
          <div class="relative flex items-center justify-center w-6 h-6 rounded-full ${
            isActive ? 'bg-teal text-white shadow-[0_0_8px_rgba(24,182,201,0.5)]' : 'bg-white text-night border border-border'
          } font-bold text-micro shadow-sm">
            ${index + 1}
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([lat, lng], { icon: dayMarkerIcon }).addTo(markerGroup);
      marker.bindPopup(`
        <div style="font-family: var(--font-sans), sans-serif; font-size: 11px; color: var(--color-night, #0E1B26); padding: 4px;">
          <strong style="font-size: 12px; display: block; margin-bottom: 2px;">Day ${index + 1}: ${day.title}</strong>
          <span style="color: var(--color-muted, #64748B); font-size: 10px;">${day.activities?.[0] || 'Activities scheduled'}</span>
        </div>
      `, { closeButton: false });
    });

    if (latlngs.length > 1) {
      const routeLine = L.polyline(latlngs, {
        color: '#18B6C9',
        weight: 2,
        dashArray: '6, 8',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);
      routeLineRef.current = routeLine;
      map.fitBounds(routeLine.getBounds(), { padding: [40, 40] });
    } else if (latlngs.length === 1) {
      map.setView(latlngs[0], 12);
    }
  }, [itinerary, activeDay, mounted]);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-background animate-pulse flex flex-col items-center justify-center border border-border">
        <span className="text-micro font-bold text-muted/40 tracking-widest uppercase">Plotting Route Map...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border shadow-card pointer-events-none text-micro font-medium text-muted">
        ROUTE MAP
      </div>
    </div>
  );
}
