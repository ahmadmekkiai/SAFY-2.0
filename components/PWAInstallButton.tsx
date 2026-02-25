"use client";

import { useEffect, useState } from "react";
import { MdGetApp } from "react-icons/md"; // تأكد إنك مثبت مكتبة react-icons

const PWAInstallButton = () => {
  const [promptInstall, setPromptInstall] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setPromptInstall(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 flex justify-center px-4 animate-in slide-in-from-bottom duration-500">
      <button
        onClick={handleInstallClick}
        className="bg-gradient-to-r from-[#D4AF37] to-[#B4941F] text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 font-semibold active:scale-95 transition-transform"
      >
        <MdGetApp size={24} />
        تثبيت تطبيق SAFY
      </button>
    </div>
  );
};

export default PWAInstallButton;