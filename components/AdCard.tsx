"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaCheckCircle, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { MdLocationOn, MdRestaurantMenu } from "react-icons/md";
import { useLocale } from "next-intl";

interface AdCardProps {
  id: string;
  title: string;
  neighborhood?: string;
  distance?: string;
  imageUrl: string;
  rewardPoints?: number;
  onRewardEarned?: (id: string, points: number) => void;
  // إضافة أي خصائص تانية ممكن تكون الصفحة الأم بتبعتها
  [key: string]: any;
}

export default function AdCard({
  id,
  title,
  neighborhood = "حي السليمانية",
  distance = "1.5",
  imageUrl,
  rewardPoints = 10,
  onRewardEarned,
  ...rest
}: AdCardProps) {
  const locale = useLocale();
  const isAr = locale === "ar";

  const [timeLeft, setTimeLeft] = useState(30);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [likeStatus, setLikeStatus] = useState<"like" | "dislike" | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  // التايمر الذكي: كارت واحد بس اللي بيعد
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      { 
        root: null,
        rootMargin: "-49% 0px -49% 0px", 
        threshold: 0
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (isActive && timeLeft > 0 && !isCompleted) {
      timerId = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (isActive && timeLeft === 0 && !isCompleted) {
      setIsCompleted(true);
      setShowOverlay(true);
      
      if (onRewardEarned) {
        onRewardEarned(id, rewardPoints);
      }

      setTimeout(() => {
        setShowOverlay(false);
      }, 2000);
    }

    return () => clearTimeout(timerId);
  }, [isActive, timeLeft, isCompleted, id, rewardPoints, onRewardEarned]);

  const progressPercentage = ((30 - timeLeft) / 30) * 100;

  return (
    <div ref={cardRef} className={`relative bg-white rounded-2xl shadow-sm border overflow-hidden mb-4 transition-all duration-300 ${isActive ? 'border-[#D4AF37] scale-[1.02] shadow-md ring-1 ring-[#D4AF37]/50' : 'border-gray-100 scale-100 opacity-90'}`}>
      
      {/* صورة الإعلان */}
      <div className="relative h-48 w-full bg-gray-200">
        <Image src={imageUrl} alt={title || "صورة المطعم"} fill className="object-cover" unoptimized />
        
        {/* شريط التقدم */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-black/20">
          <div 
            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* بادج الثواني */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10 shadow-sm">
          {isCompleted ? (
            <span className="text-[#D4AF37]">{isAr ? "مكتمل ✓" : "Completed ✓"}</span>
          ) : (
            <span className={isActive ? "text-[#D4AF37] animate-pulse" : ""}>
              {timeLeft} {isAr ? "ث" : "s"}
            </span>
          )}
        </div>
      </div>

      {/* تفاصيل الكارت */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-gray-900 leading-tight">{title}</h3>
            {/* اسم الحي */}
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1 font-medium">
              <MdLocationOn className="text-[#D4AF37]" size={16} />
              {neighborhood}
            </p>
          </div>
          {/* المسافة */}
          <span className="bg-gray-50 text-gray-600 border border-gray-100 text-xs px-2 py-1 rounded-md font-bold whitespace-nowrap shadow-sm h-fit mt-1">
            {distance} {isAr ? "كم" : "km"}
          </span>
        </div>

        {/* أزرار التفاعل والنقاط */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-5">
            <button className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-[#D4AF37] transition-colors active:scale-90">
              <MdRestaurantMenu size={18} />
              {isAr ? "المنيو" : "Menu"}
            </button>
            
            <button 
              onClick={() => setLikeStatus(likeStatus === "like" ? null : "like")}
              className={`transition-colors active:scale-90 ${likeStatus === "like" ? "text-green-500 drop-shadow-sm" : "text-gray-400 hover:text-green-500"}`}
            >
              <FaThumbsUp size={18} />
            </button>

            <button 
              onClick={() => setLikeStatus(likeStatus === "dislike" ? null : "dislike")}
              className={`transition-colors active:scale-90 ${likeStatus === "dislike" ? "text-red-500 drop-shadow-sm" : "text-gray-400 hover:text-red-500"}`}
            >
              <FaThumbsDown size={18} />
            </button>
          </div>
          
          <div className="bg-[#f9f6ef] border border-[#D4AF37]/30 text-[#D4AF37] font-extrabold flex items-center gap-1 px-3 py-1 rounded-full shadow-sm">
            <span>+{rewardPoints}</span>
            <span className="text-xs">{isAr ? "نقطة" : "Pts"}</span>
          </div>
        </div>
      </div>

      {/* الأنيميشن الاحتفالي */}
      {showOverlay && (
        <div className="absolute inset-0 z-20 bg-black/85 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300 backdrop-blur-sm">
          <FaCheckCircle className="text-[#D4AF37] text-6xl mb-4 animate-bounce drop-shadow-lg" />
          <h2 className="text-white font-bold text-2xl mb-2 drop-shadow-md">
            {isAr ? "عاش جداً!" : "Great Job!"}
          </h2>
          <p className="text-gray-200 text-base font-medium">
            {isAr ? `تم إضافة ${rewardPoints} نقطة لرصيدك` : `Added ${rewardPoints} points to your wallet`}
          </p>
        </div>
      )}
    </div>
  );
}