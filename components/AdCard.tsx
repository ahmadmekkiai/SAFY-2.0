"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaCheckCircle, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { MdLocationOn, MdRestaurantMenu } from "react-icons/md";
import { useLocale } from "next-intl"; // عشان نعرف لغة التطبيق الحالية

export default function AdCard(props: any) {
  // تحديد اللغة
  const locale = useLocale();
  const isAr = locale === "ar";

  // معالجة مرنة للبيانات عشان نتجنب اختفاء أي عنصر (بياخد أكتر من اسم محتمل للـ prop)
  const title = props.title || props.name || (isAr ? "اسم المطعم غير متوفر" : "Restaurant Name N/A");
  const imageUrl = props.imageUrl || props.image_url || props.image || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=500";
  const reward = props.reward || props.points || props.rewardPoints || 0;
  const neighborhood = props.neighborhood || props.location || (isAr ? "الحي غير محدد" : "Location N/A");
  const distance = props.distance || "0";
  const id = props.id;

  const [timeLeft, setTimeLeft] = useState(30);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false); // للتحكم في ظهور رسالة الإنجاز
  const [isActive, setIsActive] = useState(false); // عشان نعرف الكارت ده قدام الشاشة ولا لأ
  const [likeStatus, setLikeStatus] = useState<"like" | "dislike" | null>(null);

  // الريف ده هيمسك الكارت عشان نراقبه
  const cardRef = useRef<HTMLDivElement>(null);

  // تقنية مراقبة الكارت (هل هو ظاهر في الشاشة بنسبة 70% ولا لأ)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      { threshold: 0.7 } // الكارت لازم يكون ظاهر بنسبة 70% عشان يبدأ يعد
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  // تشغيل العداد فقط لو الكارت ظاهر (isActive)
  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (isActive && timeLeft > 0 && !isCompleted) {
      timerId = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && !isCompleted) {
      setIsCompleted(true);
      setShowOverlay(true); // إظهار رسالة النجاح
      
      if (props.onRewardEarned) {
        props.onRewardEarned(id, reward);
      }

      // إخفاء رسالة النجاح بعد ثانيتين والرجوع للكارت
      setTimeout(() => {
        setShowOverlay(false);
      }, 2000);
    }

    return () => clearTimeout(timerId);
  }, [isActive, timeLeft, isCompleted, id, reward, props]);

  const progressPercentage = ((30 - timeLeft) / 30) * 100;

  return (
    <div ref={cardRef} className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4 transition-transform active:scale-[0.98]">
      
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

        {/* بادج الثواني المتبقية أو علامة الصح */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10">
          {isCompleted ? (
            <span className="text-[#D4AF37]">{isAr ? "مكتمل ✓" : "Completed ✓"}</span>
          ) : (
            <span>{timeLeft} {isAr ? "ث" : "s"}</span>
          )}
        </div>
      </div>

      {/* تفاصيل الكارت */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-gray-900 leading-tight">{title}</h3>
            {/* اسم الحي */}
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <MdLocationOn className="text-[#D4AF37]" size={16} />
              {neighborhood}
            </p>
          </div>
          {/* المسافة */}
          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md font-medium whitespace-nowrap">
            {distance} {isAr ? "كم" : "km"}
          </span>
        </div>

        {/* أزرار التفاعل (المنيو، لايك، ديسلايك) والنقاط */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-[#D4AF37] transition-colors">
              <MdRestaurantMenu size={18} />
              {isAr ? "المنيو" : "Menu"}
            </button>
            
            {/* زر اللايك */}
            <button 
              onClick={() => setLikeStatus(likeStatus === "like" ? null : "like")}
              className={`transition-colors ${likeStatus === "like" ? "text-green-500" : "text-gray-400 hover:text-green-500"}`}
            >
              <FaThumbsUp size={18} />
            </button>

            {/* زر الديسلايك */}
            <button 
              onClick={() => setLikeStatus(likeStatus === "dislike" ? null : "dislike")}
              className={`transition-colors ${likeStatus === "dislike" ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
            >
              <FaThumbsDown size={18} />
            </button>
          </div>
          
          <div className="text-[#D4AF37] font-bold flex items-center gap-1">
            <span>+{reward}</span>
            <span className="text-xs">{isAr ? "نقطة" : "Pts"}</span>
          </div>
        </div>
      </div>

      {/* الأنيميشن الاحتفالي بيظهر ويختفي بعد ثانيتين */}
      {showOverlay && (
        <div className="absolute inset-0 z-20 bg-black/85 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
          <FaCheckCircle className="text-[#D4AF37] text-6xl mb-4 animate-bounce" />
          <h2 className="text-white font-bold text-2xl mb-2">
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