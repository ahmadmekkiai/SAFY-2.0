"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import AdCard, { ExtendedCampaign } from "@/components/AdCard";

interface FavoritesTabProps {
    isActive: boolean;
    savedIds: Set<string>;
    campaigns: ExtendedCampaign[];
    onToggleSave: (campaign: ExtendedCampaign) => void;
}

export default function FavoritesTab({ isActive, savedIds, campaigns, onToggleSave }: FavoritesTabProps) {
    const savedCampaigns = campaigns.filter(c => savedIds.has(c.id));

    if (!isActive) return null;

    return (
        <div className="h-full overflow-y-auto pb-24 px-4 bg-slate-50 dark:bg-slate-900" dir="rtl">
            <div className="max-w-xl mx-auto pt-8 space-y-6">
                <div className="text-center space-y-2">
                    <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
                        <Heart className="w-10 h-10 text-red-500 fill-red-500" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">المفضلة</h1>
                    <p className="text-sm text-slate-500">العروض والمطاعم اللي حفظتها</p>
                </div>

                {savedCampaigns.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center space-y-4">
                        <div className="text-slate-300 dark:text-slate-700 text-6xl">❤️</div>
                        <p className="text-slate-400 font-medium">لا توجد عروض محفوظة حالياً</p>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {savedCampaigns.map((campaign, index) => (
                            <AdCard 
                                key={campaign.id} 
                                campaign={campaign} 
                                index={index} 
                                isSaved={true}
                                onToggleSave={() => onToggleSave(campaign)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}