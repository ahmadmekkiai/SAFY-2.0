"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, ExternalLink, ShieldCheck, TrendingUp, Zap, BookmarkX } from "lucide-react";
import { type AdCampaign, getDiscountPercentage, calcUserEarningPerClick, formatSAR } from "@/lib/mockCampaigns";
import Image from "next/image";
import AdCard from "@/components/AdCard";

interface FavoritesTabProps {
    isActive: boolean;
    savedIds: Set<string>;
    campaigns: AdCampaign[];
    onToggleSave: (campaign: AdCampaign) => void;
}

export default function FavoritesTab({ isActive, savedIds, campaigns, onToggleSave }: FavoritesTabProps) {
    if (!isActive) return null;

    const savedCampaigns = campaigns.filter(c => savedIds.has(c.id));

    return (
        <div className="h-full overflow-y-auto pb-24 px-4">
            <div className="max-w-4xl mx-auto pt-6 space-y-6">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <Heart className="w-7 h-7 fill-red-500 text-red-500" />
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Favorites</h1>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {savedCampaigns.length > 0
                            ? `${savedCampaigns.length} saved ${savedCampaigns.length === 1 ? 'deal' : 'deals'}`
                            : 'Deals you save will appear here'}
                    </p>
                </motion.div>

                {savedCampaigns.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <AnimatePresence>
                            {savedCampaigns.map((campaign, index) => (
                                <AdCard
                                    key={campaign.id}
                                    campaign={campaign}
                                    isSaved={true}
                                    onToggleSave={() => onToggleSave(campaign)}
                                    index={index}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow"
                    >
                        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-5">
                            <BookmarkX className="w-10 h-10 text-red-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No saved deals</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto">
                            Tap the ❤️ on any deal in "For You" to save it here.
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
