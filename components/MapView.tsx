"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ExtendedCampaign } from './AdCard';

// 1. أيقونة المطاعم الموحدة (الأزرق الأصلي الهادي)
const restaurantIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// 2. أيقونة موقعك الحالي (مميزة بلون ذهبي فخم مع نبض)
const userLocationIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [30, 48], // أكبر شوية عشان يتميز
    iconAnchor: [15, 48],
    className: 'animate-pulse' // النبض اللي طلبتة
});

function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
}

export default function MapView({ campaigns, userLocation }: { campaigns: ExtendedCampaign[], userLocation: {lat: number, lng: number} | null }) {
    const center: [number, number] = userLocation ? [userLocation.lat, userLocation.lng] : [24.7136, 46.6753];

    return (
        <div className="w-full h-[65vh] rounded-[2.5rem] overflow-hidden border-2 border-slate-200 dark:border-slate-800 shadow-xl relative z-0">
            <MapContainer center={center} zoom={14} scrollWheelZoom={true} className="w-full h-full">
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* موقع المستخدم - ذهبي ومميز وينبض */}
                {userLocation && (
                     <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
                        <Popup>
                            <div className="text-center font-bold text-slate-800">أنت هنا 📍</div>
                        </Popup>
                     </Marker>
                )}

                {/* مواقع المطاعم - الأزرق الموحد المريح للعين */}
                {campaigns.map(ad => (
                    <Marker key={ad.id} position={[ad.lat, ad.lng]} icon={restaurantIcon}>
                        <Popup>
                            <div className="text-right p-1 font-sans min-w-[140px]" dir="rtl">
                                <h3 className="font-bold text-sm text-slate-900 mb-1">{ad.merchant.name}</h3>
                                <p className="text-[10px] text-slate-500 mb-2">{ad.merchant.category}</p>
                                <div className="bg-[#D4AF37] text-white font-bold flex items-center justify-center py-1 rounded-lg">
                                    <span className="text-xs">+{ad.cpc_value} نقطة</span>
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