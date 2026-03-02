"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaCheckCircle, FaHeart, FaRegHeart, FaPhoneAlt, FaWhatsapp, FaArrowRight, FaArrowLeft, FaStar } from "react-icons/fa";
import { MdLocationOn, MdShoppingCart, MdDirections, MdShare } from "react-icons/md";
import { useLocale } from "next-intl";
import { mockUnifiedFeed } from "@/lib/mockLocalData";
import { UnifiedFeedItem } from "@/types/app";
import { addPoints } from "@/app/actions/points";
import { createClient } from "@/lib/supabase/client";

export default function PlaceDetailsPage({ params }: { params: { id: string, locale: string } }) {
    const locale = useLocale();
    const router = useRouter();
    const isAr = locale === "ar";
    const supabase = createClient();

    const [item, setItem] = useState<UnifiedFeedItem | null | undefined>(null);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    // Track intersection for the timer
    const [isActive, setIsActive] = useState(false);
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) setUserId(session.user.id);
        };
        fetchUser();

        // Load item data
        const found = mockUnifiedFeed.find(feed => feed.place.id === params.id);
        setItem(found || null);

        // Timeout to stop infinite loader if it fails
        const t = setTimeout(() => {
            if (!found) setItem(undefined);
        }, 1000);
        return () => clearTimeout(t);
    }, [params.id, supabase]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsActive(entry.isIntersecting),
            { threshold: 0.5 }
        );
        if (heroRef.current) observer.observe(heroRef.current);
        return () => { if (heroRef.current) observer.unobserve(heroRef.current); };
    }, []);

    useEffect(() => {
        if (!item || !item.campaign || item.campaign.status !== "active") return;

        let timerId: NodeJS.Timeout;
        if (isActive && timeLeft > 0 && !isCompleted) {
            timerId = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
        } else if (isActive && timeLeft === 0 && !isCompleted) {
            setIsCompleted(true);
            setShowOverlay(true);

            // Earn points using existing actions logic
            if (userId) {
                // adding SAR equivalent - CPC is in "sar" format in old DB? Wait, old DB assumed CPC * 10 was points, let's just add directly
                // addPoints takes SAR. 1 SAR = 200 points. If cpc_value = 10, then it's directly the reward value. Let's just say 10 points = 0.05 SAR.
                const sarValue = item.campaign.cpc_value / 200;
                addPoints(userId, sarValue);
            }

            setTimeout(() => setShowOverlay(false), 2500);
        }
        return () => clearTimeout(timerId);
    }, [isActive, timeLeft, isCompleted, item, userId]);

    if (item === null) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-8">
                <div className="animate-spin w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400 font-bold">{isAr ? "جاري تحميل تفاصيل المكان..." : "Loading place details..."}</p>
            </div>
        );
    }

    if (item === undefined) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-8 text-center" dir={isAr ? "rtl" : "ltr"}>
                <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6 text-4xl">!</div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{isAr ? "المكان غير موجود" : "Place Not Found"}</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8">{isAr ? "عذراً، لم نتمكن من العثور على المكان المطلوب." : "Sorry, we couldn't find the requested place."}</p>
                <button
                    onClick={() => router.back()}
                    className="px-6 py-3 bg-[#D4AF37] text-white rounded-xl font-bold hover:bg-[#B8860B] transition-colors"
                >
                    {isAr ? "الرجوع للسابقة" : "Go Back"}
                </button>
            </div>
        );
    }

    const { place, campaign } = item;
    const hasActiveCampaign = !!campaign && campaign.status === "active";
    const rewardPoints = campaign?.cpc_value || 0;
    const progressPercentage = ((30 - timeLeft) / 30) * 100;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24" dir={isAr ? "rtl" : "ltr"}>
            {/* Nav Header (Floating) */}
            <div className="fixed top-0 inset-x-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                    {isAr ? <FaArrowRight /> : <FaArrowLeft />}
                </button>
                <div className="flex items-center gap-3">
                    <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                        <MdShare className="text-xl" />
                    </button>
                    <button
                        onClick={() => setIsSaved(!isSaved)}
                        className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                        {isSaved ? <FaHeart className="text-red-500 text-xl" /> : <FaRegHeart className="text-xl" />}
                    </button>
                </div>
            </div>

            {/* Hero Image & Campaign Timer */}
            <div ref={heroRef} className="relative w-full h-80 sm:h-96 bg-gray-200 dark:bg-slate-800">
                <Image src={place.cover_image || place.logo || ''} alt={place.name} fill className="object-cover" unoptimized priority />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

                {hasActiveCampaign && (
                    <div className="absolute top-0 left-0 right-0 h-2 bg-black/20 z-10">
                        <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] transition-all duration-1000 ease-linear shadow-[0_0_12px_#D4AF37]" style={{ width: `${progressPercentage}%` }} />
                    </div>
                )}

                {hasActiveCampaign && (
                    <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10">
                        <div className="bg-black/60 backdrop-blur-md border border-[#D4AF37]/30 text-white px-4 py-2 rounded-2xl flex flex-col items-center">
                            {isCompleted ? (
                                <span className="text-[#D4AF37] flex items-center gap-2 font-black"><FaCheckCircle className="text-xl" /> {isAr ? "اكتمل المشاهدة" : "Viewing Completed"}</span>
                            ) : (
                                <>
                                    <span className="text-sm text-gray-300 font-bold">{isAr ? "الوقت المتبقي" : "Time Left"}</span>
                                    <span className={`text-2xl font-black ${isActive ? "text-[#D4AF37] animate-pulse" : "text-white"}`}>{timeLeft}s</span>
                                </>
                            )}
                        </div>
                        <div className="bg-gradient-to-br from-[#D4AF37] to-[#B8860B] text-white font-black flex flex-col items-center justify-center px-4 py-2 rounded-2xl shadow-xl shadow-[#D4AF37]/40 ring-2 ring-white/20">
                            <span className="text-sm font-bold opacity-90">{isAr ? "المكافأة" : "Reward"}</span>
                            <span className="text-2xl pt-1">+{rewardPoints} <span className="text-xs font-normal">{isAr ? "نقطة" : "Pts"}</span></span>
                        </div>
                    </div>
                )}
            </div>

            {/* Content Container */}
            <div className="relative -mt-6 bg-slate-50 dark:bg-slate-900 rounded-t-3xl pt-8 px-5">

                {/* Headers */}
                <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1 w-2/3">
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{place.name}</h1>
                        <p className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1">
                            <MdLocationOn className="text-[#D4AF37] text-lg" /> {place.category}
                        </p>
                    </div>
                    {place.rating && (
                        <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
                            <FaStar /> <span className="text-lg">{place.rating}</span>
                        </div>
                    )}
                </div>

                {/* Offer Details if AD */}
                {hasActiveCampaign && (
                    <div className="my-6 p-4 rounded-2xl bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20 flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#D4AF37] to-yellow-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#D4AF37]/30">
                            <span className="text-xl font-black">{campaign?.discount_percentage}%</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{isAr ? "خصم حصري على قائمة الطلبات" : "Exclusive Discount on Menu"}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{isAr ? "استخدم التطبيق للاستفادة من الخصم المتاح." : "Use the app to benefit from this offer."}</p>
                        </div>
                    </div>
                )}

                {/* Description Body */}
                <div className="mb-6 space-y-2">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{isAr ? "عن المكان" : "About"}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                        {isAr ? `تفضل بزيارة ${place.name} وتذوق أفضل أطباق ${place.category} مع عروضنا الخاصة والمميزة.` : `Visit ${place.name} and taste the best ${place.category} dishes with our special offers.`}
                        {" "}
                        لكن يجب استيفاء شروط الخصم. هذا النص تجريبي ويوضح مساحة الوصف الخاصة بكل مطعم في التطبيق. يمكن للمستخدم قراءة التفاصيل ومعرفة الأوقات المتاحة.
                    </p>
                </div>

                {/* 4 External Action Buttons Grid */}
                <div className="grid grid-cols-4 gap-3 mt-4 mb-10">
                    <button className="flex flex-col items-center justify-center gap-2 p-3 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 rounded-2xl transition-all group">
                        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white text-blue-500 transition-colors">
                            <MdDirections className="text-2xl" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{isAr ? "الاتجاهات" : "Route"}</span>
                    </button>

                    <button className="flex flex-col items-center justify-center gap-2 p-3 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-700 rounded-2xl transition-all group">
                        <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white text-green-500 transition-colors">
                            <FaWhatsapp className="text-2xl" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{isAr ? "واتساب" : "WhatsApp"}</span>
                    </button>

                    <button className="flex flex-col items-center justify-center gap-2 p-3 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-2xl transition-all group">
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-slate-500 group-hover:text-white text-slate-600 dark:text-slate-400 transition-colors">
                            <FaPhoneAlt className="text-xl" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{isAr ? "اتصال" : "Call"}</span>
                    </button>

                    <button className="flex flex-col items-center justify-center gap-2 p-3 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-700 rounded-2xl transition-all group">
                        <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white text-orange-500 transition-colors">
                            <MdShoppingCart className="text-2xl" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{isAr ? "اطلب" : "Order"}</span>
                    </button>
                </div>
            </div>

            {/* Campaign Success Overlay Modal */}
            {hasActiveCampaign && showOverlay && (
                <div className="fixed inset-0 z-[100] bg-[#D4AF37]/95 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 backdrop-blur-md">
                    <div className="bg-white p-6 rounded-full shadow-2xl mb-4 animate-bounce"><FaCheckCircle className="text-[#D4AF37] text-6xl" /></div>
                    <h2 className="text-white font-black text-3xl mb-1">{isAr ? "كفو عليك!" : "Awesome!"}</h2>
                    <p className="text-white/90 text-lg font-bold">{isAr ? `كسبت ${rewardPoints} نقطة` : `You earned ${rewardPoints} Pts`}</p>
                </div>
            )}
        </div>
    );
}
