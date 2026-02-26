"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface LeaderboardUser {
    id: string;
    full_name: string;
    points: number;
    isCurrentUser?: boolean;
}

export default function LeaderboardTab({ isActive }: { isActive: boolean }) {
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isActive) return;

        const fetchLeaderboard = async () => {
            const supabase = createClient();
            
            // 1. هنجيب بيانات المستخدم الحالي
            const { data: { session } } = await supabase.auth.getSession();
            let currentUserData: any = null;
            if (session) {
                const { data } = await supabase
                    .from('profiles')
                    .select('id, full_name, points')
                    .eq('id', session.user.id)
                    .single();
                currentUserData = data;
            }

            // 2. مستخدمين وهميين (عشان الزحمة والتنافس)
            const mockUsers: LeaderboardUser[] = [
                { id: 'm1', full_name: 'فهد القحطاني', points: 4500 },
                { id: 'm2', full_name: 'محمد علي', points: 3850 },
                { id: 'm3', full_name: 'سارة خالد', points: 3100 },
                { id: 'm4', full_name: 'إبراهيم حسن', points: 2900 },
                { id: 'm5', full_name: 'ليلى محمود', points: 2100 },
                { id: 'm6', full_name: 'عبدالله العتيبي', points: 1500 },
                { id: 'm7', full_name: 'ياسر جلال', points: 950 },
            ];

            // 3. دمج المستخدم الحقيقي مع الوهميين وترتيبهم
            let allUsers = [...mockUsers];
            if (currentUserData) {
                allUsers.push({
                    id: currentUserData.id,
                    full_name: currentUserData.full_name || 'أنت',
                    points: currentUserData.points || 0,
                    isCurrentUser: true
                });
            }

            // ترتيب تنازلي حسب النقاط
            allUsers.sort((a, b) => b.points - a.points);
            setUsers(allUsers);
            setLoading(false);
        };

        fetchLeaderboard();
    }, [isActive]);

    if (!isActive) return null;

    return (
        <div className="h-full overflow-y-auto pb-24 px-4 bg-slate-50 dark:bg-slate-900" dir="rtl">
            <div className="max-w-xl mx-auto pt-8 space-y-6">
                
                {/* الهيدر */}
                <div className="text-center space-y-2">
                    <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto"
                    >
                        <Trophy className="w-8 h-8 text-[#D4AF37]" />
                    </motion.div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">لوحة الشرف</h1>
                    <p className="text-sm text-slate-500">أفضل مجمعي النقاط في SAFY</p>
                </div>

                {/* القائمة */}
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                    {loading ? (
                        <div className="p-10 text-center text-slate-400">جاري حساب المراكز...</div>
                    ) : (
                        <div className="divide-y divide-slate-50 dark:divide-slate-700">
                            {users.map((user, index) => {
                                const rank = index + 1;
                                return (
                                    <motion.div 
                                        key={user.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`p-5 flex items-center gap-4 ${user.isCurrentUser ? 'bg-[#D4AF37]/5 dark:bg-[#D4AF37]/10' : ''}`}
                                    >
                                        {/* المركز */}
                                        <div className="w-8 flex justify-center">
                                            {rank === 1 && <Crown className="w-6 h-6 text-[#D4AF37]" />}
                                            {rank === 2 && <Medal className="w-6 h-6 text-slate-400" />}
                                            {rank === 3 && <Medal className="w-6 h-6 text-amber-600" />}
                                            {rank > 3 && <span className="text-slate-400 font-bold">{rank}</span>}
                                        </div>

                                        {/* الصورة الشخصية */}
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg
                                            ${user.isCurrentUser ? 'bg-[#D4AF37] text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}
                                        >
                                            {user.full_name.charAt(0).toUpperCase()}
                                        </div>

                                        {/* الاسم */}
                                        <div className="flex-1">
                                            <h3 className={`font-bold text-sm ${user.isCurrentUser ? 'text-[#D4AF37]' : 'text-slate-900 dark:text-white'}`}>
                                                {user.full_name}
                                                {user.isCurrentUser && <span className="mr-2 text-[10px] bg-[#D4AF37] text-white px-2 py-0.5 rounded-full">أنت</span>}
                                            </h3>
                                            <div className="flex items-center gap-1 text-[11px] text-slate-400">
                                                <TrendingUp className="w-3 h-3" />
                                                <span>متفاعل اليوم</span>
                                            </div>
                                        </div>

                                        {/* النقاط */}
                                        <div className="text-left">
                                            <div className="font-black text-slate-900 dark:text-white">{user.points.toLocaleString()}</div>
                                            <div className="text-[10px] text-slate-400 uppercase tracking-tighter">نقطة</div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* نصيحة تحفيزية */}
                <div className="p-6 bg-blue-600 rounded-[2rem] text-white flex items-center gap-4 shadow-lg shadow-blue-600/20">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs font-medium leading-relaxed">
                        باقي لك 250 نقطة عشان تسبق الترتيب اللي فوقك! استمر في استكشاف العروض.
                    </p>
                </div>
            </div>
        </div>
    );
}

function Sparkles({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M3 5h4"/><path d="M21 17v4"/><path d="M19 19h4"/></svg>
    );
}