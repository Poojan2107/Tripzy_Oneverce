"use client";
import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import type { Map as LeafletMap, LayerGroup, Marker as LeafletMarker } from 'leaflet';

export interface MapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  sectionType: string;
}

export interface MapViewHandle {
  highlightMarker: (sectionType: string) => void;
}

const SECTION_COLORS: Record<string, string> = {
  hotels: '#D4A574',
  food: '#E86A6A',
  experiences: '#A78BFA',
  hidden_gems: '#5BB8A0',
  transport: '#6B9DD4',
  photography: '#F5A623',
  overview: '#6BCB77',
  timeline: '#4DC9B8',
  budget: '#D4A574',
  packing: '#A0AEC0',
  weather: '#63B3ED',
  tips: '#B794F4',
  etiquette: '#F687B3',
  avoid: '#FC8181',
  emergency: '#F56565',
  festivals: '#F6AD55',
  nearby: '#68D391',
};

function getColor(type: string): string {
  return SECTION_COLORS[type] || '#94A3B8';
}

export const MapView = forwardRef<MapViewHandle, {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  onPinClick?: (sectionType: string) => void;
}>(({ markers, center, zoom = 7, onPinClick }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersLayerRef = useRef<LayerGroup | null>(null);
  const markerMapRef = useRef<Map<string, LeafletMarker>>(new Map());
  const [ready, setReady] = useState(false);

  useImperativeHandle(ref, () => ({
    highlightMarker(sectionType: string) {
      const marker = markerMapRef.current.get(sectionType);
      if (marker) {
        marker.setZIndexOffset(1000);
        marker.openPopup();
        setTimeout(() => marker.setZIndexOffset(0), 1500);
      }
    },
  }));

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let mounted = true;

    (async () => {
      const L = await import('leaflet');
      await import('leaflet/dist/leaflet.css');

      if (!mounted || !containerRef.current) return;

      const defaultCenter: [number, number] = [20.5937, 78.9629];
      const map = L.map(containerRef.current, {
        center: center || defaultCenter,
        zoom,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
      setReady(true);
    })();

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersLayerRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!ready || !mapRef.current || !markersLayerRef.current) return;

    (async () => {
      const L = await import('leaflet');
      const map = mapRef.current!;
      const layer = markersLayerRef.current!;

      layer.clearLayers();
      markerMapRef.current.clear();

      if (markers.length === 0) return;

      markers.forEach((mk) => {
        const color = getColor(mk.sectionType);
        const icon = L.divIcon({
          className: '',
          html: `<div style="width:16px;height:16px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);cursor:pointer;"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
          popupAnchor: [0, -12],
        });

        const marker = L.marker([mk.lat, mk.lng], { icon }).addTo(layer);

        marker.bindPopup(`
          <div style="font-family:system-ui,sans-serif;font-size:13px;line-height:1.4;min-width:120px;">
            <div style="font-weight:600;color:#1A1A2E;margin-bottom:2px;">${mk.name}</div>
            <div style="font-size:11px;color:#94A3B8;text-transform:uppercase;letter-spacing:0.5px;">${mk.sectionType}</div>
          </div>
        `, { closeButton: false });

        marker.on('click', () => {
          onPinClick?.(mk.sectionType);
        });

        markerMapRef.current.set(mk.sectionType, marker);
      });

      if (markers.length > 1) {
        const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
      } else if (markers.length === 1) {
        map.setView([markers[0].lat, markers[0].lng], zoom);
      }
    })();
  }, [markers, onPinClick, zoom, ready]);

  if (markers.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="w-full h-[240px] rounded-xl overflow-hidden border border-border/30"
      style={{ zIndex: 0 }}
    />
  );
});

MapView.displayName = 'MapView';
