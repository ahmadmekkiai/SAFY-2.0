"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

interface AuthFormProps {
    mode: "login" | "signup";
    onToggleMode: () => void;
}

export function AuthForm({ mode, onToggleMode }: AuthFormProps) {
    const router = useRouter();
    const supabase = createClient();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const validateForm = () => {
        if (!email) {
            setError("Email is required");
            return false;
        }
        if (!password) {
            setError("Password is required");
            return false;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return false;
        }
        if (mode === "signup") {
            if (!fullName) {
                setError("Full name is required");
                return false;
            }
            if (password !== confirmPassword) {
                setError("Passwords do not match");
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) return;

        setLoading(true);

        try {
            if (mode === "signup") {
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                    },
                });

                if (signUpError) {
                    if (signUpError.message.includes("already registered")) {
                        setError("User already exists");
                    } else {
                        setError(signUpError.message);
                    }
                    setLoading(false);
                    return;
                }

                if (data.user) {
                    // Force clean reload to ensure middleware picks up new locale context
                    window.location.href = "/en";
                }
            } else {
                const { data, error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (signInError) {
                    setError("Invalid email or password");
                    setLoading(false);
                    return;
                }

                if (data.user) {
                    // Force clean reload to ensure middleware picks up new locale context
                    window.location.href = "/en";
                }
            }
        } catch (err) {
            setError("An unexpected error occurred");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ADMIN/DEMO MODE: Anonymous sign-in to bypass email rate limits
    const handleDemoMode = async () => {
        setLoading(true);
        setError("");

        try {
            const { data, error: anonError } = await supabase.auth.signInAnonymously();

            if (anonError) {
                setError("Failed to enter demo mode");
                console.error(anonError);
                setLoading(false);
                return;
            }

            if (data.user) {
                // Hard redirect to For You tab
                window.location.href = "/en/for-you";
            }
        } catch (err) {
            setError("An unexpected error occurred");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
        >
            {/* Glassmorphism Card */}
            <div className="relative backdrop-blur-xl bg-white/10 dark:bg-white/5 rounded-3xl p-8 border border-white/20 dark:border-white/10 shadow-2xl">
                {/* SAFY Branding */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-white mb-2 flex justify-center items-center gap-1">
                        <span>SA</span>
                        <motion.span
                            className="relative inline-block"
                            animate={{
                                textShadow: [
                                    "0 0 20px rgba(212, 175, 55, 0.8)",
                                    "0 0 40px rgba(212, 175, 55, 1)",
                                    "0 0 20px rgba(212, 175, 55, 0.8)",
                                ],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <span className="text-[#D4AF37]">F</span>
                        </motion.span>
                        <span>Y</span>
                    </h1>
                    <p className="text-blue-200 dark:text-blue-300 text-sm">
                        Your Time, Your Rewards
                    </p>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                    {mode === "login" ? "Welcome Back" : "Welcome to SAFY"}
                </h2>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-sm text-center"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name (Signup only) */}
                    {mode === "signup" && (
                        <div>
                            <label className="block text-sm font-medium text-blue-200 dark:text-blue-300 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300/50" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
                                    placeholder="Full Name"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    )}

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-blue-200 dark:text-blue-300 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300/50" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
                                placeholder="Email"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-blue-200 dark:text-blue-300 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300/50" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-11 py-3 rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
                                placeholder="Password"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300/50 hover:text-blue-300 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password (Signup only) */}
                    {mode === "signup" && (
                        <div>
                            <label className="block text-sm font-medium text-blue-200 dark:text-blue-300 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300/50" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
                                    placeholder="Confirm Password"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-yellow-600 text-white font-bold hover:from-yellow-600 hover:to-[#D4AF37] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                />
                                Loading...
                            </span>
                        ) : mode === "login" ? (
                            "Sign In"
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                {/* Toggle Mode */}
                <div className="mt-6 text-center">
                    <p className="text-blue-200 dark:text-blue-300 text-sm">
                        {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                    </p>
                    <button
                        onClick={onToggleMode}
                        className="mt-2 text-[#D4AF37] font-semibold hover:text-yellow-500 transition-colors"
                    >
                        {mode === "login" ? "Sign Up" : "Login"}
                    </button>
                </div>

                {/* Divider */}
                <div className="mt-8 mb-6 flex items-center gap-4">
                    <div className="flex-1 h-px bg-white/20"></div>
                    <span className="text-blue-200 dark:text-blue-300 text-sm">OR</span>
                    <div className="flex-1 h-px bg-white/20"></div>
                </div>

                {/* Admin/Demo Mode Button */}
                <button
                    onClick={handleDemoMode}
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <span className="text-xl">🎭</span>
                    Enter Admin/Demo Mode
                </button>
                <p className="mt-2 text-center text-xs text-blue-200/70 dark:text-blue-300/70">
                    Bypass email limits • Test all features • Anonymous session
                </p>
            </div>
        </motion.div>
    );
}
