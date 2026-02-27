"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaCheckCircle, FaThumbsUp, FaThumbsDown, FaHeart, FaRegHeart, FaPhoneAlt } from "react-icons/fa";
import { MdLocationOn, MdRestaurantMenu, MdShoppingCart } from "react-icons/md";
import { useLocale } from "next-intl";
import { UnifiedFeedItem } from "../types/app";

interface UnifiedCardProps {
    item: UnifiedFeedItem;
    index: number;
    onRewardEarned?: (id: string, points: number) => void;
    isSaved?: boolean;
    onToggleSave?: () => void;
}

export default function UnifiedCard({ item, index, onRewardEarned, isSaved, onToggleSave }: UnifiedCardProps) {
    const locale = useLocale();
    const isAr = locale === "ar";

    const { place, campaign } = item;
    const title = place.name;
    const imageUrl = place.cover_image || place.logo || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=500";
    const category = place.category;

    // Timer and reward only apply if there is an active campaign
    const hasActiveCampaign = !!campaign && campaign.status === "active";
    const rewardPoints = campaign?.cpc_value || 0;

    const [timeLeft, setTimeLeft] = useState(30);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [likeStatus, setLikeStatus] = useState<"like" | "dislike" | null>(null);

    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsActive(entry.isIntersecting),
            { root: null, rootMargin: "-45% 0px -45% 0px", threshold: 0 }
        );
        if (cardRef.current) observer.observe(cardRef.current);
        return () => { if (cardRef.current) observer.unobserve(cardRef.current); };
    }, []);

    useEffect(() => {
        let timerId: NodeJS.Timeout;
        if (hasActiveCampaign && isActive && timeLeft > 0 && !isCompleted) {
            timerId = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
        } else if (hasActiveCampaign && isActive && timeLeft === 0 && !isCompleted) {
            setIsCompleted(true);
            setShowOverlay(true);
            if (onRewardEarned && campaign) onRewardEarned(campaign.id, rewardPoints);
            setTimeout(() => setShowOverlay(false), 2500);
        }
        return () => clearTimeout(timerId);
    }, [isActive, timeLeft, isCompleted, hasActiveCampaign, campaign, rewardPoints, onRewardEarned]);

    const progressPercentage = ((30 - timeLeft) / 30) * 100;

    return (
        <div ref={cardRef} className={`relative bg-white dark:bg-slate-800 rounded-3xl shadow-sm border overflow-hidden transition-all duration-500 ${hasActiveCampaign && isActive ? 'border-[#D4AF37] scale-[1.02] shadow-xl z-10' : 'border-gray-100 dark:border-slate-700 scale-100 opacity-95'}`}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    if (onToggleSave) onToggleSave();
                }}
                className="absolute top-4 left-4 z-20 w-10 h-10 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all"
            >
                {isSaved ? <FaHeart className="text-red-500 text-xl animate-in zoom-in" /> : <FaRegHeart className="text-gray-400 text-xl" />}
            </button>

            <div className="relative h-52 w-full bg-gray-200">
                <Image src={imageUrl} alt={title} fill className="object-cover" unoptimized />
                {hasActiveCampaign && (
                    <>
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-black/20 z-10">
                            <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] transition-all duration-1000 ease-linear shadow-[0_0_8px_#D4AF37]" style={{ width: `${progressPercentage}%` }} />
                        </div>
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-2xl text-xs font-black flex items-center gap-1.5 z-10">
                            {isCompleted ? <span className="text-[#D4AF37] flex items-center gap-1"><FaCheckCircle /> {isAr ? "مكتمل" : "Completed"}</span> : <span className={isActive ? "text-[#D4AF37] animate-pulse" : ""}>{timeLeft} {isAr ? "ثانية" : "sec"}</span>}
                        </div>
                    </>
                )}
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <div className="space-y-1">
                        <h3 className="font-black text-xl text-gray-900 dark:text-white leading-tight">{title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 font-bold">
                            <MdLocationOn className="text-[#D4AF37]" size={18} /> {category}
                            {place.rating !== undefined && <span className="ml-2 text-yellow-500">★ {place.rating}</span>}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                    {place.phone && (
                        <button className="flex items-center gap-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                            <FaPhoneAlt className="text-blue-500" /> {isAr ? "اتصل" : "Call"}
                        </button>
                    )}
                    {place.order_links && place.order_links.length > 0 && (
                        <button className="flex items-center gap-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                            <MdShoppingCart className="text-green-500" /> {isAr ? "اطلب أونلاين" : "Order Online"}
                        </button>
                    )}
                </div>

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100 dark:border-slate-700">
                    <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-[#D4AF37] transition-all active:scale-95">
                            <MdRestaurantMenu size={20} className="text-[#D4AF37]" /> {isAr ? "المنيو" : "Menu"}
                        </button>
                        <div className="flex items-center gap-4 border-r border-gray-100 dark:border-slate-700 pr-4">
                            <button onClick={() => setLikeStatus(likeStatus === "like" ? null : "like")} className={`transition-all active:scale-125 ${likeStatus === "like" ? "text-green-500 scale-110" : "text-gray-400 hover:text-green-500"}`}><FaThumbsUp size={20} /></button>
                            <button onClick={() => setLikeStatus(likeStatus === "dislike" ? null : "dislike")} className={`transition-all active:scale-125 ${likeStatus === "dislike" ? "text-red-500 scale-110" : "text-gray-400 hover:text-red-500"}`}><FaThumbsDown size={20} /></button>
                        </div>
                    </div>
                    {hasActiveCampaign && (
                        <div className="bg-gradient-to-br from-[#D4AF37] to-[#B8860B] text-white font-black flex items-center gap-1.5 px-4 py-2 rounded-2xl shadow-lg shadow-[#D4AF37]/20">
                            <span className="text-lg">+{rewardPoints}</span>
                            <span className="text-[10px] uppercase">{isAr ? "نقطة" : "Pts"}</span>
                        </div>
                    )}
                </div>
            </div>

            {hasActiveCampaign && showOverlay && (
                <div className="absolute inset-0 z-30 bg-[#D4AF37]/95 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 backdrop-blur-md">
                    <div className="bg-white p-6 rounded-full shadow-2xl mb-4 animate-bounce"><FaCheckCircle className="text-[#D4AF37] text-6xl" /></div>
                    <h2 className="text-white font-black text-3xl mb-1">{isAr ? "كفو عليك!" : "Awesome!"}</h2>
                    <p className="text-white/90 text-lg font-bold">{isAr ? `كسبت ${rewardPoints} نقطة` : `You earned ${rewardPoints} Pts`}</p>
                </div>
            )}
        </div>
    );
}
