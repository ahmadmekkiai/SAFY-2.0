"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { addPoints } from "@/app/actions/points";
import {
    Wallet,
    Coins,
    TrendingUp,
    Gift,
    Trophy,
    Award,
    Medal,
    Zap,
    Users,
    Crown,
    Star
} from "lucide-react";

interface WalletTabProps {
    isActive: boolean;
}

interface LeaderboardUser {
    id: string;
    rank: number;
    name: string;
    avatarVal: string; // just for a gradient or initial
    method: string;
    dailyPoints: number;
    totalSar: number;
}

// Mock Leaderboard Data (20 users)
const MOCK_LEADERBOARD: LeaderboardUser[] = [
    { id: '1', rank: 1, name: "Mohammed Al-Saud", avatarVal: "MA", method: "Ads + Tasks ⚡", dailyPoints: 4500, totalSar: 2450 },
    { id: '2', rank: 2, name: "Fatima Al-Harbi", avatarVal: "FH", method: "Ads + Tasks ⚡", dailyPoints: 3800, totalSar: 2100 },
    { id: '3', rank: 3, name: "Abdullah Al-Qahtani", avatarVal: "AQ", method: "Ads + Tasks ⚡", dailyPoints: 3200, totalSar: 1850 },
    { id: '4', rank: 4, name: "Sarah Al-Amri", avatarVal: "SA", method: "Ads + Referral 🤝", dailyPoints: 2100, totalSar: 1200 },
    { id: '5', rank: 5, name: "Khalid Al-Ghamdi", avatarVal: "KG", method: "Ads Only 📺", dailyPoints: 1800, totalSar: 950 },
    { id: '6', rank: 6, name: "Noura Al-Rashid", avatarVal: "NR", method: "Ads + Referral 🤝", dailyPoints: 1650, totalSar: 880 },
    { id: '7', rank: 7, name: "Omar Bin Sultan", avatarVal: "OS", method: "Ads Only 📺", dailyPoints: 1500, totalSar: 720 },
    { id: '8', rank: 8, name: "Reem Al-Faisal", avatarVal: "RF", method: "Ads Only 📺", dailyPoints: 1400, totalSar: 690 },
    { id: '9', rank: 9, name: "Fahad Al-Dossari", avatarVal: "FD", method: "Ads + Tasks ⚡", dailyPoints: 1350, totalSar: 650 },
    { id: '10', rank: 10, name: "Layla Ahmed", avatarVal: "LA", method: "Ads Only 📺", dailyPoints: 1200, totalSar: 600 },
    { id: '11', rank: 11, name: "Yasser Al-Otaibi", avatarVal: "YO", method: "Ads Only 📺", dailyPoints: 950, totalSar: 450 },
    { id: '12', rank: 12, name: "Hassan Al-Shehri", avatarVal: "HS", method: "Ads Only 📺", dailyPoints: 850, totalSar: 400 },
    { id: '13', rank: 13, name: "Joud Al-Turki", avatarVal: "JT", method: "Ads Only 📺", dailyPoints: 800, totalSar: 380 },
    { id: '14', rank: 14, name: "Sultan Al-Malik", avatarVal: "SM", method: "Ads Only 📺", dailyPoints: 750, totalSar: 350 },
    { id: '15', rank: 15, name: "Hala Al-Zahrani", avatarVal: "HZ", method: "Ads Only 📺", dailyPoints: 700, totalSar: 320 },
    { id: '16', rank: 16, name: "Bandar Al-Nasser", avatarVal: "BN", method: "Ads Only 📺", dailyPoints: 650, totalSar: 300 },
    { id: '17', rank: 17, name: "Muna Al-Hassan", avatarVal: "MH", method: "Ads Only 📺", dailyPoints: 600, totalSar: 280 },
    { id: '18', rank: 18, name: "Waleed Al-Jaber", avatarVal: "WJ", method: "Ads Only 📺", dailyPoints: 550, totalSar: 250 },
    { id: '19', rank: 19, name: "Dana Al-Subaie", avatarVal: "DS", method: "Ads Only 📺", dailyPoints: 500, totalSar: 230 },
    { id: '20', rank: 20, name: "Rami Al-Khalid", avatarVal: "RK", method: "Ads Only 📺", dailyPoints: 450, totalSar: 200 }
];

