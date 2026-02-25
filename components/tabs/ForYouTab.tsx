"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Search, Target } from "lucide-react";
import AdCard, { ExtendedCampaign } from "@/components/AdCard";
import { FALLBACK_LOCATION } from "@/lib/mockLocalData";
import { calculateDistance } from "@/utils/distance";
import { createClient } from "@/lib/supabase/client";

interface ForYouTabProps {
    isActive: boolean;
}

export default function ForYouTab({ isActive }: ForYouTabProps) {
    const [campaigns, setCampaigns] = useState<ExtendedCampaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [currentRadius, setCurrentRadius] = useState<number>(5);
    const [isFallback, setIsFallback] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [maxAdsLimit, setMaxAdsLimit] = useState(1000); // رفعنا الحد الأقصى لـ 1000 إعلان
    const [activeChip, setActiveChip] = useState("الكل");

    // مرجع للتحكم في السكرول
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const FILTER_CHIPS = ["الكل", "شاورما", "بخاري", "مشويات", "برجر", "قهوة"];

    const normalizeArabic = (text: string) => {
        return text.replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').toLowerCase();
    };

    // التمرير لأعلى عند تغيير الفلتر أو البحث
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [activeChip, searchQuery]);

    const fetchLocationAndBuildFeed = useCallback(async () => {
        setLoading(true);

        let maxAds = 1000;
        let minDiscount = 20;

        if (typeof window !== "undefined") {
            const savedPrefs = localStorage.getItem('safy_ad_prefs');
            if (savedPrefs) {
                try {
                    const parsed = JSON.parse(savedPrefs);
                    if (parsed.dailyLimit) {
                        maxAds = Math.max(parsed.dailyLimit, 1000); // نضمن إن العدد يفضل كبير
                        setMaxAdsLimit(maxAds);
                    }
                    if (parsed.minDiscount !== undefined) minDiscount = parsed.minDiscount;
                } catch (e) {
                    console.error("Error parsing ad prefs:", e);
                }
            }
        }

        const supabase = createClient();
        let userInterests: string[] = [];
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const { data } = await supabase
                    .from('profiles')
                    .select('interests')
                    .eq('id', session.user.id)
                    .single();
                if (data?.interests) {
                    userInterests = data.interests;
                }
            }
        } catch (error) {
            console.error("Error fetching interests:", error);
        }

        const buildFeed = async (lat: number, lng: number, fallback: boolean) => {
            setUserLocation({ lat, lng });
            setIsFallback(fallback);

            let radius = 1000;
            let filtered: ExtendedCampaign[] = [];

            try {
                const { data: adsData, error } = await supabase.from('local_ads').select('*');
                if (error) {
                    console.error("Error fetching local ads:", error);
                    setLoading(false);
                    return;
                }

                const dbAds = adsData || [];

                let matches = dbAds.map((ad: any) => {
                    const distance = calculateDistance(lat, lng, ad.lat, ad.lng);

                    // تحويل النقاط لرقم صحيح وأكثر واقعية (مثال: 1.5 تصبح 15)
                    const rawReward = ad.reward || 1.5;
                    const realisticReward = Math.round(rawReward * 10);

                    const merchant = {
                        id: ad.id,
                        name: ad.advertiser || "Unknown",
                        logo: ad.imageUrl || "/placeholder-logo.jpg",
                        category: ad.category || ad.neighborhood || "General", // دمجنا الحي هنا عشان الفلترة
                        overall_likes: Math.floor(Math.random() * 5000) + 1000,
                        overall_dislikes: Math.floor(Math.random() * 300) + 50
                    };

                    const campaign = {
                        id: `c_${ad.id}`,
                        merchant_id: ad.id,
                        title: ad.title || "Untitled",
                        video_url: ad.imageUrl || "",
                        lat: ad.lat,
                        lng: ad.lng,
                        discountPercentage: ad.discountPercentage || 0,
                        cpc_value: realisticReward, // النقاط الجديدة
                        bounty_budget: realisticReward > 10 ? 25000 : 0,
                        bounty_reward: realisticReward * 100,
                        actionText: ad.actionText,
                        is_active: true
                    };

                    return {
                        ...campaign,
                        merchant,
                        distance
                    } as ExtendedCampaign;
                }).filter(c => c.distance !== undefined && c.distance <= radius && c.discountPercentage >= minDiscount);

                if (userInterests.length > 0) {
                    const interestMatches = matches.filter(c =>
                        userInterests.includes(c.merchant.category) ||
                        userInterests.some(i => c.merchant.category.startsWith(i)) ||
                        userInterests.some(i => i.startsWith(c.merchant.category))
                    );
                    if (interestMatches.length > 0) {
                        matches = interestMatches;
                    }
                }

                filtered = matches;

                if (filtered.length === 0) {
                    // Safety net
                    filtered = dbAds.map((ad: any) => {
                        const distance = calculateDistance(lat, lng, ad.lat, ad.lng);
                        const rawReward = ad.reward || 1.5;
                        const realisticReward = Math.round(rawReward * 10);

                        return {
                            id: `c_${ad.id}`,
                            merchant_id: ad.id,
                            title: ad.title || "Untitled",
                            video_url: ad.imageUrl || "",
                            lat: ad.lat,
                            lng: ad.lng,
                            discountPercentage: ad.discountPercentage || 0,
                            cpc_value: realisticReward,
                            bounty_budget: realisticReward > 10 ? 25000 : 0,
                            bounty_reward: realisticReward * 100,
                            actionText: ad.actionText,
                            is_active: true,
                            merchant: {
                                id: ad.id,
                                name: ad.advertiser || "Unknown",
                                logo: ad.imageUrl || "/placeholder-logo.jpg",
                                category: ad.category || ad.neighborhood || "General",
                                overall_likes: 2500,
                                overall_dislikes: 120
                            },
                            distance
                        } as ExtendedCampaign;
                    }).filter(c => c.distance !== undefined && c.discountPercentage >= minDiscount);
                }

                setCurrentRadius(Math.max(10, Math.ceil(Math.max(...filtered.map(f => f.distance || 0)))));
                filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
                setCampaigns(filtered);
            } catch (err) {
                console.error("Unexpected error building feed:", err);
            } finally {
                setLoading(false);
            }
        };

        if (typeof window !== "undefined" && "geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    buildFeed(position.coords.latitude, position.coords.longitude, false);
                },
                (error) => {
                    console.warn("GPS error, using fallback location:", error);
                    buildFeed(FALLBACK_LOCATION.lat, FALLBACK_LOCATION.lng, true);
                },
                { timeout: 10000, maximumAge: 60000 }
            );
        } else {
            console.warn("Geolocation not supported, using fallback location.");
            buildFeed(FALLBACK_LOCATION.lat, FALLBACK_LOCATION.lng, true);
        }
    }, []);

    useEffect(() => {
        if (!isActive) return;
        fetchLocationAndBuildFeed();
    }, [isActive, fetchLocationAndBuildFeed]);

    if (!isActive) return null;

    if (loading) {
        return (
            <div className="h-full overflow-y-auto pb-24 px-4 bg-slate-50 dark:bg-slate-900 pt-6">
                <div className="max-w-xl mx-auto space-y-6">
                    <div className="flex gap-3 mb-4 items-center">
                        <div className="h-12 flex-1 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
                        <div className="h-12 w-12 bg-slate-200 dark:bg-slate-800 rounded-2xl flex-shrink-0 animate-pulse" />
                    </div>
                    <div className="flex gap-2 mb-6 overflow-hidden">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-full flex-shrink-0 animate-pulse" />)}
                    </div>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-full h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    const displayedCampaigns = campaigns.filter(c => {
        // البحث الذكي: بيفصل الكلمات ويدور في الاسم والحي
        if (searchQuery) {
            const searchTerms = normalizeArabic(searchQuery).split(" ").filter(term => term.length > 0);
            const title = normalizeArabic(c.title || "");
            const merchantName = normalizeArabic(c.merchant?.name || "");
            const neighborhood = normalizeArabic(c.merchant?.category || "");

            const isMatch = searchTerms.every(term => 
                title.includes(term) || merchantName.includes(term) || neighborhood.includes(term)
            );
            if (!isMatch) return false;
        }

        // فلتر شريط التصنيفات (شاورما، بخاري، إلخ)
        if (activeChip !== "الكل") {
            const chipMatch = normalizeArabic(activeChip);
            const title = normalizeArabic(c.title || "");
            const merchantName = normalizeArabic(c.merchant?.name || "");
            const neighborhood = normalizeArabic(c.merchant?.category || "");

            if (!title.includes(chipMatch) && !merchantName.includes(chipMatch) && !neighborhood.includes(chipMatch)) {
                return false;
            }
        }
        return true;
    }).slice(0, maxAdsLimit);

    return (
        <div ref={scrollContainerRef} className="h-full overflow-y-auto pb-24 px-4 bg-slate-50 dark:bg-slate-900 transition-colors relative">
            <AnimatePresence>
                {isFallback && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-orange-500/90 text-white text-xs px-4 py-2 text-center w-full sticky top-0 z-50 shadow-md"
                    >
                        📍 Using default location (Riyadh). Enable GPS for local ads.
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-xl mx-auto space-y-6 pt-6 relative">
                <div className="sticky top-0 z-40 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-lg pt-2 pb-3 -mx-4 px-4 shadow-sm border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="relative flex-1">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="ابحث عن مطعم، عرض، حي..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pr-10 pl-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 text-right"
                                dir="rtl"
                            />
                        </div>
                        <button
                            onClick={fetchLocationAndBuildFeed}
                            className="w-12 h-12 bg-[#D4AF37] hover:bg-[#B4941F] text-white rounded-2xl flex items-center justify-center transition-colors shadow-md active:scale-95 flex-shrink-0"
                            title="Refresh Location"
                        >
                            <Target className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1" dir="rtl">
                        {FILTER_CHIPS.map(chip => (
                            <button
                                key={chip}
                                onClick={() => setActiveChip(chip)}
                                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border ${activeChip === chip
                                    ? "bg-[#D4AF37] text-white border-[#D4AF37] shadow-sm"
                                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                                    }`}
                            >
                                {chip}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            اكتشف العروض
                        </h1>
                        <div className="flex items-center gap-1.5 mt-1 text-[#D4AF37] font-medium text-sm">
                            <MapPin className="w-4 h-4" />
                            <span>نعرض المطاعم في نطاق {currentRadius} كم</span>
                        </div>
                    </div>
                </motion.div>

                {displayedCampaigns.length > 0 ? (
                    <div className="flex flex-col gap-6">
                        <AnimatePresence>
                            {displayedCampaigns.map((campaign, index) => (
                                <AdCard
                                    key={campaign.id}
                                    campaign={campaign}
                                    index={index}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm"
                    >
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MapPin className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            لا توجد عروض قريبة
                        </h3>
                        <p className="text-slate-500 max-w-[250px] mx-auto text-sm">
                            لم نتمكن من العثور على أي عروض نشطة في نطاق {currentRadius} كم من موقعك.
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}