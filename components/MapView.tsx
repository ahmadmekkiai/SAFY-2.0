"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ExtendedCampaign } from './AdCard';
import { useEffect } from 'react';

// حل مشكلة أيقونات Leaflet الافتراضية في Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// هوك عشان يحرك الكاميرا بتاعة الخريطة لمكان المستخدم
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export default function MapView({ campaigns, userLocation }: { campaigns: ExtendedCampaign[], userLocation: {lat: number, lng: number} | null }) {
    // لو مفيش لوكيشن، هنوسطن الخريطة على الرياض كمكان افتراضي
    const center: [number, number] = userLocation ? [userLocation.lat, userLocation.lng] : [24.7136, 46.6753];

    return (
        <div className="w-full h-[60vh] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm relative z-0">
            <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="w-full h-full">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* دبوس موقع المستخدم الحالي */}
                {userLocation && (
                     <Marker position={[userLocation.lat, userLocation.lng]}>
                        <Popup>
                            <div className="text-center font-bold font-sans text-blue-600">موقعك الحالي</div>
                        </Popup>
                     </Marker>
                )}

                {/* دبابيس المطاعم */}
                {campaigns.map(c => (
                    <Marker key={c.id} position={[c.lat, c.lng]}>
                        <Popup>
                            <div className="text-right p-1 font-sans min-w-[120px]" dir="rtl">
                                <h3 className="font-bold text-sm text-slate-900 leading-tight mb-1">{c.title}</h3>
                                <p className="text-xs text-slate-500 mb-2">{c.merchant.category}</p>
                                <div className="bg-[#f9f6ef] border border-[#D4AF37]/30 text-[#D4AF37] font-extrabold flex items-center justify-center gap-1 px-2 py-1 rounded-lg">
                                    <span>+{c.cpc_value} نقطة</span>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
                
                <ChangeView center={center} />
            </MapContainer>
        </div>
    );
}