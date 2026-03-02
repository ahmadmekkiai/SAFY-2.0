"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Map, List, Loader2 } from "lucide-react";
import UnifiedCard from "@/components/UnifiedCard";
import { UnifiedFeedItem, Place, Campaign } from "@/types/app";
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
    onSavedChange?: (ids: Set<string>, campaigns: UnifiedFeedItem[]) => void;
}

export default function ForYouTab({ isActive, onSavedChange }: ForYouTabProps) {
    const [campaigns, setCampaigns] = useState<UnifiedFeedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeChip, setActiveChip] = useState("الكل");
    const [viewMode, setViewMode] = useState<"list" | "map">("list");

    const FILTER_CHIPS = ["الكل", "أكل منزلي / أسر منتجة", "شاورما", "برجر", "فول وفلافل", "بخاري", "قهوة", "حلى", "مشويات", "بيتزا"];

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
            const formatted: UnifiedFeedItem[] = adsData.map((ad: any) => ({
                place: {
                    id: ad.id.toString(),
                    name: ad.advertiser || ad.title || "مطعم",
                    category: ad.neighborhood || "الرياض",
                    lat: ad.lat,
                    lng: ad.lng,
                    logo: ad.imageUrl || "",
                    cover_image: ad.imageUrl || "",
                    rating: 5.0
                },
                campaign: {
                    id: ad.id.toString(),
                    place_id: ad.id.toString(),
                    cpc_value: Math.round((ad.reward || 1) * 10),
                    discount_percentage: ad.discountPercentage || 0,
                    campaign_budget: 1000,
                    status: 'active'
                },
                // Include distance as a non-standard property for sorting, or we can handle sorting externally. We can add distance to Place or keep it localized. Actually, let's keep it in Place for now or sort dynamically.
            }));

            // Sort by distance (since mock data uses random offsets)
            const sortedFormatted = [...formatted].sort((a, b) => calculateDistance(lat, lng, a.place.lat, a.place.lng) - calculateDistance(lat, lng, b.place.lat, b.place.lng));
            setCampaigns(sortedFormatted);
            if (onSavedChange) onSavedChange(new Set(), sortedFormatted);
        }
        setLoading(false);
    }, [onSavedChange]);

    useEffect(() => {
        if (isActive) loadData();
    }, [isActive, loadData]);

    const filteredAds = useMemo(() => {
        return campaigns.filter(item => {
            const matchSearch = item.place.name.includes(searchQuery) || item.place.category.includes(searchQuery);
            const matchChip = activeChip === "الكل" || item.place.name.includes(activeChip) || item.place.category.includes(activeChip);
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
                                type="text" placeholder="ابحث عن مطاعم وعروض..." value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pr-10 pl-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm outline-none focus:ring-2 focus:ring-[#D4AF37]"
                            />
                        </div>
                        <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-2xl gap-1 shadow-sm border border-slate-100 dark:border-slate-700">
                            <button
                                onClick={() => setViewMode("list")}
                                className={`px-4 py-2 text-sm font-bold flex items-center gap-2 rounded-xl transition-all ${viewMode === "list" ? "bg-[#D4AF37] text-white shadow-md" : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"}`}
                            >
                                <List className="w-5 h-5" />
                                <span>القائمة</span>
                            </button>
                            <button
                                onClick={() => setViewMode("map")}
                                className={`px-4 py-2 text-sm font-bold flex items-center gap-2 rounded-xl transition-all ${viewMode === "map" ? "bg-[#D4AF37] text-white shadow-md" : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"}`}
                            >
                                <Map className="w-5 h-5" />
                                <span>الخريطة</span>
                            </button>
                        </div>
                    </div>
                </div>
                {/* Horizontal Scrollable Filter Chips */}
                <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                    <div className="flex gap-2 min-w-max">
                        {FILTER_CHIPS.map((chip) => (
                            <button
                                key={chip}
                                onClick={() => setActiveChip(chip)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${activeChip === chip
                                    ? "bg-[#D4AF37] text-white shadow-md shadow-[#D4AF37]/20"
                                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                                    }`}
                            >
                                {chip}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" /></div>
            ) : (
                <AnimatePresence mode="wait">
                    {viewMode === "list" ? (
                        <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            {filteredAds.map((item, i) => <UnifiedCard key={item.place.id} item={item} index={i} isSaved={false} />)}
                        </motion.div>
                    ) : (
                        <MapView campaigns={filteredAds as any} userLocation={userLocation} />
                    )}
                </AnimatePresence>
            )}
        </div>
    );
}