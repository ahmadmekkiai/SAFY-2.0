"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import AdCard, { ExtendedCampaign } from "@/components/AdCard";

interface FavoritesTabProps {
    isActive: boolean;
    savedIds: Set<string>;
    campaigns: ExtendedCampaign[]; // التعديل هنا
    onToggleSave: (campaign: ExtendedCampaign) => void;
}

export default function FavoritesTab({ isActive, savedIds, campaigns, onToggleSave }: FavoritesTabProps) {
    // تصفية الإعلانات المحفوظة فقط
    const savedCampaigns = campaigns.filter(c => savedIds.has(c.id));

    if (!isActive) return null;

    return (
        <div className="h-full overflow-y-auto pb-24 px-4 bg-slate-50 dark:bg-slate-900" dir="rtl">
            <div className="max-w-xl mx-auto pt-8 space-y-6">
                <div className="text-center space-y-2">
                    <Heart className="w-12 h-12 text-red-500 mx-auto fill-red-500" />
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">المفضلة</h1>
                    <p className="text-sm text-slate-500">العروض والمطاعم اللي حفظتها</p>
                </div>

                {savedCampaigns.length === 0 ? (
                    <div className="py-20 text-center text-slate-400">
                        لا توجد عروض محفوظة حالياً
                    </div>
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