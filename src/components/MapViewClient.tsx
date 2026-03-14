"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Mosque } from "@/types/mosque";

export function MapViewClient({ mosques }: { mosques: Mosque[] }) {
  return (
    <MapContainer center={[51.5, -0.1]} zoom={6} scrollWheelZoom className="h-[60vh] w-full rounded-xl">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {mosques.map((mosque) => (
        <Marker key={mosque.id} position={[mosque.latitude, mosque.longitude]}>
          <Popup>
            <strong>{mosque.name}</strong>
            <br />
            {mosque.city}, {mosque.country}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