export default function WalletTab({ isActive }: WalletTabProps) {
    const supabase = createClient();
    const [points, setPoints] = useState(0);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [showCoinAnimation, setShowCoinAnimation] = useState(false);
    const [recentPointsAdded, setRecentPointsAdded] = useState(0);

    useEffect(() => {
        if (isActive) {
            loadWalletData();
        }
    }, [isActive]);

    const loadWalletData = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            setUserId(session.user.id);
            const { data: profile } = await supabase
                .from('profiles')
                .select('points')
                .eq('id', session.user.id)
                .single();
            setPoints(profile?.points || 0);
        } catch (error) {
            console.error('Error loading wallet data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTestPoints = async () => {
        if (!userId) return;
        const result = await addPoints(userId, 1);
        if (result.success) {
            setRecentPointsAdded(result.pointsAdded || 0);
            setPoints(result.newBalance || 0);
            setShowCoinAnimation(true);
            setTimeout(() => {
                setShowCoinAnimation(false);
            }, 2000);
        }
    };

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500" />;
            case 2: return <Medal className="w-5 h-5 text-gray-400 fill-gray-400" />;
            case 3: return <Medal className="w-5 h-5 text-amber-700 fill-amber-700" />;
            default: return <span className="font-bold text-gray-400 w-5 text-center">{rank}</span>;
        }
    };

    if (!isActive) return null;

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center pb-20">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto pb-20 bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-blue-950">
            <div className="p-6 space-y-8">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Wallet className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        My Wallet
                    </h1>
                </div>

                {/* Points Balance Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative backdrop-blur-xl bg-gradient-to-br from-[#D4AF37]/20 to-yellow-600/20 rounded-3xl p-8 border border-[#D4AF37]/30 shadow-2xl overflow-hidden"
                >
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-600 rounded-full blur-3xl" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <Coins className="w-6 h-6 text-[#D4AF37]" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Total Points
                            </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <motion.span
                                key={points}
                                initial={{ scale: 1.2, color: "#D4AF37" }}
                                animate={{ scale: 1, color: "#D4AF37" }}
                                className="text-6xl font-black"
                            >
                                {points.toLocaleString()}
                            </motion.span>
                            <span className="text-2xl font-medium text-gray-600 dark:text-gray-400">
                                pts
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            1 SAR = 200 Points
                        </p>
                    </div>

                    <AnimatePresence>
                        {showCoinAnimation && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0, y: 0 }}
                                animate={{ opacity: 1, scale: 1, y: -100 }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            >
                                <div className="relative">
                                    <motion.div
                                        animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                                        transition={{ duration: 0.6, repeat: 1 }}
                                        className="w-24 h-24 rounded-full bg-gradient-to-br from-[#D4AF37] to-yellow-600 flex items-center justify-center shadow-2xl"
                                    >
                                        <Coins className="w-12 h-12 text-white" />
                                    </motion.div>
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                        <span className="text-2xl font-bold text-[#D4AF37]">+{recentPointsAdded} points</span>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Quick Actions */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 gap-4">
                    <button onClick={handleAddTestPoints} className="relative backdrop-blur-xl bg-white/40 dark:bg-white/5 rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-xl hover:bg-white/60 dark:hover:bg-white/10 transition-all group">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-bold text-gray-900 dark:text-white">Earn Points</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Complete tasks</p>
                            </div>
                        </div>
                    </button>
                    <button className="relative backdrop-blur-xl bg-white/40 dark:bg-white/5 rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-xl hover:bg-white/60 dark:hover:bg-white/10 transition-all group">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                                <Gift className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-bold text-gray-900 dark:text-white">Redeem</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Use your points</p>
                            </div>
                        </div>
                    </button>
                </motion.div>

                {/* 🏆 LEADERBOARD SECTION 🏆 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Trophy className="w-6 h-6 text-yellow-500" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top Earners (Today)</h2>
                    </div>

                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 shadow-xl overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 p-4 border-b border-gray-100 dark:border-gray-700 font-medium text-xs text-gray-500 dark:text-gray-400">
                            <div className="w-6 text-center">Rank</div>
                            <div>User</div>
                            <div className="hidden sm:block">Method</div>
                            <div className="text-right">Points / Total</div>
                        </div>

                        {/* List */}
                        <div className="max-h-[400px] overflow-y-auto">
                            {MOCK_LEADERBOARD.map((user) => (
                                <div
                                    key={user.id}
                                    className={`grid grid-cols-[auto_1fr_auto_auto] gap-4 p-4 items-center border-b border-gray-100 dark:border-gray-700/50 hover:bg-white/40 dark:hover:bg-white/5 transition-colors
                                        ${user.rank <= 3 ? 'bg-yellow-50/50 dark:bg-yellow-900/10' : ''}`}
                                >
                                    {/* Rank */}
                                    <div className="w-6 flex justify-center">
                                        {getRankIcon(user.rank)}
                                    </div>

                                    {/* User */}
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white
                                            ${user.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-yellow-200' :
                                                user.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                                                    user.rank === 3 ? 'bg-gradient-to-br from-amber-600 to-amber-800' :
                                                        'bg-blue-500'}`}
                                        >
                                            {user.avatarVal}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                                {user.name}
                                            </div>
                                            <div className="text-[10px] text-gray-500 sm:hidden">
                                                {user.method}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Method (Desktop) */}
                                    <div className="hidden sm:block">
                                        <span className={`text-xs px-2 py-1 rounded-full border
                                            ${user.rank <= 3
                                                ? 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300'
                                                : 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400'}`}
                                        >
                                            {user.method}
                                        </span>
                                    </div>

                                    {/* Points / SAR */}
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-[#D4AF37]">
                                            {user.dailyPoints.toLocaleString()} pts
                                        </div>
                                        <div className="text-[10px] text-gray-400">
                                            {user.totalSar.toLocaleString()} SAR
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
