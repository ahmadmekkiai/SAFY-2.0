import { type Campaign, type Merchant } from "@/lib/types";
import Image from "next/image";
import { ThumbsUp, ThumbsDown, MapPin, Navigation, Receipt, PlayCircle, PhoneCall, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Mock data extended for the UI purpose, as we only need UI for now
export interface ExtendedCampaign extends Campaign {
    merchant: Merchant;
    distance?: number;
}

interface AdCardProps {
    campaign: ExtendedCampaign;
    index: number;
}

export default function AdCard({ campaign, index }: AdCardProps) {
    const [liked, setLiked] = useState<boolean | null>(null);
    const [viewProgress, setViewProgress] = useState(0);

    // Simulate Fake View Progress for Demo Points System
    useEffect(() => {
        const duration = 3000; // 3 seconds to "earn"
        let start = Date.now();
        let frame: number;

        const updateProgress = () => {
            const now = Date.now();
            const elapsed = now - start;
            const progress = Math.min((elapsed / duration) * 100, 100);
            setViewProgress(progress);
            if (progress < 100) {
                frame = requestAnimationFrame(updateProgress);
            }
        };
        frame = requestAnimationFrame(updateProgress);
        return () => cancelAnimationFrame(frame);
    }, []);

    const totalVotes = campaign.merchant.overall_likes + campaign.merchant.overall_dislikes;
    const recommendPct = totalVotes > 0
        ? Math.round((campaign.merchant.overall_likes / totalVotes) * 100)
        : 100;

    const hasBounty = campaign.bounty_budget >= campaign.bounty_reward;

    const handleScanReceipt = () => {
        // In a real app, this would open a modal or navigate to a camera view.
        // For now, we simulate success with an alert.
        alert(`Opening Receipt Scanner for ${campaign.merchant.name}...`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="group relative bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden"
        >
            {/* ── Media Header ── */}
            <div className="relative h-56 bg-gray-100 dark:bg-slate-700 w-full overflow-hidden">
                <Image
                    src={campaign.video_url || "/placeholder-image.jpg"}
                    alt={campaign.title}
                    fill
                    className="object-cover"
                />

                {/* CPV Overlay */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <PlayCircle className="w-4 h-4 text-amber-400" />
                    + {Math.floor(campaign.cpc_value * 100)} Pts Wait
                </div>

                {/* Distance Badge (Clickable) */}
                {campaign.distance !== undefined && (
                    <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${campaign.lat},${campaign.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                    >
                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                        {campaign.distance.toFixed(1)} km away
                    </a>
                )}

                {/* View Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/30">
                    <motion.div
                        className="h-full bg-amber-400 transition-all duration-75"
                        style={{ width: `${viewProgress}%` }}
                    />
                </div>
            </div>

            {/* ── Content Body ── */}
            <div className="p-5">
                {/* Merchant Info & Rating */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-slate-100 dark:border-slate-700 bg-white">
                            <Image
                                src={campaign.merchant.logo || "/placeholder-logo.jpg"}
                                alt={campaign.merchant.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white leading-none mb-1">
                                {campaign.merchant.name}
                            </h3>
                            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                                {recommendPct}% Recommended
                            </span>
                        </div>
                    </div>
                </div>

                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 line-clamp-2 mb-4">
                    {campaign.title}
                </h2>

                {/* ── Smart Action Nav (Single Row) ── */}
                <div className="flex flex-row gap-2 overflow-x-auto pb-2 mb-4 hide-scrollbar">

                    {/* Scan Receipt (Primary Action, First if available) */}
                    {hasBounty && (
                        <button
                            onClick={handleScanReceipt}
                            className="flex-shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md shadow-emerald-500/20 transition-all active:scale-95"
                        >
                            <Receipt className="w-4 h-4" />
                            <span>Scan (+{campaign.bounty_reward})</span>
                        </button>
                    )}

                    {/* Directions */}
                    <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${campaign.lat},${campaign.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-shrink-0 flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
                    >
                        <Navigation className="w-4 h-4 text-blue-500" />
                        <span>{campaign.actionText || "الاتجاهات"}</span>
                    </a>

                    {/* Call Now */}
                    {campaign.phone_number && (
                        <a
                            href={`tel:${campaign.phone_number}`}
                            className="flex-shrink-0 flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
                        >
                            <PhoneCall className="w-4 h-4 text-amber-500" />
                            <span>Call</span>
                        </a>
                    )}

                    {/* Order Online */}
                    {(campaign.order_url || campaign.actionText === 'اطلب الآن') && (
                        <a
                            href={campaign.order_url || '#'}
                            target={campaign.order_url ? "_blank" : undefined}
                            rel="noreferrer"
                            className="flex-shrink-0 flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
                        >
                            <ShoppingBag className="w-4 h-4 text-purple-500" />
                            <span>اطلب أونلاين</span>
                        </a>
                    )}
                </div>

                {/* Interaction: Like / Dislike */}
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-4">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        How was the offer?
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setLiked(true)}
                            className={`p-2.5 rounded-full transition-colors ${liked === true ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700'}`}
                        >
                            <ThumbsUp className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setLiked(false)}
                            className={`p-2.5 rounded-full transition-colors ${liked === false ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700'}`}
                        >
                            <ThumbsDown className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </motion.div>
    );
}
