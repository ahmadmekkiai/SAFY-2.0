"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaCheckCircle, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { MdLocationOn, MdRestaurantMenu } from "react-icons/md";
import { useLocale } from "next-intl";

export default function AdCard(props: any) {
  const locale = useLocale();
  const isAr = locale === "ar";

  // 1. مستخرج البيانات الهجومي (بيجيب الداتا مهما كان مكانها أو اسمها)
  const data = props.ad || props.item || props.data || props;
  
  const title = data.title || data.name || data.advertiser || data.restaurantName || (isAr ? "جاري التحميل..." : "Loading...");
  const imageUrl = data.imageUrl || data.image_url || data.image || data.logo || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=500";
  const reward = data.reward || data.points || data.rewardPoints || data.reward_amount || data.rewardAmount || 0;
  const neighborhood = data.neighborhood || data.location || data.category || data.address || (isAr ? "حي الخليج" : "Al Khaleej");
  const distance = data.distance || data.dist || "0";
  const id = data.id || Math.random().toString();

  const [timeLeft, setTimeLeft] = useState(30);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [likeStatus, setLikeStatus] = useState<"like" | "dislike" | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  // 2. السحر هنا: تقليص منطقة التفعيل لخط وهمي في منتصف الشاشة بالضبط (عشان كارت واحد بس اللي يعد)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      { 
        root: null,
        // -45% من فوق و -45% من تحت بيسيب 10% بس في نص الشاشة، مستحيل كارتين يلمسوها مع بعض
        rootMargin: "-45% 0px -45% 0px", 
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

  // 3. تشغيل العداد
  useEffect(() => {
    let timerId: NodeJS.Timeout;

    // العداد يشتغل بس لو الكارت Active وما خلصش
    if (isActive && timeLeft > 0 && !isCompleted) {
      timerId = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (isActive && timeLeft === 0 && !isCompleted) {
      setIsCompleted(true);
      setShowOverlay(true);
      
      // نبعت النقاط للمحفظة
      if (typeof props.onRewardEarned === 'function') {
        props.onRewardEarned(id, reward);
      } else if (typeof data.onRewardEarned === 'function') {
        data.onRewardEarned(id, reward);
      }

      // نخفي رسالة الإنجاز بعد ثانيتين
      setTimeout(() => {
        setShowOverlay(false);
      }, 2000);
    }

    return () => clearTimeout(timerId);
  }, [isActive, timeLeft, isCompleted, id, reward, props, data]);

  const progressPercentage = ((30 - timeLeft) / 30) * 100;

  return (
    <div ref={cardRef} className={`relative bg-white rounded-2xl shadow-sm border overflow-hidden mb-4 transition-all duration-300 ${isActive ? 'border-[#D4AF37] scale-[1.02] shadow-md' : 'border-gray-100 scale-100'}`}>
      
      {/* صورة الإعلان */}
      <div className="relative h-48 w-full bg-gray-200">
        <Image src={imageUrl} alt={title} fill className="object-cover" unoptimized />
        
        {/* شريط التقدم (السلايدر) */}
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
          <span className="bg-gray-50 text-gray-600 border border-gray-100 text-xs px-2 py-1 rounded-md font-bold whitespace-nowrap shadow-sm">
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
            <span>+{reward}</span>
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
            {isAr ? `تم إضافة ${reward} نقطة لرصيدك` : `Added ${reward} points to your wallet`}
          </p>
        </div>
      )}
    </div>
  );
}