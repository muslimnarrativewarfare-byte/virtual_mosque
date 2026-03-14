"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    L?: {
      map: (element: HTMLElement) => any;
      tileLayer: (url: string, options: Record<string, unknown>) => { addTo: (map: unknown) => unknown };
      circleMarker: (coords: [number, number], options?: Record<string, unknown>) => {
        addTo: (map: unknown) => { setLatLng: (coords: [number, number]) => void };
      };
    };
  }
}

type LocationPickerProps = {
  latitude: number;
  longitude: number;
  onSelect: (lat: number, lng: number) => void;
};

const LEAFLET_CSS_ID = "leaflet-css-cdn";
const LEAFLET_SCRIPT_ID = "leaflet-js-cdn";

function loadLeafletAssets() {
  if (!document.getElementById(LEAFLET_CSS_ID)) {
    const css = document.createElement("link");
    css.id = LEAFLET_CSS_ID;
    css.rel = "stylesheet";
    css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    css.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    css.crossOrigin = "";
    document.head.appendChild(css);
  }

  if (window.L) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    let script = document.getElementById(LEAFLET_SCRIPT_ID) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = LEAFLET_SCRIPT_ID;
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
      script.crossOrigin = "";
      document.body.appendChild(script);
    }

    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load map library."));
  });
}

export default function LocationPicker({ latitude, longitude, onSelect }: LocationPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<{ setLatLng: (coords: [number, number]) => void } | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadLeafletAssets()
      .then(() => {
        if (cancelled || !containerRef.current || !window.L) return;

        const map = window.L.map(containerRef.current);
        map.setView([latitude, longitude], 12);

        window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const marker = window.L.circleMarker([latitude, longitude], {
          color: "#0f172a",
          fillColor: "#334155",
          fillOpacity: 0.85,
          radius: 8
        }).addTo(map);

        map.on("click", (event: { latlng: { lat: number; lng: number } }) => {
          const lat = Number(event.latlng.lat.toFixed(6));
          const lng = Number(event.latlng.lng.toFixed(6));
          marker.setLatLng([lat, lng]);
          onSelect(lat, lng);
        });

        mapRef.current = map;
        markerRef.current = marker;
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markerRef.current = null;
    };
  }, [latitude, longitude, onSelect]);

  return (
    <div className="space-y-2">
      <p className="text-sm text-slate-600">Click on the map to select mosque coordinates.</p>
      <div ref={containerRef} className="h-80 w-full rounded-lg border border-slate-200" />
    </div>
  );
}
