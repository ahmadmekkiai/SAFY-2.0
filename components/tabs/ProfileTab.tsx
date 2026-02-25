"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
    User, Mail, Globe, LogOut, Sparkles, Coins, Settings, ChevronRight, X, Search, Check, Minus, Clock, Phone, Calendar, Flag, Moon, Sun
} from "lucide-react";
import {
    INTEREST_TAXONOMY, searchTaxonomy, getCategoryPath, flattenTaxonomy, type InterestCategory
} from "@/lib/taxonomy";
import { NotificationTester } from "@/components/NotificationTester";

interface ProfileTabProps { isActive: boolean; }
interface UserProfile { id: string; email: string; full_name: string; interests: string[]; points?: number; phone?: string; gender?: string; dob?: string; nationality?: string; }

export default function ProfileTab({ isActive }: ProfileTabProps) {
    const t = useTranslations();
    const supabase = createClient();
    const router = useRouter();
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editingInterests, setEditingInterests] = useState(false);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["food_and_restaurants"]));

    // Modal States
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    
    // Form States
    const [formData, setFormData] = useState({ phone: "", gender: "male", dob: "", nationality: "" });
    const [savingProfile, setSavingProfile] = useState(false);

    useEffect(() => {
        if (isActive) {
            fetchProfile();
            const savedPrefs = localStorage.getItem('safy_ad_prefs');
            if (savedPrefs) setPrefs(JSON.parse(savedPrefs));
        }
    }, [isActive]);

    const [prefs, setPrefs] = useState({ dailyLimit: 30, minDiscount: 20, dndEnabled: false, dndDuration: "1h" });

    const updatePrefs = (newPrefs: Partial<typeof prefs>) => {
        const updated = { ...prefs, ...newPrefs };
        setPrefs(updated);
        localStorage.setItem('safy_ad_prefs', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
    };

    const fetchProfile = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            const { data, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
            if (!error && data) {
                setProfile(data);
                setSelectedInterests(data.interests || []);
                setFormData({
                    phone: data.phone || "",
                    gender: data.gender || "male",
                    dob: data.dob || "",
                    nationality: data.nationality || ""
                });
            }
        } catch (error) { console.error('Error fetching profile:', error); } 
        finally { setLoading(false); }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/auth';
    };

    const handleSaveInterests = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            const { error } = await supabase.from('profiles').update({ interests: selectedInterests }).eq('id', session.user.id);
            if (!error) {
                setProfile(prev => prev ? { ...prev, interests: selectedInterests } : null);
                setEditingInterests(false);
            }
        } catch (error) { console.error('Error saving interests:', error); }
    };

    const handleSaveProfileData = async () => {
        setSavingProfile(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            const { error } = await supabase.from('profiles').update(formData).eq('id', session.user.id);
            if (!error) {
                setProfile(prev => prev ? { ...prev, ...formData } : null);
                setShowProfileModal(false);
            }
        } catch (error) { console.error('Error saving profile data:', error); } 
        finally { setSavingProfile(false); }
    };

    const changeLanguage = (newLocale: string) => {
        const currentPath = pathname;
        // استبدال كود اللغة في الـ URL الحالي (مثال: /ar/app -> /en/app)
        const newPath = currentPath.replace(/^\/[a-z]{2}/, `/${newLocale}`);
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
        router.replace(newPath);
    };

    const getAllDescendants = (category: InterestCategory): string[] => {
        let descendants: string[] = [category.id];
        if (category.children) {
            category.children.forEach(child => { descendants = descendants.concat(getAllDescendants(child)); });
        }
        return descendants;
    };

    const isSelected = (categoryId: string): boolean => selectedInterests.includes(categoryId);

    const isIndeterminate = (category: InterestCategory): boolean => {
        if (!category.children || category.children.length === 0) return false;
        const descendants = getAllDescendants(category).filter(id => id !== category.id);
        const selectedDescendants = descendants.filter(id => selectedInterests.includes(id));
        return selectedDescendants.length > 0 && selectedDescendants.length < descendants.length;
    };

    const toggleInterest = (category: InterestCategory) => {
        const categoryId = category.id;
        const descendants = getAllDescendants(category);
        if (isSelected(categoryId)) {
            setSelectedInterests(prev => prev.filter(id => !descendants.includes(id)));
        } else {
            setSelectedInterests(prev => {
                const filtered = prev.filter(id => !descendants.includes(id));
                return [...filtered, categoryId];
            });
        }
    };

    const toggleCategory = (categoryId: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) { newExpanded.delete(categoryId); } 
        else { newExpanded.add(categoryId); }
        setExpandedCategories(newExpanded);
    };

    const renderCategory = (category: InterestCategory, level: number = 0) => {
        const isExpanded = expandedCategories.has(category.id);
        const hasChildren = category.children && category.children.length > 0;
        const selected = isSelected(category.id);
        const indeterminate = isIndeterminate(category);
        const breadcrumb = searchQuery ? getCategoryPath(category.id).join(' > ') : '';

        return (
            <div key={category.id} className={`${level > 0 ? 'ml-4' : ''}`}>
                <motion.div
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center gap-2 p-2 rounded-lg transition-all ${selected ? 'bg-[#D4AF37]/20 border border-[#D4AF37]' : indeterminate ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700' : 'hover:bg-white/50 dark:hover:bg-white/5'}`}
                >
                    {hasChildren && (
                        <button onClick={(e) => { e.stopPropagation(); toggleCategory(category.id); }} className="p-1 hover:bg-white/50 dark:hover:bg-white/10 rounded">
                            <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </motion.div>
                        </button>
                    )}
                    <div className="flex items-center gap-2 flex-1 cursor-pointer" onClick={() => toggleInterest(category)}>
                        <div className="text-lg">{category.icon}</div>
                        <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{category.label}</div>
                            {searchQuery && breadcrumb && (<div className="text-xs text-gray-500 dark:text-gray-400">{breadcrumb}</div>)}
                        </div>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${selected ? 'bg-[#D4AF37] border-[#D4AF37]' : indeterminate ? 'bg-blue-500 border-blue-500' : 'border-gray-300 dark:border-gray-600'}`}>
                            {selected && <Check className="w-3 h-3 text-white" />}
                            {!selected && indeterminate && <Minus className="w-3 h-3 text-white" />}
                        </div>
                    </div>
                </motion.div>
                <AnimatePresence>
                    {hasChildren && isExpanded && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden mt-1 space-y-1">
                            {category.children!.map(child => renderCategory(child, level + 1))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    const getCategoryInfo = (interestId: string) => flattenTaxonomy(INTEREST_TAXONOMY).find(cat => cat.id === interestId);
    const displayCategories = searchQuery ? searchTaxonomy(searchQuery, INTEREST_TAXONOMY) : INTEREST_TAXONOMY;

    if (!isActive) return null;
    if (loading) return (<div className="flex items-center justify-center h-full"><div className="text-gray-500 dark:text-gray-400">Loading profile...</div></div>);

    return (
        <div className="h-full overflow-y-auto pb-24 px-4 relative">
            
            {/* Modal: إكمال البيانات */}
            <AnimatePresence>
                {showProfileModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl relative"
                        >
                            <button onClick={() => setShowProfileModal(false)} className="absolute top-4 left-4 p-2 bg-gray-100 dark:bg-slate-800 rounded-full hover:bg-gray-200 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                                <User className="text-[#D4AF37]" /> إكمال البيانات
                            </h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-500 mb-1 block">رقم الجوال</label>
                                    <div className="relative">
                                        <Phone className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                                        <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-2 pr-10 pl-4 focus:outline-none focus:border-[#D4AF37]" placeholder="05XXXXXXXX" dir="ltr" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-500 mb-1 block">الجنس</label>
                                        <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-2.5 px-4 focus:outline-none focus:border-[#D4AF37]">
                                            <option value="male">ذكر</option>
                                            <option value="female">أنثى</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500 mb-1 block">تاريخ الميلاد</label>
                                        <div className="relative">
                                            <Calendar className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                                            <input type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-2 pr-9 pl-2 text-sm focus:outline-none focus:border-[#D4AF37]" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm text-gray-500 mb-1 block">الجنسية</label>
                                    <div className="relative">
                                        <Flag className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                                        <select value={formData.nationality} onChange={e => setFormData({...formData, nationality: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-2.5 pr-10 pl-4 focus:outline-none focus:border-[#D4AF37] appearance-none">
                                            <option value="">اختر الجنسية</option>
                                            <option value="SA">سعودي</option>
                                            <option value="EG">مصري</option>
                                            <option value="SY">سوري</option>
                                            <option value="JO">أردني</option>
                                            <option value="OTHER">أخرى</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <button onClick={handleSaveProfileData} disabled={savingProfile} className="w-full mt-4 py-3 bg-gradient-to-r from-[#D4AF37] to-yellow-600 text-white rounded-xl font-bold flex justify-center items-center">
                                    {savingProfile ? "جاري الحفظ..." : "حفظ التغييرات"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal: اختيار اللغة */}
            <AnimatePresence>
                {showLanguageModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative"
                        >
                            <button onClick={() => setShowLanguageModal(false)} className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-slate-800 rounded-full hover:bg-gray-200 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                                <Globe className="text-[#D4AF37]" /> {t('profile.language') || 'Language / اللغة'}
                            </h2>
                            <div className="space-y-3">
                                <button onClick={() => changeLanguage('ar')} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all text-center font-bold text-lg dark:text-white">
                                    العربية
                                </button>
                                <button onClick={() => changeLanguage('en')} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all text-center font-bold text-lg dark:text-white">
                                    English
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="max-w-2xl mx-auto space-y-6 pt-6">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative backdrop-blur-xl bg-white/40 dark:bg-white/5 rounded-3xl p-6 border border-white/20 dark:border-white/10 shadow-xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-yellow-600 flex items-center justify-center text-white text-2xl font-bold">
                            {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile?.full_name || 'User'}</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1"><Mail className="w-4 h-4" />{profile?.email}</p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-[#D4AF37] to-yellow-600 rounded-2xl p-4 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm opacity-90">رصيد النقاط</div>
                                <div className="text-3xl font-bold">{profile?.points || 0}</div>
                            </div>
                            <Coins className="w-12 h-12 opacity-80" />
                        </div>
                    </div>
                </motion.div>

                {/* Interests Section */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative backdrop-blur-xl bg-white/40 dark:bg-white/5 rounded-3xl p-6 border border-white/20 dark:border-white/10 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">الاهتمامات</h3>
                        </div>
                        <button onClick={() => setEditingInterests(!editingInterests)} className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 text-gray-900 dark:text-white text-sm font-medium transition-colors">
                            {editingInterests ? 'إلغاء' : 'تعديل'}
                        </button>
                    </div>

                    {editingInterests ? (
                        <div className="space-y-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ابحث في التصنيفات..." className="w-full pl-10 pr-10 py-2 rounded-xl bg-white/50 border border-gray-200 focus:border-[#D4AF37] focus:outline-none text-sm" dir="rtl" />
                                {searchQuery && (<button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><X className="w-4 h-4" /></button>)}
                            </div>
                            <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 custom-scrollbar" dir="rtl">
                                {searchQuery ? (displayCategories.length > 0 ? displayCategories.map(category => renderCategory(category, 0)) : <div className="text-center py-8 text-gray-500">لا يوجد نتائج</div>) : INTEREST_TAXONOMY.map(category => renderCategory(category, 0))}
                            </div>
                            <button onClick={handleSaveInterests} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-