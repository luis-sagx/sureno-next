"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

// Fix missing default marker icons in bundled environments
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const STORE_POSITION: [number, number] = [-0.3128, -78.5527];

export function StoreMap() {
  useEffect(() => {
    // Invalidate size after mount so tiles render correctly inside flex layouts
    const timeout = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <MapContainer
      center={STORE_POSITION}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: "400px", width: "100%", borderRadius: "0.75rem" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={STORE_POSITION}>
        <Popup>
          <strong>Licorería Sureño</strong>
          <br />
          Sur de Quito, Ecuador
        </Popup>
      </Marker>
    </MapContainer>
  );
}
