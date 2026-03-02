"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaHeart, FaRegHeart, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { MdLocationOn, MdShoppingCart, MdDirections } from "react-icons/md";
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
    const router = useRouter();
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

    // Add local state for favored items so the user gets instant visual feedback
    const [localIsSaved, setLocalIsSaved] = useState(isSaved || false);

    // Sync if prop changes
    useEffect(() => {
        setLocalIsSaved(isSaved || false);
    }, [isSaved]);

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

    const navigateToPlace = () => {
        router.push(`/${locale}/place/${place.id}`);
    };

    const handleDirections = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.open(`https://maps.google.com/?q=${place.lat},${place.lng}`, '_blank');
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLocalIsSaved(!localIsSaved);
        if (onToggleSave) onToggleSave();
    };

    return (
        <div
            ref={cardRef}
            onClick={navigateToPlace}
            className={`relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col ${hasActiveCampaign
                ? 'border border-[#D4AF37]/40 shadow-[0_0_15px_rgba(212,175,55,0.15)] ring-1 ring-[#D4AF37]/10'
                : 'border border-gray-100 dark:border-slate-700 shadow-sm'
                }`}
        >
            <button
                onClick={handleToggleFavorite}
                className="absolute top-4 left-4 z-20 w-10 h-10 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all"
            >
                {localIsSaved ? <FaHeart className="text-red-500 text-xl animate-in zoom-in" /> : <FaRegHeart className="text-gray-400 text-xl" />}
            </button>

            <div className="relative h-48 w-full bg-gray-200 dark:bg-slate-700 flex-shrink-0">
                <Image src={imageUrl} alt={title} fill className="object-cover" unoptimized />

                {hasActiveCampaign && (
                    <>
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-black/20 z-10">
                            <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] transition-all duration-1000 ease-linear shadow-[0_0_8px_#D4AF37]" style={{ width: `${progressPercentage}%` }} />
                        </div>
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-2xl text-xs font-black flex items-center gap-1.5 z-10 border border-white/10">
                            {isCompleted ? (
                                <span className="text-[#D4AF37] flex items-center gap-1"><FaCheckCircle /> {isAr ? "مكتمل" : "Completed"}</span>
                            ) : (
                                <span className={isActive ? "text-[#D4AF37] animate-pulse" : ""}>{timeLeft} {isAr ? "ثانية" : "sec"}</span>
                            )}
                        </div>
                    </>
                )}
            </div>

            <div className="p-4 flex flex-col flex-grow">
                {/* Header Information */}
                <div className="flex justify-between items-start mb-2">
                    <div className="space-y-1">
                        <h3 className="font-black text-lg text-gray-900 dark:text-white leading-tight">{title}</h3>
                        <p className="text-sm border-r-2 pr-2 border-[#D4AF37] text-gray-600 dark:text-gray-400 flex items-center font-bold">
                            {category}
                            <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
                            {/* In a real app we'd calculate distance, for now showing a simulated one or placeholder */}
                            <span>يبعد عنك {Math.floor(Math.random() * 5) + 1} كم</span>
                        </p>
                    </div>
                    {place.rating && (
                        <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500 font-bold px-2 py-1 rounded-lg text-sm">
                            <span>★</span> {place.rating}
                        </div>
                    )}
                </div>

                {/* External Actions Menu */}
                <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                    <button
                        onClick={handleDirections}
                        className="flex flex-col items-center justify-center gap-1.5 p-2 bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-xl transition-colors group"
                    >
                        <MdDirections className="text-blue-500 text-xl group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{isAr ? "الاتجاهات" : "Route"}</span>
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); /* Call Link */ }}
                        className="flex flex-col items-center justify-center gap-1.5 p-2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-xl transition-colors group"
                    >
                        <FaPhoneAlt className="text-slate-600 dark:text-slate-400 text-lg group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{isAr ? "اتصال" : "Call"}</span>
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); /* WhatsApp Link */ }}
                        className="flex flex-col items-center justify-center gap-1.5 p-2 bg-green-50/80 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-xl transition-colors group"
                    >
                        <FaWhatsapp className="text-green-500 text-xl group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{isAr ? "واتساب" : "WhatsApp"}</span>
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); /* Order Link */ }}
                        className="flex flex-col items-center justify-center gap-1.5 p-2 bg-orange-50/80 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 rounded-xl transition-colors group"
                    >
                        <MdShoppingCart className="text-orange-500 text-xl group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{isAr ? "اطلب" : "Order"}</span>
                    </button>
                </div>

                {hasActiveCampaign && (
                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-lg">إعلان ممول</span>
                        <div className="bg-gradient-to-br from-[#D4AF37] to-[#B8860B] text-white font-black flex items-center gap-1.5 px-3 py-1.5 rounded-xl shadow-md shadow-[#D4AF37]/20">
                            <span className="text-base">+{rewardPoints}</span>
                            <span className="text-[10px] uppercase">{isAr ? "نقطة" : "Pts"}</span>
                        </div>
                    </div>
                )}
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
