"use client";

import { motion } from "framer-motion";

interface LoginScreenProps {
    topToggle: boolean;
    bottomToggle: boolean;
    onTopToggleChange: (value: boolean) => void;
    onBottomToggleChange: (value: boolean) => void;
}

export default function LoginScreen({
    topToggle,
    bottomToggle,
    onTopToggleChange,
    onBottomToggleChange,
}: LoginScreenProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                {/* Login Card */}
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <h1 className="text-5xl font-bold text-white mb-2">
                            <span>SA</span>
                            <motion.span
                                className="text-yellow-400"
                                animate={{
                                    textShadow: [
                                        "0 0 10px rgba(255, 215, 0, 0.5)",
                                        "0 0 30px rgba(255, 215, 0, 0.8)",
                                        "0 0 10px rgba(255, 215, 0, 0.5)",
                                    ],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                F
                            </motion.span>
                            <span>Y</span>
                        </h1>
                        <p className="text-blue-200 text-sm">Smart Rewards Platform</p>
                    </div>

                    {/* Interactive Toggles */}
                    <div className="space-y-6 mb-8">
                        {/* Top Toggle - Enable Rewards */}
                        <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl">
                            <div>
                                <span className="text-white font-medium block">Enable Rewards</span>
                                <span className="text-blue-200 text-xs">Get points for every action</span>
                            </div>
                            <button
                                onClick={() => onTopToggleChange(!topToggle)}
                                className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${topToggle ? "bg-green-500" : "bg-gray-400"
                                    }`}
                            >
                                <motion.div
                                    className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
                                    animate={{ x: topToggle ? 32 : 0 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            </button>
                        </div>

                        {/* Bottom Toggle - Activate Gold */}
                        <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl">
                            <div>
                                <span className="text-white font-medium block">Activate Gold</span>
                                <span className="text-yellow-200 text-xs">Unlock premium features</span>
                            </div>
                            <button
                                onClick={() => onBottomToggleChange(!bottomToggle)}
                                className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${bottomToggle ? "bg-yellow-500" : "bg-gray-400"
                                    }`}
                            >
                                <motion.div
                                    className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
                                    animate={{ x: bottomToggle ? 32 : 0 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Login Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-900 font-bold py-4 rounded-xl shadow-lg hover:shadow-yellow-500/50 transition-shadow"
                    >
                        Continue to SAFY
                    </motion.button>

                    {/* Additional Info */}
                    <p className="text-center text-blue-200 text-xs mt-6">
                        By continuing, you agree to our Terms & Privacy Policy
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
