"use client";

import { useTranslations } from "next-intl";
import { Download, ClipboardList, UserPlus, Bell } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface TasksTabProps {
    isActive: boolean;
}

export default function TasksTab({ isActive }: TasksTabProps) {
    const [notifyEnabled, setNotifyEnabled] = useState(false);
    const t = useTranslations("common");

    if (!isActive) return null;

    const cards = [
        {
            id: 'cpi',
            title: 'Download & Play',
            subtitle: 'CPI Tasks',
            profit: 'Up to 50 SAR',
            icon: Download,
            color: 'bg-blue-500',
            description: 'Download verified apps and reach specific levels to earn big rewards.',
        },
        {
            id: 'surveys',
            title: 'Share Your Opinion',
            subtitle: 'Paid Surveys',
            profit: '10 - 20 SAR',
            icon: ClipboardList,
            color: 'bg-green-500',
            description: 'Answer short surveys from top brands and get paid for your time.',
        },
        {
            id: 'cpa',
            title: 'Register & Earn',
            subtitle: 'CPA Offers',
            profit: '5 - 100 SAR',
            icon: UserPlus,
            color: 'bg-purple-500',
            description: 'Sign up for services, free trials, or newsletters to earn the highest rates.',
        }
    ];

    return (
        <div className="flex-1 overflow-y-auto pb-20 bg-gray-50 dark:bg-slate-900">
            <div className="p-6 max-w-2xl mx-auto space-y-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-2"
                >
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Task Hub
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                        Complete simple tasks and earn massive rewards. Launching soon in your region.
                    </p>
                </motion.div>

                {/* Coming Soon Cards */}
                <div className="space-y-4">
                    {cards.map((card, index) => (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-lg group opacity-90 grayscale-[0.3]"
                        >
                            {/* "Coming Soon" Overlay */}
                            <div className="absolute top-3 right-3 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-bold z-10">
                                Coming Soon / قريباً
                            </div>

                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center text-white shadow-md shrink-0`}>
                                    <card.icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        {card.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                        {card.subtitle}
                                    </p>
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-xs font-bold">
                                        <span>💰</span>
                                        {card.profit} / task
                                    </div>
                                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {card.description}
                                    </p>
                                </div>
                            </div>

                            {/* Disabled Button */}
                            <button disabled className="mt-5 w-full py-3 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 font-bold cursor-not-allowed">
                                Not Available Yet
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Notify Me Toggle */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 flex items-center justify-between border border-blue-100 dark:border-blue-800"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white mobile-text-base">
                                Notify when launched
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Be the first to start earning
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setNotifyEnabled(!notifyEnabled)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${notifyEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                    >
                        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${notifyEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </motion.div>

            </div>
        </div>
    );
}
