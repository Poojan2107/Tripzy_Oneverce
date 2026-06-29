"use client";
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Tour } from '../../types';
import { TOURS_DATA } from '../../data';

interface PassportMapProps {
  wishlistTours: Tour[];
  savedItineraries: any[];
  allTours: Tour[];
  onTourSelect?: (tour: Tour) => void;
}

export default function PassportMap({
  wishlistTours = [],
  savedItineraries = [],
  allTours = [],
  onTourSelect
}: PassportMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [mounted, setMounted] = useState(false);

  // Set mounted flag and clean up map on unmount
  useEffect(() => {
    setMounted(true);
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const mapData = (() => {
    const list = new Map<string, { id: string; title: string; bannerImage: string; location: string; lat: number; lng: number; tour: Tour }>();
    
    wishlistTours.forEach(tour => {
      if (tour.latitude && tour.longitude) {
        list.set(tour.id, {
          id: tour.id,
          title: tour.title,
          bannerImage: tour.bannerImage,
          location: tour.location,
          lat: tour.latitude,
          lng: tour.longitude,
          tour
        });
      }
    });

    savedItineraries.forEach(itin => {
      const tour = allTours.find(t => t.id === itin.destination || t.dbId === itin.destination) || TOURS_DATA.find(t => t.id === itin.destination);
      if (tour && tour.latitude && tour.longitude) {
        list.set(tour.id, {
          id: tour.id,
          title: tour.title,
          bannerImage: tour.bannerImage,
          location: tour.location,
          lat: tour.latitude,
          lng: tour.longitude,
          tour
        });
      }
    });

    return Array.from(list.values());
  })();

  useEffect(() => {
    if (!mounted || !mapContainerRef.current) return;

    // Reset default Leaflet icon urls
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    // Center map on India
    const map = L.map(mapContainerRef.current, {
      center: [20.5937, 78.9629],
      zoom: 4.5,
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

    const markerGroup = L.featureGroup().addTo(map);
    const bounds: [number, number][] = [];

    mapData.forEach((item) => {
      bounds.push([item.lat, item.lng]);

      const customIcon = L.divIcon({
        className: 'glowing-marker-gold',
        html: `
          <div class="relative flex items-center justify-center" style="width: 24px; height: 24px;">
            <div class="absolute inset-0 rounded-full bg-[#F4B63D] opacity-35 animate-ping"></div>
            <div class="w-3.5 h-3.5 rounded-full bg-[#F4B63D] border border-white shadow-sm z-10"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([item.lat, item.lng], { icon: customIcon }).addTo(markerGroup);
      
      marker.bindPopup(`
        <div style="font-family: var(--font-sans), sans-serif; font-size: 11px; min-width: 140px; text-align: left; padding: 2px; color: #0E1B26;">
          <img src="${item.bannerImage}" alt="${item.title}" style="width: 100%; height: 75px; object-fit: cover; border-radius: 12px; margin-bottom: 6px; border: 1px solid #E7DED3;" />
          <h5 style="font-family: var(--font-sans), sans-serif; font-size: 14px; font-weight: 700; color: #0E1B26; margin: 0 0 2px 0; text-transform: lowercase;">${item.title}</h5>
          <p style="color: #64748B; font-size: 8px; margin: 0 0 6px 0; font-family: monospace;">📍 ${item.location}</p>
          <button id="passport-inspect-btn-${item.id}" style="width: 100%; background: #0E1B26; color: #FFFDF9; border: none; font-size: 8.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 5px 0; border-radius: 8px; cursor: pointer; transition: all 0.2s;">Inspect Chapter</button>
        </div>
      `, { closeButton: false });

      // Handle inspect button inside popup
      marker.on('popupopen', () => {
        const btn = document.getElementById(`passport-inspect-btn-${item.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onTourSelect) {
              onTourSelect(item.tour);
            }
          };
        }
      });
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [30, 30] });
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [mounted, mapData]);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-background animate-pulse flex flex-col items-center justify-center border border-border rounded-2xl">
        <span className="text-[10px] font-bold text-muted/40 tracking-widest uppercase">Opening passport map...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-border">
      <div ref={mapContainerRef} className="w-full h-full z-0" style={{ minHeight: '300px' }} />
      <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border shadow-card pointer-events-none text-[8px] font-bold text-night tracking-wider uppercase">
        Explorer Footprints
      </div>
    </div>
  );
}
