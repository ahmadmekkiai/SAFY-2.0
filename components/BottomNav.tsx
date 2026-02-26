"use client";

import { motion } from "framer-motion";
import { Home, Sparkles, Flame, CheckSquare, User, Heart, Trophy } from "lucide-react";

// شيلنا الـ wallet من هنا
export type TabType = "for-you" | "suggested" | "hot-deals" | "tasks" | "favorites" | "profile" | "leaderboard";

interface BottomNavProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

const tabs = [
    { id: "for-you" as TabType, label: "For You", icon: Home },
    { id: "suggested" as TabType, label: "Suggested", icon: Sparkles },
    { id: "hot-deals" as TabType, label: "Hot Deals", icon: Flame },
    { id: "tasks" as TabType, label: "Tasks", icon: CheckSquare },
    { id: "leaderboard" as TabType, label: "Ranking", icon: Trophy },
    { id: "favorites" as TabType, label: "Saved", icon: Heart },
    { id: "profile" as TabType, label: "Profile", icon: User },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 safe-area-bottom">
            <div className="flex items-center justify-around h-16 px-1">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className="flex flex-col items-center justify-center flex-1 h-full relative"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            <div className="relative flex flex-col items-center gap-0.5">
                                <Icon
                                    className={`w-5 h-5 transition-colors ${isActive
                                            ? tab.id === "favorites" ? "fill-red-500 text-red-500" : "text-blue-600"
                                            : "text-gray-400"
                                        }`}
                                />
                                <span className={`text-[9px] font-medium transition-colors ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}>
                                    {tab.label}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}