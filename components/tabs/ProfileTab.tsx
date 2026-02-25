"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import {
    User,
    Mail,
    Globe,
    LogOut,
    Sparkles,
    Coins,
    Settings,
    ChevronRight,
    X,
    Search,
    Check,
    Minus,
    Clock
} from "lucide-react";
import {
    INTEREST_TAXONOMY,
    searchTaxonomy,
    getCategoryPath,
    flattenTaxonomy,
    type InterestCategory
} from "@/lib/taxonomy";
import { NotificationTester } from "@/components/NotificationTester";

interface ProfileTabProps {
    isActive: boolean;
}

interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    interests: string[];
    points?: number;
}

export default function ProfileTab({ isActive }: ProfileTabProps) {
    const t = useTranslations();
    const supabase = createClient();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editingInterests, setEditingInterests] = useState(false);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (isActive) {
            fetchProfile();
            // Load Ad Preferences
            const savedPrefs = localStorage.getItem('safy_ad_prefs');
            if (savedPrefs) {
                setPrefs(JSON.parse(savedPrefs));
            }
        }
    }, [isActive]);

    // Ad Preferences State
    const [prefs, setPrefs] = useState({
        dailyLimit: 30,
        minDiscount: 20, // Now matches state directly
        dndEnabled: false,
        dndDuration: "1h" // e.g. "1h", "8h", "until_tomorrow"
    });

    const updatePrefs = (newPrefs: Partial<typeof prefs>) => {
        const updated = { ...prefs, ...newPrefs };
        setPrefs(updated);
        localStorage.setItem('safy_ad_prefs', JSON.stringify(updated));
        // Dispatch storage event to notify other components (ForYouTab)
        window.dispatchEvent(new Event('storage'));
    };

    const fetchProfile = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) return;

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (!error && data) {
                setProfile(data);
                setSelectedInterests(data.interests || []);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/auth';
    };

    const handleSaveInterests = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) return;

            const { error } = await supabase
                .from('profiles')
                .update({ interests: selectedInterests })
                .eq('id', session.user.id);

            if (!error) {
                setProfile(prev => prev ? { ...prev, interests: selectedInterests } : null);
                setEditingInterests(false);
            }
        } catch (error) {
            console.error('Error saving interests:', error);
        }
    };

    // Get all descendant IDs for a category
    const getAllDescendants = (category: InterestCategory): string[] => {
        let descendants: string[] = [category.id];
        if (category.children) {
            category.children.forEach(child => {
                descendants = descendants.concat(getAllDescendants(child));
            });
        }
        return descendants;
    };

    // Check if category or any descendants are selected
    const isSelected = (categoryId: string): boolean => {
        return selectedInterests.includes(categoryId);
    };

    // Check if category has some (but not all) descendants selected
    const isIndeterminate = (category: InterestCategory): boolean => {
        if (!category.children || category.children.length === 0) return false;

        const descendants = getAllDescendants(category).filter(id => id !== category.id);
        const selectedDescendants = descendants.filter(id => selectedInterests.includes(id));

        return selectedDescendants.length > 0 && selectedDescendants.length < descendants.length;
    };

    // Toggle category selection (parent or child)
    const toggleInterest = (category: InterestCategory) => {
        const categoryId = category.id;
        const descendants = getAllDescendants(category);

        if (isSelected(categoryId)) {
            // Deselect this category and all descendants
            setSelectedInterests(prev =>
                prev.filter(id => !descendants.includes(id))
            );
        } else {
            // Select this category and deselect all descendants (parent takes precedence)
            setSelectedInterests(prev => {
                const filtered = prev.filter(id => !descendants.includes(id));
                return [...filtered, categoryId];
            });
        }
    };

    const toggleCategory = (categoryId: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
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
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center gap-2 p-2 rounded-lg transition-all ${selected
                        ? 'bg-[#D4AF37]/20 border border-[#D4AF37]'
                        : indeterminate
                            ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700'
                            : 'hover:bg-white/50 dark:hover:bg-white/5'
                        }`}
                >
                    {/* Expand/Collapse Icon */}
                    {hasChildren && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleCategory(category.id);
                            }}
                            className="p-1 hover:bg-white/50 dark:hover:bg-white/10 rounded"
                        >
                            <motion.div
                                animate={{ rotate: isExpanded ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </motion.div>
                        </button>
                    )}

                    {/* Category Content - Clickable for selection */}
                    <div
                        className="flex items-center gap-2 flex-1 cursor-pointer"
                        onClick={() => toggleInterest(category)}
                    >
                        <div className="text-lg">{category.icon}</div>
                        <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {category.label}
                            </div>
                            {searchQuery && breadcrumb && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {breadcrumb}
                                </div>
                            )}
                        </div>

                        {/* Selection Checkbox */}
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${selected
                            ? 'bg-[#D4AF37] border-[#D4AF37]'
                            : indeterminate
                                ? 'bg-blue-500 border-blue-500'
                                : 'border-gray-300 dark:border-gray-600'
                            }`}>
                            {selected && <Check className="w-3 h-3 text-white" />}
                            {!selected && indeterminate && <Minus className="w-3 h-3 text-white" />}
                        </div>
                    </div>
                </motion.div>

                {/* Children (recursive) */}
                <AnimatePresence>
                    {hasChildren && isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden mt-1 space-y-1"
                        >
                            {category.children!.map(child => renderCategory(child, level + 1))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    // Get category info for display
    const getCategoryInfo = (interestId: string) => {
        const allCategories = flattenTaxonomy(INTEREST_TAXONOMY);
        return allCategories.find(cat => cat.id === interestId);
    };

    const displayCategories = searchQuery
        ? searchTaxonomy(searchQuery, INTEREST_TAXONOMY)
        : INTEREST_TAXONOMY;

    if (!isActive) return null;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-gray-500 dark:text-gray-400">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto pb-24 px-4">
            <div className="max-w-2xl mx-auto space-y-6 pt-6">
                {/* Header with User Info and Points */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative backdrop-blur-xl bg-white/40 dark:bg-white/5 rounded-3xl p-6 border border-white/20 dark:border-white/10 shadow-xl"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                            {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {profile?.full_name || 'User'}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {profile?.email}
                            </p>
                        </div>
                    </div>

                    {/* Points Balance */}
                    <div className="bg-gradient-to-r from-[#D4AF37] to-yellow-600 rounded-2xl p-4 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm opacity-90">Points Balance</div>
                                <div className="text-3xl font-bold">{profile?.points || 0}</div>
                            </div>
                            <Coins className="w-12 h-12 opacity-80" />
                        </div>
                    </div>
                </motion.div>

                {/* Interests Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative backdrop-blur-xl bg-white/40 dark:bg-white/5 rounded-3xl p-6 border border-white/20 dark:border-white/10 shadow-xl"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                My Interests
                            </h3>
                        </div>
                        <button
                            onClick={() => {
                                setEditingInterests(!editingInterests);
                                if (!editingInterests) {
                                    const mainCategories = INTEREST_TAXONOMY.map(cat => cat.id);
                                    setExpandedCategories(new Set(mainCategories));
                                }
                            }}
                            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            {editingInterests ? 'Cancel' : 'Edit'}
                        </button>
                    </div>

                    {editingInterests ? (
                        <div className="space-y-3">
                            {/* Search Bar */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search categories..."
                                    className="w-full pl-10 pr-10 py-2 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 focus:border-[#D4AF37] focus:outline-none text-sm text-gray-900 dark:text-white"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Categories List */}
                            <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                {searchQuery ? (
                                    displayCategories.length > 0 ? (
                                        displayCategories.map(category => renderCategory(category, 0))
                                    ) : (
                                        <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                                            No categories found
                                        </div>
                                    )
                                ) : (
                                    INTEREST_TAXONOMY.map(category => renderCategory(category, 0))
                                )}
                            </div>

                            <button
                                onClick={handleSaveInterests}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-yellow-600 text-white font-bold hover:from-yellow-600 hover:to-[#D4AF37] transition-all shadow-lg"
                            >
                                Save Changes
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {profile?.interests && profile.interests.length > 0 ? (
                                profile.interests.map((interestId) => {
                                    const category = getCategoryInfo(interestId);
                                    if (!category) return null;

                                    const breadcrumb = getCategoryPath(interestId);
                                    const displayName = breadcrumb.length > 1
                                        ? breadcrumb[breadcrumb.length - 1]
                                        : category.label;

                                    return (
                                        <div
                                            key={interestId}
                                            className="px-3 py-2 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200 text-sm font-medium flex items-center gap-2"
                                            title={breadcrumb.join(' > ')}
                                        >
                                            <span>{category.icon}</span>
                                            <span>{displayName}</span>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    No interests selected yet
                                </p>
                            )}
                        </div>
                    )}

                    <style jsx>{`
                        .custom-scrollbar::-webkit-scrollbar {
                            width: 6px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-track {
                            background: rgba(0, 0, 0, 0.1);
                            border-radius: 10px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb {
                            background: #D4AF37;
                            border-radius: 10px;
                        }
                    `}</style>
                </motion.div>

                {/* Account Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative backdrop-blur-xl bg-white/40 dark:bg-white/5 rounded-3xl p-6 border border-white/20 dark:border-white/10 shadow-xl"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Account Settings
                        </h3>
                    </div>

                    <div className="space-y-3">
                        <button className="w-full p-4 rounded-xl bg-white/50 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/10 transition-all text-left flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    Complete Profile Data
                                </span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>

                        <button className="w-full p-4 rounded-xl bg-white/50 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/10 transition-all text-left flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    Language Selection
                                </span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </motion.div>

                {/* Ad Preferences */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="relative backdrop-blur-xl bg-white/40 dark:bg-white/5 rounded-3xl p-6 border border-white/20 dark:border-white/10 shadow-xl"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Settings className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Ad Preferences
                        </h3>
                    </div>

                    <div className="space-y-6">
                        {/* Daily Ad Limit */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Daily Ad Limit</label>
                                <span className="text-xs font-bold px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                    {prefs.dailyLimit >= 100 ? 'Unlimited / غير محدود' : `${prefs.dailyLimit} ads`}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="5"
                                max="100"
                                step="5"
                                value={prefs.dailyLimit}
                                onChange={(e) => updatePrefs({ dailyLimit: parseInt(e.target.value) })}
                                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                            />
                            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                                <span>5</span>
                                <span>Unlimited</span>
                            </div>
                        </div>

                        {/* Minimum Discount Filter */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Minimum Discount</label>
                                <span className="text-xs font-bold px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                    &gt; {prefs.minDiscount}%
                                </span>
                            </div>
                            <div className="flex gap-2">
                                {[10, 20, 30, 50].map((pct) => (
                                    <button
                                        key={pct}
                                        onClick={() => updatePrefs({ minDiscount: pct })}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex-1 ${prefs.minDiscount === pct
                                            ? 'bg-green-600 text-white border-green-600'
                                            : 'bg-transparent border-gray-300 dark:border-gray-600 text-gray-500 hover:border-green-500'
                                            }`}
                                    >
                                        {pct}%+
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Do Not Disturb (DND) */}
                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700/50">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">Do Not Disturb</label>
                                    <span className="text-xs text-gray-500">Mute ads temporarily</span>
                                </div>
                                <button
                                    onClick={() => updatePrefs({ dndEnabled: !prefs.dndEnabled })}
                                    className={`relative w-11 h-6 rounded-full transition-colors ${prefs.dndEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                                >
                                    <div className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform shadow-sm ${prefs.dndEnabled ? 'translate-x-[20px] border-blue-600' : 'translate-x-0'}`}></div>
                                </button>
                            </div>

                            {/* DND Duration Selector */}
                            <AnimatePresence>
                                {prefs.dndEnabled && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="grid grid-cols-3 gap-2 pt-2">
                                            {[
                                                { id: "1h", label: "For 1 Hour" },
                                                { id: "8h", label: "For 8 Hours" },
                                                { id: "until_tomorrow", label: "Until Tomorrow" }
                                            ].map((duration) => (
                                                <button
                                                    key={duration.id}
                                                    onClick={() => updatePrefs({ dndDuration: duration.id })}
                                                    className={`py-2 px-2 rounded-lg text-[11px] font-semibold border transition-colors flex flex-col items-center justify-center gap-1 ${prefs.dndDuration === duration.id
                                                        ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300'
                                                        : 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300'
                                                        }`}
                                                >
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {duration.label}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-2 gap-4">


                    {/* Notification Tester (Admin/Demo Mode) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <NotificationTester />
                    </motion.div>

                    {/* Logout Button */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        onClick={handleLogout}
                        className="w-full py-4 rounded-2xl bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 text-red-600 dark:text-red-400 font-bold hover:bg-red-500/20 dark:hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
