"use client";

import { useEffect, useState } from "react";
import { MdGetApp } from "react-icons/md";

const PWAInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // نتأكد إن التطبيق مش متسطب أصلاً
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
    }

    // نكتشف لو الموبايل آيفون
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // نلقط حدث التثبيت للأندرويد
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!isMounted || isStandalone) return null;

  const handleInstall = async () => {
    if (deferredPrompt) {
      // لو أندرويد وجاهز، نظهرله رسالة التثبيت الرسمية
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      // لو آيفون، نديله التعليمات
      alert("لتثبيت SAFY على الآيفون: اضغط على زر 'المشاركة' (Share) أسفل الشاشة، واختار 'Add to Home Screen'.");
    } else {
      // لو متصفح تاني
      alert("للتثبيت: افتح إعدادات المتصفح واختار 'Install App' أو 'Add to Home Screen'.");
    }
  };

  return (
    <div className="fixed bottom-24 left-0 right-0 z-[100] flex justify-center px-4 animate-in slide-in-from-bottom duration-500 pointer-events-none">
      <button
        onClick={handleInstall}
        className="pointer-events-auto bg-gradient-to-r from-[#D4AF37] to-[#B4941F] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold active:scale-95 transition-transform border border-white/20"
      >
        <MdGetApp size={24} />
        تثبيت تطبيق SAFY
      </button>
    </div>
  );
};

export default PWAInstallButton;