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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !mapContainerRef.current) return;

    const mappedDays = itinerary.filter((day: any) => day.latitude && day.longitude);
    if (mappedDays.length === 0) return;

    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    const firstDay = mappedDays[0];
    const map = L.map(mapContainerRef.current, {
      center: [firstDay.latitude, firstDay.longitude],
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    mapInstanceRef.current = map;

    // Light map tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    const latlngs: L.LatLngExpression[] = [];

    mappedDays.forEach((day: any, index: number) => {
      const lat = day.latitude;
      const lng = day.longitude;
      latlngs.push([lat, lng]);

      const isActive = index === activeDay;
      const dayMarkerIcon = L.divIcon({
        className: 'itinerary-day-marker',
        html: `
          <div class="relative flex items-center justify-center w-6 h-6 rounded-full ${
            isActive ? 'bg-ocean text-white' : 'bg-white text-deep-navy border border-ocean/30'
          } font-bold text-[10px] shadow-md">
            ${index + 1}
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([lat, lng], { icon: dayMarkerIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; color: #1F2937; padding: 4px;">
          <strong style="font-size: 12px; display: block; margin-bottom: 2px;">Day ${index + 1}: ${day.title}</strong>
          <span style="color: #6B7280; font-size: 10px;">${day.activities?.[0] || 'Activities scheduled'}</span>
        </div>
      `, { closeButton: false });
    });

    if (latlngs.length > 1) {
      const routeLine = L.polyline(latlngs, {
        color: '#6FB6FF',
        weight: 3,
        dashArray: '6, 8',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);
      map.fitBounds(routeLine.getBounds(), { padding: [40, 40] });
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [itinerary, activeDay, mounted]);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-cream/40 animate-pulse flex flex-col items-center justify-center border border-warm-gray/30">
        <span className="text-[10px] font-bold text-muted tracking-widest uppercase">Plotting Route Map...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      <div className="absolute top-3 left-3 z-10 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-warm-gray/30 shadow-card pointer-events-none text-[9px] font-medium text-charcoal/60">
        ROUTE MAP
      </div>
    </div>
  );
}
