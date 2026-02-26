"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ExtendedCampaign } from "./AdCard";

// تظبيط أيقونة الخريطة الافتراضية
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// مكون لتحديث مركز الخريطة تلقائياً
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center);
  return null;
}

interface MapViewProps {
  campaigns: ExtendedCampaign[];
  userLocation: { lat: number; lng: number } | null;
}

export default function MapView({ campaigns, userLocation }: MapViewProps) {
  const defaultCenter: [number, number] = userLocation 
    ? [userLocation.lat, userLocation.lng] 
    : [24.7136, 46.6753]; // الرياض كوضع افتراضي

  return (
    <div className="w-full h-[60vh] rounded-[2.5rem] overflow-hidden shadow-inner border-4 border-white dark:border-slate-800 z-0">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {userLocation && <ChangeView center={[userLocation.lat, userLocation.lng]} />}

        {campaigns.map((ad) => (
          <Marker key={ad.id} position={[ad.lat, ad.lng]} icon={icon}>
            <Popup>
              <div className="text-right p-1 font-sans min-w-[140px]" dir="rtl">
                {/* استخدام علامة الـ ? هنا هو اللي بيحل المشكلة */}
                <h3 className="font-bold text-sm text-slate-900 mb-1">
                    {ad.merchant?.name || ad.title || "مطعم"}
                </h3>
                <p className="text-[10px] text-slate-500 mb-2">
                    {ad.merchant?.category || "عرض مميز"}
                </p>
                <div className="bg-[#D4AF37] text-white font-bold flex items-center justify-center py-1 rounded-lg">
                  <span className="text-xs">+{ad.cpc_value || 10} نقطة</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}