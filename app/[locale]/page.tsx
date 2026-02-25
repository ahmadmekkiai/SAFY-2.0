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
import InterestSelection from "@/components/InterestSelection";
import { type AdCampaign } from "@/lib/mockCampaigns";
import SplashScreen from "@/components/SplashScreen";

export const dynamic = 'force-dynamic';

export default function Home() {
    const [showInterestSelection, setShowInterestSelection] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>("for-you");
    const [loading, setLoading] = useState(true);

    // Splash screen state
    const [showSplash, setShowSplash] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);

    // Favorites state — lifted here so ForYouTab and FavoritesTab share it
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
    const [allCampaigns, setAllCampaigns] = useState<AdCampaign[]>([]);

    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string || 'en';
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

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
            if (!session) {
                router.push(`/${locale}/auth`);
            } else {
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, [router, supabase, locale]);

    useEffect(() => {
        const fadeTimer = setTimeout(() => setIsFadingOut(true), 2000);
        const removeTimer = setTimeout(() => setShowSplash(false), 2500);
        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };
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

    let content;
    if (loading) {
        content = (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full" />
            </div>
        );
    } else if (showInterestSelection) {
        content = <InterestSelection onComplete={() => setShowInterestSelection(false)} />;
    } else {
        content = (
            <div className="flex flex-col h-screen bg-gray-50 dark:bg-slate-900">
                {/* Tab Content */}
                <ForYouTab
                    isActive={activeTab === "for-you"}
                    onSavedChange={handleSavedChange}
                />
                <SuggestedTab isActive={activeTab === "suggested"} />
                <HotDealsTab isActive={activeTab === "hot-deals"} />
                <TasksTab isActive={activeTab === "tasks"} />
                <WalletTab isActive={activeTab === "wallet"} />
                <FavoritesTab
                    isActive={activeTab === "favorites"}
                    savedIds={savedIds}
                    campaigns={allCampaigns}
                    onToggleSave={handleToggleSave}
                />
                <ProfileTab isActive={activeTab === "profile"} />

                {/* Bottom Navigation */}
                <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
        );
    }

    return (
        <>
            {showSplash && (
                <div
                    className={`fixed inset-0 z-[200] transition-opacity duration-500 ease-in-out ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
                        }`}
                >
                    <SplashScreen />
                </div>
            )}
            {content}
        </>
    );
}
