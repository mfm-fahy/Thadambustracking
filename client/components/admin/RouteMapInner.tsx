'use client';

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

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

export default function RouteMapInner({ routes }: { routes: any[] }) {
  // A generic center for demonstration since we don't have lat/lng in mockRoutes
  const center: [number, number] = [40.7128, -74.0060]; // Initial center (New York for example)

  // In a real app, routes would have coordinates. We will just show the center point dummy marker for now,
  // or a few dummy points to make the map look active.
  const dummyPoints: [number, number][] = [
    [40.7128, -74.0060], // City Center Hub
    [40.7580, -73.9855], // Tech Park
    [40.7829, -73.9654], // University Campus
    [40.6413, -73.7781], // Airport
  ];

  return (
    <MapContainer
      center={center}
      zoom={11}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {dummyPoints.map((pos, i) => (
        <Marker key={i} position={pos}>
          <Popup>Route Hub {i + 1}</Popup>
        </Marker>
      ))}
      <Polyline positions={dummyPoints} color="accent" weight={3} opacity={0.7} />
    </MapContainer>
  );
}
