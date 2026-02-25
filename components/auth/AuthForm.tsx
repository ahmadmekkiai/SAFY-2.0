"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, User, Phone, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AuthFormProps {
    mode: "login" | "signup";
    onToggleMode: () => void;
}

export function AuthForm({ mode, onToggleMode }: AuthFormProps) {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // States
    const [identifier, setIdentifier] = useState(""); // للإيميل أو الجوال في الدخول
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (mode === "signup") {
                // 1. إنشاء حساب جديد
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            phone: phone,
                        },
                    },
                });

                if (signUpError) throw signUpError;

                if (data.user) {
                    await supabase.from("profiles").upsert({
                        id: data.user.id,
                        email: email,
                        full_name: fullName,
                        phone: phone,
                    });
                }
                setSuccess("تم إنشاء الحساب بنجاح! يرجى مراجعة بريدك الإلكتروني للتفعيل.");
                
            } else {
                // 2. تسجيل الدخول (بالباسورد + الإيميل أو الجوال)
                let loginEmail = identifier;

                // لو المستخدم كتب رقم موبايل (مفيش علامة @)
                if (!identifier.includes("@")) {
                    const { data: profileData, error: profileError } = await supabase
                        .from("profiles")
                        .select("email")
                        .eq("phone", identifier)
                        .single();

                    if (profileError || !profileData?.email) {
                        throw new Error("لم نتمكن من العثور على حساب مرتبط برقم الجوال هذا.");
                    }
                    loginEmail = profileData.email; // لقينا الإيميل المربوط بالرقم
                }

                // تسجيل الدخول بالباسورد
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email: loginEmail,
                    password: password,
                });

                if (signInError) {
                    if (signInError.message.includes("Invalid login credentials")) {
                        throw new Error("كلمة المرور أو بيانات الدخول غير صحيحة.");
                    }
                    throw signInError;
                }

                // معالجة "تذكرني دائماً"
                if (!rememberMe) {
                    // الجلسة تنتهي بإغلاق المتصفح (ممكن نربطها في الـ Layout لاحقاً)
                    sessionStorage.setItem('temp_session_safy', 'true');
                } else {
                    sessionStorage.removeItem('temp_session_safy');
                }

                // توجيه المستخدم لصفحة التطبيق
                window.location.href = "/ar/app";
            }
        } catch (err: any) {
            setError(err.message || "حدث خطأ غير متوقع، حاول مرة أخرى.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-white/10 dark:bg-slate-900/50 backdrop-blur-xl border border-white/20 dark:border-slate-700 p-8 rounded-3xl shadow-2xl relative z-10"
            dir="rtl"
        >
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-white mb-2">
                    {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
                </h2>
                <p className="text-blue-100 dark:text-slate-300 text-sm">
                    {mode === "login" 
                        ? "مرحباً بعودتك إلى SAFY"
                        : "انضم إلينا وابدأ في كسب النقاط اليوم"}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {mode === "signup" && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-white mb-1">الاسم الكامل</label>
                                <div className="relative">
                                    <User className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                                    <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-white/90 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl py-3 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border-transparent" placeholder="أحمد مكي" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white mb-1">البريد الإلكتروني</label>
                                <div className="relative">
                                    <Mail className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/90 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl py-3 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border-transparent" placeholder="ahmed@example.com" dir="ltr" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white mb-1">رقم الجوال</label>
                                <div className="relative">
                                    <Phone className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                                    <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-white/90 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl py-3 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border-transparent" placeholder="05XXXXXXXX" dir="ltr" />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {mode === "login" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white mb-1">البريد الإلكتروني أو رقم الجوال</label>
                                <div className="relative">
                                    <User className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                                    <input type="text" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="w-full bg-white/90 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl py-3 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border-transparent" placeholder="الايميل أو 05XXXXXXXX" dir="ltr" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* حقل كلمة المرور (موجود في الدخول والتسجيل) */}
                <motion.div layout className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">كلمة المرور</label>
                        <div className="relative">
                            <Lock className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/90 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl py-3 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border-transparent" placeholder="••••••••" dir="ltr" />
                        </div>
                    </div>

                    {mode === "login" && (
                        <div className="flex items-center gap-2 mt-2">
                            <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded text-[#D4AF37] focus:ring-[#D4AF37] accent-[#D4AF37] cursor-pointer" />
                            <label htmlFor="rememberMe" className="text-sm text-white cursor-pointer select-none">
                                تذكرني دائماً
                            </label>
                        </div>
                    )}
                </motion.div>

                {error && (
                    <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-100 text-sm font-medium">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-100 text-sm font-medium">
                        {success}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 mt-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-yellow-600 text-white font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
                >
                    {loading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <>
                            {mode === "signup" ? "إنشاء حساب" : "تسجيل الدخول"}
                            <ArrowRight className="w-5 h-5 rotate-180" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <button
                    onClick={() => {
                        onToggleMode();
                        setError(null);
                        setSuccess(null);
                    }}
                    className="text-blue-100 dark:text-slate-300 hover:text-white text-sm font-medium transition-colors"
                >
                    {mode === "login"
                        ? "ليس لديك حساب؟ قم بالتسجيل الآن"
                        : "لديك حساب بالفعل؟ تسجيل الدخول"}
                </button>
            </div>
        </motion.div>
    );
}