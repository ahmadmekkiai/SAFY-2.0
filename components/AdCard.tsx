"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaHeart, FaRegHeart, FaCheckCircle } from "react-icons/fa";
import { MdLocationOn, MdRestaurantMenu } from "react-icons/md";

// دي البيانات التجريبية اللي بياخدها الكارت (تقدر تعدلها حسب الداتا بيز عندك)
interface AdCardProps {
  id: string;
  title: string;
  neighborhood: string; // اسم الحي
  distance: string;
  imageUrl: string;
  rewardPoints: number;
  onRewardEarned?: (points: number) => void; // دالة تتنفذ لما العداد يخلص
}

export default function AdCard({
  id,
  title,
  neighborhood = "حي السليمانية", // قيمة افتراضية للتجربة
  distance,
  imageUrl,
  rewardPoints,
  onRewardEarned,
}: AdCardProps) {
  const [timeLeft, setTimeLeft] = useState(30); // العداد 30 ثانية
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // تشغيل العداد
  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && !isCompleted) {
      setIsCompleted(true);
      if (onRewardEarned) {
        onRewardEarned(rewardPoints); // تحديث النقاط في البروفايل
      }
    }
  }, [timeLeft, isCompleted, onRewardEarned, rewardPoints]);

  // حساب نسبة شريط التقدم
  const progressPercentage = ((30 - timeLeft) / 30) * 100;

  return (
    <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4 transition-transform active:scale-[0.98]">
      
      {/* صورة الإعلان */}
      <div className="relative h-48 w-full bg-gray-200">
        <Image src={imageUrl} alt={title} fill className="object-cover" />
        
        {/* شريط التقدم (السلايدر) فوق الصورة */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-black/20">
          <div 
            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* بادج الثواني المتبقية أو علامة الصح */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          {isCompleted ? (
            <span className="text-[#D4AF37]">مكتمل ✓</span>
          ) : (
            <span>{timeLeft} ث</span>
          )}
        </div>

        {/* زر المفضلة (القلب) */}
        <button 
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 left-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm text-red-500 transition-all active:scale-90"
        >
          {isFavorite ? <FaHeart size={18} /> : <FaRegHeart size={18} className="text-gray-600" />}
        </button>
      </div>

      {/* تفاصيل الكارت */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-gray-900 leading-tight">{title}</h3>
            {/* اسم الحي بشكل أنيق تحت الاسم */}
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <MdLocationOn className="text-[#D4AF37]" size={16} />
              {neighborhood}
            </p>
          </div>
          {/* المسافة في بادج منفصل */}
          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md font-medium whitespace-nowrap">
            {distance} كم
          </span>
        </div>

        {/* أزرار التفاعل (المنيو) */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <button className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-[#D4AF37] transition-colors">
            <MdRestaurantMenu size={18} />
            المنيو
          </button>
          
          <div className="text-[#D4AF37] font-bold flex items-center gap-1">
            <span>+{rewardPoints}</span>
            <span className="text-xs">نقطة</span>
          </div>
        </div>
      </div>

      {/* الأنيميشن الاحتفالي اللي بيغطي الكارت لما يخلص */}
      {isCompleted && (
        <div className="absolute inset-0 z-10 bg-black/80 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
          <FaCheckCircle className="text-[#D4AF37] text-5xl mb-3 animate-bounce" />
          <h2 className="text-white font-bold text-xl mb-1">عاش جداً!</h2>
          <p className="text-gray-200 text-sm">تم إضافة {rewardPoints} نقطة لرصيدك</p>
          <button 
            onClick={() => {/* ممكن هنا تبرمجها تفتح تفاصيل المطعم أو تخفي الـ Overlay */}}
            className="mt-4 bg-[#D4AF37] text-white px-6 py-2 rounded-full font-semibold text-sm active:scale-95"
          >
            عرض التفاصيل
          </button>
        </div>
      )}
    </div>
  );
}