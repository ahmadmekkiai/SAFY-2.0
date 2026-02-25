"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ExtendedCampaign } from './AdCard';

// 1. تعريف الأيقونات المختلفة
const getIcon = (category: string = "") => {
    let iconUrl = 'https://cdn-icons-png.flaticon.com/512/684/684908.png'; // افتراضي (دبوس أحمر)
    
    const cat = category.toLowerCase();
    if (cat.includes("شاورما")) iconUrl = 'https://cdn-icons-png.flaticon.com/512/5736/5736006.png';
    else if (cat.includes("برجر")) iconUrl = 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png';
    else if (cat.includes("قهوة") || cat.includes("كافيه")) iconUrl = 'https://cdn-icons-png.flaticon.com/512/2734/2734034.png';
    else if (cat.includes("مشويات") || cat.includes("لحوم")) iconUrl = 'https://cdn-icons-png.flaticon.com/512/2821/2821105.png';
    else if (cat.includes("فلافل") || cat.includes("فطور")) iconUrl = 'https://cdn-icons-png.flaticon.com/512/2916/2916115.png';
    else if (cat.includes("بخاري") || cat.includes("رز")) iconUrl = 'https://cdn-icons-png.flaticon.com/512/2082/2082045.png';

    return L.icon({
        iconUrl: iconUrl,
        iconSize: [35, 35],
        iconAnchor: [17, 35],
        popupAnchor: [0, -30],
    });
};

// 2. أيقونة الموقع الحالي (لون أزرق مميز)
const userIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149060.png',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    className: 'animate-pulse' // حركة نبض بسيطة
});

function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
}

export default function MapView({ campaigns, userLocation }: { campaigns: ExtendedCampaign[], userLocation: {lat: number, lng: number} | null }) {
    const center: [number, number] = userLocation ? [userLocation.lat, userLocation.lng] : [24.7136, 46.6753];

    return (
        <div className="w-full h-[65vh] rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl relative z-0">
            <MapContainer center={center} zoom={14} scrollWheelZoom={true} className="w-full h-full">
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* موقع المستخدم - رمز مميز */}
                {userLocation && (
                     <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                        <Popup>
                            <div className="text-center font-bold font-sans text-blue-600">أنت هنا 📍</div>
                        </Popup>
                     </Marker>
                )}

                {/* مواقع المطاعم - رموز حسب التصنيف */}
                {campaigns.map(c => (
                    <Marker key={c.id} position={[c.lat, c.lng]} icon={getIcon(c.merchant.category)}>
                        <Popup>
                            <div className="text-right p-1 font-sans min-w-[140px]" dir="rtl">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0">
                                        <img src={c.merchant.logo} alt="" className="w-full h-full rounded-full object-cover" />
                                    </div>
                                    <h3 className="font-bold text-sm text-slate-900">{c.merchant.name}</h3>
                                </div>
                                <p className="text-[10px] text-slate-500 mb-2 leading-tight">{c.title}</p>
                                <div className="bg-[#D4AF37] text-white font-bold flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl shadow-sm">
                                    <span className="text-xs">+{c.cpc_value} نقطة</span>
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