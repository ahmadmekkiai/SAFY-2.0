"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Map, List, Loader2 } from "lucide-react";
import AdCard, { ExtendedCampaign } from "@/components/AdCard";
import { FALLBACK_LOCATION } from "@/lib/mockLocalData";
import { calculateDistance } from "@/utils/distance";
import { createClient } from "@/lib/supabase/client";
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/MapView'), { 
    ssr: false,
    loading: () => <div className="w-full h-[60vh] bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" /></div>
});

interface ForYouTabProps {
    isActive: boolean;
    onSavedChange?: (ids: Set<string>, campaigns: ExtendedCampaign[]) => void;
}

export default function ForYouTab({ isActive, onSavedChange }: ForYouTabProps) {
    const [campaigns, setCampaigns] = useState<ExtendedCampaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeChip, setActiveChip] = useState("الكل");
    const [viewMode, setViewMode] = useState<"list" | "map">("list");

    const FILTER_CHIPS = ["الكل", "شاورما", "بخاري", "مشويات", "برجر", "قهوة"];

    const loadData = useCallback(async () => {
        setLoading(true);
        const supabase = createClient();
        const getPos = () => new Promise<GeolocationPosition>((res, rej) => {
            navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 });
        });

        let lat = FALLBACK_LOCATION.lat;
        let lng = FALLBACK_LOCATION.lng;
        try {
            const pos = await getPos();
            lat = pos.coords.latitude;
            lng = pos.coords.longitude;
        } catch (e) { console.log("Using fallback location"); }

        setUserLocation({ lat, lng });

        const { data: adsData } = await supabase.from('local_ads').select('*');
        
        if (adsData) {
            const formatted: ExtendedCampaign[] = adsData.map((ad: any) => ({
                id: ad.id.toString(),
                title: ad.title,
                lat: ad.lat,
                lng: ad.lng,
                video_url: ad.imageUrl || "", // ربط الصورة بـ video_url عشان AdCard يقرأها
                cpc_value: Math.round((ad.reward || 1) * 10),
                discountPercentage: ad.discountPercentage || 0,
                distance: calculateDistance(lat, lng, ad.lat, ad.lng),
                merchant: {
                    name: ad.advertiser || "مطعم",
                    category: ad.neighborhood || "الرياض",
                    logo: ad.imageUrl || ""
                }
            }));
            
            formatted.sort((a, b) => (a.distance || 0) - (b.distance || 0));
            setCampaigns(formatted);
            if (onSavedChange) onSavedChange(new Set(), formatted);
        }
        setLoading(false);
    }, [onSavedChange]);

    useEffect(() => {
        if (isActive) loadData();
    }, [isActive, loadData]);

    const filteredAds = useMemo(() => {
        return campaigns.filter(ad => {
            const matchSearch = ad.title.includes(searchQuery) || ad.merchant?.name.includes(searchQuery);
            const matchChip = activeChip === "الكل" || ad.title.includes(activeChip) || ad.merchant?.category.includes(activeChip);
            return matchSearch && matchChip;
        });
    }, [campaigns, searchQuery, activeChip]);

    if (!isActive) return null;

    return (
        <div className="h-full overflow-y-auto pb-24 px-4 bg-slate-50 dark:bg-slate-900" dir="rtl">
            <div className="max-w-xl mx-auto pt-6 space-y-6">
                <div className="sticky top-0 z-[100] bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md pb-4 space-y-4">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <input 
                                type="text" placeholder="ابحث عن عروض..." value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pr-10 pl-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-[#D4AF37]"
                            />
                        </div>
                        <button onClick={() => setViewMode(viewMode === "list" ? "map" : "list")} className="px-4 bg-[#D4AF37] text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-all">
                            {viewMode === "list" ? <List className="w-5 h-5" /> : <Map className="w-5 h-5" />}
                            <span>{viewMode === "list" ? "القائمة" : "الخريطة"}</span>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" /></div>
                ) : (
                    <AnimatePresence mode="wait">
                        {viewMode === "list" ? (
                            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                {filteredAds.map((ad, i) => <AdCard key={ad.id} campaign={ad} index={i} isSaved={false} />)}
                            </motion.div>
                        ) : (
                            <MapView campaigns={filteredAds} userLocation={userLocation} />
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}