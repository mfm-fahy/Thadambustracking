'use client';

import { useEffect, useRef } from 'react';

interface Stop { lat: number; lng: number; name: string; }

export interface BusMarker {
  id: string;
  name: string;
  number: string;
  type: string;
  occupancy: string;
  eta: number;
  lat: number;
  lng: number;
  seats?: number;
  driver?: string;
}

interface VehicleMapProps {
  vehicleLat: number;
  vehicleLng: number;
  destinationLat?: number;
  destinationLng?: number;
  vehicleName?: string;
  stops?: Stop[];
  zoom?: number;
  userLat?: number;
  userLng?: number;
  userAccuracy?: number;
  followUser?: boolean;
  buses?: BusMarker[];
  selectedBusId?: string | null;
  onBusClick?: (bus: BusMarker) => void;
}

// Color per bus type
const TYPE_COLORS: Record<string, string> = {
  public:  '#3b82f6',
  private: '#a855f7',
  school:  '#f97316',
  college: '#6366f1',
  office:  '#14b8a6',
};

// Occupancy dot color
const OCC_COLORS: Record<string, string> = {
  empty:    '#22c55e',
  moderate: '#eab308',
  full:     '#ef4444',
};

function makeBusIcon(L: any, bus: BusMarker, isSelected: boolean) {
  const bg = TYPE_COLORS[bus.type] ?? '#64748b';
  const occ = OCC_COLORS[bus.occupancy] ?? '#94a3b8';
  const size = isSelected ? 48 : 40;
  const ring = isSelected ? `box-shadow:0 0 0 3px ${bg},0 0 0 5px white,0 4px 12px rgba(0,0,0,0.4);` : 'box-shadow:0 2px 8px rgba(0,0,0,0.3);';
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:${size}px;height:${size}px;">
        <div style="
          width:${size}px;height:${size}px;
          background:${bg};
          border-radius:12px;
          display:flex;align-items:center;justify-content:center;
          border:3px solid white;
          ${ring}
          font-size:${isSelected ? 24 : 20}px;
          transition:all 0.2s;
        ">🚌</div>
        <div style="
          position:absolute;bottom:-2px;right:-2px;
          width:12px;height:12px;
          background:${occ};
          border-radius:50%;
          border:2px solid white;
        "></div>
        <div style="
          position:absolute;top:-18px;left:50%;transform:translateX(-50%);
          background:rgba(0,0,0,0.75);
          color:white;
          font-size:9px;font-weight:700;
          padding:1px 5px;
          border-radius:4px;
          white-space:nowrap;
        ">${bus.number}</div>
      </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 10)],
  });
}

