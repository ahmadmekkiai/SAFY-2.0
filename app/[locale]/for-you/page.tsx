"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import BottomNav, { TabType } from "@/components/BottomNav";
import ForYouTab from "@/components/tabs/ForYouTab";
import SuggestedTab from "@/components/tabs/SuggestedTab";
import HotDealsTab from "@/components/tabs/HotDealsTab";
import TasksTab from "@/components/tabs/TasksTab";
import WalletTab from "@/components/tabs/WalletTab";
import ProfileTab from "@/components/tabs/ProfileTab";
import FavoritesTab from "@/components/tabs/FavoritesTab";
import LeaderboardTab from "@/components/tabs/LeaderboardTab";
import InterestSelection from "@/components/InterestSelection";
import SplashScreen from "@/components/SplashScreen";
import { UnifiedFeedItem } from "@/types/app";

export default function ForYouPage() {
    const [showInterestSelection, setShowInterestSelection] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>("for-you");
    const [loading, setLoading] = useState(true);
    const [showSplash, setShowSplash] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);

    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
    const [allCampaigns, setAllCampaigns] = useState<UnifiedFeedItem[]>([]);

    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;
    const supabase = createClient();

    useEffect(() => {
        const fadeTimer = setTimeout(() => setIsFadingOut(true), 4000);
        const removeTimer = setTimeout(() => setShowSplash(false), 4500);
        return () => { clearTimeout(fadeTimer); clearTimeout(removeTimer); };
    }, []);

    const handleSavedChange = useCallback((ids: Set<string>, campaigns: UnifiedFeedItem[]) => {
        // نحدث قائمة الإعلانات المتاحة كلها
        setAllCampaigns(campaigns);
    }, []);

    const handleToggleSave = useCallback((item: UnifiedFeedItem) => {
        setSavedIds(prev => {
            const next = new Set(prev);
            const id = item.place.id;
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }, []);

    if (showInterestSelection) return <InterestSelection onComplete={() => setShowInterestSelection(false)} />;

    return (
        <>
            {showSplash && (
                <div className={`fixed inset-0 z-[200] transition-opacity duration-500 ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <SplashScreen />
                </div>
            )}

            <div className="flex flex-col h-screen bg-gray-50 dark:bg-slate-900 overflow-hidden">
                <div className="flex-1 relative overflow-hidden">
                    <ForYouTab isActive={activeTab === "for-you"} onSavedChange={handleSavedChange as any} />
                    <TasksTab isActive={activeTab === "tasks"} />
                    <WalletTab isActive={activeTab === "wallet"} />
                    <FavoritesTab isActive={activeTab === "favorites"} savedIds={savedIds} campaigns={allCampaigns as any} onToggleSave={handleToggleSave as any} />
                    <ProfileTab isActive={activeTab === "profile"} />
                </div>

                <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
        </>
    );
}