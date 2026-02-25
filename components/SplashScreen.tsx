"use client";

import Image from "next/image";

export default function SplashScreen() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 transition-all duration-700 opacity-100">
            {/* صورة الخلفية الجديدة اللي رفعتها على Supabase */}
            <Image
                src="https://azwmzhvzhsjuvbmsxqul.supabase.co/storage/v1/object/public/assets/SAFY%20BG%20splash.png"
                alt="SAFY Splash Background"
                fill
                className="object-cover"
                priority
                unoptimized
            />

            {/* طبقة تظليل خفيفة جداً فوق الخلفية عشان اللوجو والنص يبقوا واضحين */}
            <div className="absolute inset-0 bg-black/10"></div>

            {/* اللوجو بتاع SAFY */}
            <div className="relative w-48 h-48 mb-8 drop-shadow-2xl z-10 animate-pulse">
                <Image
                    src="https://azwmzhvzhsjuvbmsxqul.supabase.co/storage/v1/object/public/assets/SAFY%20icon.png"
                    alt="SAFY Logo"
                    fill
                    className="object-contain"
                    priority
                    unoptimized
                />
            </div>

            {/* نص التحميل */}
            <div className="relative z-10 text-white/90 text-sm font-semibold tracking-widest uppercase animate-pulse drop-shadow-md">
                جاري التحميل...
            </div>
        </div>
    );
}