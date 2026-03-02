"use client";

import { Home, Search, Flame, CheckSquare, Wallet, User, Heart, Trophy } from "lucide-react";

export type TabType = "for-you" | "tasks" | "wallet" | "profile" | "favorites";

interface BottomNavProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
    const tabs = [
        { id: "tasks", icon: CheckSquare, label: "مهام" },
        { id: "wallet", icon: Wallet, label: "المحفظة" },
        { id: "for-you", icon: Home, label: "الرئيسية" },
        { id: "favorites", icon: Heart, label: "المفضلة" },
        { id: "profile", icon: User, label: "حسابي" },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe-area-inset-bottom z-[150]">
            <div className="flex justify-around items-center h-16 max-w-xl mx-auto px-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id as TabType)}
                            className="flex flex-col items-center justify-center flex-1 transition-all duration-300 relative"
                        >
                            <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/30 scale-110 -translate-y-1' : 'text-slate-400'}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className={`text-[10px] mt-1 font-bold transition-all duration-300 ${isActive ? 'text-[#D4AF37] opacity-100' : 'text-slate-400 opacity-70'}`}>
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}