export function VehicleMap({
  vehicleLat,
  vehicleLng,
  destinationLat,
  destinationLng,
  vehicleName = 'Vehicle',
  stops = [],
  zoom = 14,
  userLat,
  userLng,
  userAccuracy,
  followUser = true,
  buses = [],
  selectedBusId = null,
  onBusClick,
}: VehicleMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const vehicleMarkerRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const userCircleRef = useRef<any>(null);
  // map of busId → leaflet marker
  const busMarkersRef = useRef<Map<string, any>>(new Map());

  // ── Init map once ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let destroyed = false;

    import('leaflet').then((L) => {
      if (destroyed || mapRef.current) return;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(containerRef.current!, { zoomControl: true }).setView(
        [vehicleLat, vehicleLng],
        zoom
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Destination marker
      if (destinationLat && destinationLng) {
        const destIcon = L.divIcon({
          className: '',
          html: `<div style="background:#22c55e;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:16px;">📍</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });
        L.marker([destinationLat, destinationLng], { icon: destIcon })
          .addTo(map)
          .bindPopup('<strong>Destination</strong>');
      }

      // Stop markers
      stops.forEach((stop, i) => {
        const stopIcon = L.divIcon({
          className: '',
          html: `<div style="background:#6366f1;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.25);color:white;font-size:11px;font-weight:700;">${i + 1}</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });
        L.marker([stop.lat, stop.lng], { icon: stopIcon })
          .addTo(map)
          .bindPopup(`<strong>Stop ${i + 1}</strong><br/>${stop.name}`);
      });

      mapRef.current = map;
    });

    return () => {
      destroyed = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        busMarkersRef.current.clear();
      }
    };
  }, []);

  // ── Sync all bus markers whenever buses list or selection changes ──────────
  useEffect(() => {
    if (!mapRef.current) return;

    import('leaflet').then((L) => {
      if (!mapRef.current) return;
      const map = mapRef.current;
      const existing = busMarkersRef.current;
      const incomingIds = new Set(buses.map((b) => b.id));

      // Remove markers for buses no longer in list
      existing.forEach((marker, id) => {
        if (!incomingIds.has(id)) {
          map.removeLayer(marker);
          existing.delete(id);
        }
      });

      // Add or update each bus
      buses.forEach((bus) => {
        const isSelected = bus.id === selectedBusId;
        const icon = makeBusIcon(L, bus, isSelected);
        const occLabel = bus.occupancy.charAt(0).toUpperCase() + bus.occupancy.slice(1);
        const popupHtml = `
          <div style="min-width:160px;font-family:sans-serif;">
            <div style="font-weight:700;font-size:13px;margin-bottom:4px;">${bus.name}</div>
            <div style="font-size:11px;color:#64748b;margin-bottom:6px;">${bus.number}</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px;">
              <span style="background:${TYPE_COLORS[bus.type] ?? '#64748b'}22;color:${TYPE_COLORS[bus.type] ?? '#64748b'};padding:2px 8px;border-radius:99px;font-size:10px;font-weight:600;text-transform:capitalize;">${bus.type}</span>
              <span style="background:${OCC_COLORS[bus.occupancy] ?? '#94a3b8'}22;color:${OCC_COLORS[bus.occupancy] ?? '#94a3b8'};padding:2px 8px;border-radius:99px;font-size:10px;font-weight:600;">${occLabel}</span>
            </div>
            <div style="font-size:12px;"><b style="color:#f97316;">${bus.eta} min</b> away${bus.seats != null ? ` · ${bus.seats} seats` : ''}${bus.driver ? `<br/>Driver: ${bus.driver}` : ''}</div>
          </div>`;

        if (existing.has(bus.id)) {
          const m = existing.get(bus.id)!;
          m.setLatLng([bus.lat, bus.lng]);
          m.setIcon(icon);
          m.getPopup()?.setContent(popupHtml);
        } else {
          const m = L.marker([bus.lat, bus.lng], { icon, zIndexOffset: isSelected ? 500 : 0 })
            .addTo(map)
            .bindPopup(popupHtml, { maxWidth: 220 });
          m.on('click', () => onBusClick?.(bus));
          existing.set(bus.id, m);
        }
      });
    });
  }, [buses, selectedBusId, onBusClick]);

  // ── Pan to selected bus ────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !selectedBusId) return;
    const marker = busMarkersRef.current.get(selectedBusId);
    if (marker) {
      mapRef.current.panTo(marker.getLatLng(), { animate: true, duration: 0.5 });
      marker.openPopup();
    }
  }, [selectedBusId]);

  // ── Update / create user GPS dot ──────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || userLat == null || userLng == null) return;

    import('leaflet').then((L) => {
      if (!mapRef.current) return;

      const userIcon = L.divIcon({
        className: '',
        html: `<div style="width:18px;height:18px;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 0 0 4px rgba(59,130,246,0.3);"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([userLat, userLng]);
      } else {
        userMarkerRef.current = L.marker([userLat, userLng], { icon: userIcon, zIndexOffset: 1000 })
          .addTo(mapRef.current)
          .bindPopup('<strong>You are here</strong>');
      }

      if (userAccuracy) {
        if (userCircleRef.current) {
          userCircleRef.current.setLatLng([userLat, userLng]);
          userCircleRef.current.setRadius(userAccuracy);
        } else {
          userCircleRef.current = L.circle([userLat, userLng], {
            radius: userAccuracy,
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.08,
            weight: 1,
          }).addTo(mapRef.current);
        }
      }

      if (followUser) {
        mapRef.current.setView([userLat, userLng], mapRef.current.getZoom());
      }
    });
  }, [userLat, userLng, userAccuracy, followUser]);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-lg overflow-hidden"
      style={{ height: '100%', minHeight: '420px', isolation: 'isolate' }}
    />
  );
}
