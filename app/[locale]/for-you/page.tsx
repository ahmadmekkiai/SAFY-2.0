"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import BottomNav, { TabType } from "@/components/BottomNav";
import ForYouTab from "@/components/tabs/ForYouTab";
import SuggestedTab from "@/components/tabs/SuggestedTab";
import HotDealsTab from "@/components/tabs/HotDealsTab";
import TasksTab from "@/components/tabs/TasksTab";
import WalletTab from "@/components/tabs/WalletTab"; // تأكد إن الملف ده موجود في مساره
import ProfileTab from "@/components/tabs/ProfileTab";
import FavoritesTab from "@/components/tabs/FavoritesTab";
import LeaderboardTab from "@/components/tabs/LeaderboardTab";
import InterestSelection from "@/components/InterestSelection";
import SplashScreen from "@/components/SplashScreen";
import { type AdCampaign } from "@/lib/mockCampaigns";

export default function ForYouPage() {
    const [showInterestSelection, setShowInterestSelection] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>("for-you");
    const [loading, setLoading] = useState(true);
    const [showSplash, setShowSplash] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);
    
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
    const [allCampaigns, setAllCampaigns] = useState<AdCampaign[]>([]);

    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;
    const supabase = createClient();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push(`/${locale}/auth`);
            } else {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('interests')
                    .eq('id', session.user.id)
                    .single();
                if (!profile?.interests || profile.interests.length === 0) {
                    setShowInterestSelection(true);
                }
                setLoading(false);
            }
        };
        checkAuth();
    }, [router, locale, supabase]);

    useEffect(() => {
        const fadeTimer = setTimeout(() => setIsFadingOut(true), 4000); 
        const removeTimer = setTimeout(() => setShowSplash(false), 4500); 
        return () => { clearTimeout(fadeTimer); clearTimeout(removeTimer); };
    }, []);

    const handleSavedChange = useCallback((ids: Set<string>, campaigns: AdCampaign[]) => {
        setSavedIds(new Set(ids));
        setAllCampaigns(campaigns);
    }, []);

    const handleToggleSave = useCallback((campaign: AdCampaign) => {
        setSavedIds(prev => {
            const next = new Set(prev);
            next.has(campaign.id) ? next.delete(campaign.id) : next.add(campaign.id);
            return next;
        });
    }, []);

    if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full" /></div>;
    
    if (showInterestSelection) return <InterestSelection onComplete={() => setShowInterestSelection(false)} />;

    return (
        <>
            {showSplash && (
                <div className={`fixed inset-0 z-[200] transition-opacity duration-500 ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <SplashScreen />
                </div>
            )}
            
            <div className="flex flex-col h-screen bg-gray-50 dark:bg-slate-900">
                <ForYouTab isActive={activeTab === "for-you"} onSavedChange={handleSavedChange} />
                <SuggestedTab isActive={activeTab === "suggested"} />
                <HotDealsTab isActive={activeTab === "hot-deals"} />
                <TasksTab isActive={activeTab === "tasks"} />
                <LeaderboardTab isActive={activeTab === "leaderboard"} />
                <WalletTab isActive={activeTab === "wallet"} />
                <FavoritesTab isActive={activeTab === "favorites"} savedIds={savedIds} campaigns={allCampaigns} onToggleSave={handleToggleSave} />
                <ProfileTab isActive={activeTab === "profile"} />
                
                <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
        </>
    );
}