"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Search, ChevronRight, Check, X, Sparkles, Minus, Loader2 } from "lucide-react";
import { INTEREST_TAXONOMY, searchTaxonomy, getCategoryPath, type InterestCategory } from "@/lib/taxonomy";

interface InterestSelectionProps {
    onComplete: () => void;
}

export default function InterestSelection({ onComplete }: InterestSelectionProps) {
    const supabase = createClient();
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const mainCategories = INTEREST_TAXONOMY.map(cat => cat.id);
        setExpandedCategories(new Set(mainCategories));
    }, []);

    const getAllDescendants = (category: InterestCategory): string[] => {
        let descendants: string[] = [category.id];
        if (category.children) {
            category.children.forEach(child => {
                descendants = descendants.concat(getAllDescendants(child));
            });
        }
        return descendants;
    };

    const toggleInterest = (category: InterestCategory) => {
        const categoryId = category.id;
        const descendants = getAllDescendants(category);

        if (selectedInterests.includes(categoryId)) {
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
        newExpanded.has(categoryId) ? newExpanded.delete(categoryId) : newExpanded.add(categoryId);
        setExpandedCategories(newExpanded);
    };

    const handleSave = async () => {
        if (selectedInterests.length === 0) return;
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const { error } = await supabase
                .from('profiles')
                .update({ interests: selectedInterests })
                .eq('id', session.user.id);

            if (!error) onComplete();
        } catch (error) {
            console.error('Error saving interests:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderCategory = (category: InterestCategory, level: number = 0) => {
        const isExpanded = expandedCategories.has(category.id);
        const hasChildren = category.children && category.children.length > 0;
        const selected = selectedInterests.includes(category.id);
        
        return (
            <div key={category.id} className={`${level > 0 ? 'mr-4 border-r-2 border-slate-100 dark:border-slate-800 pr-4' : ''}`}>
                <motion.div
                    className={`flex items-center gap-3 p-4 rounded-2xl transition-all mb-2 ${selected ? 'bg-[#D4AF37]/10 border-2 border-[#D4AF37]' : 'bg-white dark:bg-slate-800 border-2 border-transparent shadow-sm hover:border-slate-200'}`}
                >
                    <div onClick={() => toggleInterest(category)} className="flex items-center gap-3 flex-1 cursor-pointer">
                        <span className="text-2xl">{category.icon}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{category.label}</span>
                        {selected && <Check className="w-5 h-5 text-[#D4AF37] ml-auto" />}
                    </div>
                    {hasChildren && (
                        <button onClick={() => toggleCategory(category.id)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <ChevronRight className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </button>
                    )}
                </motion.div>

                <AnimatePresence>
                    {hasChildren && isExpanded && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            {category.children!.map(child => renderCategory(child, level + 1))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6" dir="rtl">
            <div className="max-w-2xl mx-auto space-y-8 pt-12">
                <div className="text-center space-y-2">
                    <Sparkles className="w-12 h-12 text-[#D4AF37] mx-auto" />
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">اختار اهتماماتك</h1>
                    <p className="text-slate-500">عشان نقدر نعرض لك العروض اللي تهمك بجد</p>
                </div>

                <div className="space-y-3 max-h-[60vh] overflow-y-auto px-2 custom-scrollbar">
                    {INTEREST_TAXONOMY.map(category => renderCategory(category, 0))}
                </div>

                <button
                    onClick={handleSave}
                    disabled={selectedInterests.length === 0 || loading}
                    className="w-full py-5 rounded-[2rem] font-black text-white bg-[#D4AF37] shadow-xl shadow-[#D4AF37]/20 disabled:opacity-50 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "ابدأ التوفير الآن"}
                </button>
            </div>
        </div>
    );
}