"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ExtendedCampaign } from './AdCard';

// 1. أيقونات 3D احترافية وهادية لكل تصنيف
const getCategoryIcon = (category: string = "") => {
    let iconUrl = 'https://cdn-icons-png.flaticon.com/512/5891/5891412.png'; // أيقونة افتراضية زرقاء شيك
    
    const cat = category.toLowerCase();
    // تخصيص الأيقونات حسب الكلمات المفتاحية
    if (cat.includes("شاورما")) iconUrl = 'https://cdn-icons-png.flaticon.com/512/8112/8112675.png'; // 3D Shawarma/Wrap
    else if (cat.includes("برجر")) iconUrl = 'https://cdn-icons-png.flaticon.com/512/8112/8112613.png'; // 3D Burger
    else if (cat.includes("قهوة") || cat.includes("كافيه")) iconUrl = 'https://cdn-icons-png.flaticon.com/512/8112/8112624.png'; // 3D Coffee
    else if (cat.includes("بخاري") || cat.includes("رز") || cat.includes("مندي")) iconUrl = 'https://cdn-icons-png.flaticon.com/512/8112/8112526.png'; // 3D Rice Bowl
    else if (cat.includes("مشويات") || cat.includes("لحوم")) iconUrl = 'https://cdn-icons-png.flaticon.com/512/8112/8112660.png'; // 3D BBQ/Meat
    else if (cat.includes("بيتزا")) iconUrl = 'https://cdn-icons-png.flaticon.com/512/8112/8112651.png'; // 3D Pizza

    return L.icon({
        iconUrl: iconUrl,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -35],
    });
};

// 2. أيقونة موقع المستخدم (الأزرق الأصلي اللي عجبك مع نبض هادي)
const userIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/5610/5610931.png', // Location point زرقاء فخمة
    iconSize: [45, 45],
    iconAnchor: [22, 22],
    className: 'animate-pulse' 
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
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" // خريطة فاتحة وهادية عشان تبرز الأيقونات
                />
                
                {/* موقع المستخدم - العلامة الزرقاء */}
                {userLocation && (
                     <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                        <Popup>
                            <div className="text-center font-bold text-blue-600">موقعك الحالي</div>
                        </Popup>
                     </Marker>
                )}

                {/* مواقع المطاعم - الأيقونات الـ 3D المخصصة */}
                {campaigns.map(ad => (
                    <Marker key={ad.id} position={[ad.lat, ad.lng]} icon={getCategoryIcon(ad.merchant.category)}>
                        <Popup>
                            <div className="text-right p-2 font-sans min-w-[150px]" dir="rtl">
                                <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-2">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex-shrink-0 border border-slate-200 overflow-hidden">
                                        <img src={ad.merchant.logo} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-slate-900 leading-none">{ad.merchant.name}</h3>
                                        <span className="text-[10px] text-[#D4AF37] font-medium">{ad.merchant.category}</span>
                                    </div>
                                </div>
                                <div className="bg-slate-900 text-white font-bold flex items-center justify-center gap-1 px-3 py-2 rounded-xl shadow-md">
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