'use client';

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in Next.js + Leaflet
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface VehicleMapProps {
  vehicleLat: number;
  vehicleLng: number;
  destinationLat: number;
  destinationLng: number;
  vehicleName: string;
}

export default function MapInner({
  vehicleLat,
  vehicleLng,
  destinationLat,
  destinationLng,
  vehicleName,
}: VehicleMapProps) {
  const routePositions: [number, number][] = [
    [vehicleLat, vehicleLng],
    [destinationLat, destinationLng],
  ];

  return (
    <MapContainer
      center={[vehicleLat, vehicleLng]}
      zoom={13}
      style={{ height: '100%', width: '100%', minHeight: '400px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <Marker position={[vehicleLat, vehicleLng]}>
        <Popup>
          <strong>{vehicleName}</strong><br />
          Current Location
        </Popup>
      </Marker>

      <Marker position={[destinationLat, destinationLng]}>
        <Popup>
          Destination
        </Popup>
      </Marker>

      <Polyline positions={routePositions} color="blue" weight={4} opacity={0.6} dashArray="10, 10" />
    </MapContainer>
  );
}
