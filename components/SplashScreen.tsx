"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function SplashScreen() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="w-full h-full bg-[#D4AF37] flex flex-col items-center justify-center">
            {/* Logo — fades in on mount, then pulses */}
            <div
                className={`relative w-48 h-48 mb-8 drop-shadow-2xl transition-all duration-1000 ease-out flex items-center justify-center ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                    }`}
            >
                <div className="w-full h-full animate-pulse">
                    <Image
                        src="https://azwmzhvzhsjuvbmsxqul.supabase.co/storage/v1/object/public/assets/SAFY%20icon.png"
                        alt="SAFY Logo"
                        fill
                        className="object-contain"
                        priority
                        unoptimized
                    />
                </div>
            </div>

            {/* Loading label */}
            <p className={`absolute bottom-12 text-white/90 text-sm font-semibold tracking-widest uppercase transition-opacity duration-1000 delay-500 ${mounted ? 'opacity-100' : 'opacity-0'
                }`}>
                <span className="animate-pulse">Loading...</span>
            </p>
        </div>
    );
}
