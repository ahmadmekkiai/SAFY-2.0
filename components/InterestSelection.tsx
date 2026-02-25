"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import {
    Search,
    ChevronRight,
    Check,
    X,
    Sparkles,
    Minus
} from "lucide-react";
import {
    INTEREST_TAXONOMY,
    searchTaxonomy,
    getCategoryPath,
    type InterestCategory
} from "@/lib/taxonomy";

interface InterestSelectionProps {
    onComplete: () => void;
}

export default function InterestSelection({ onComplete }: InterestSelectionProps) {
    const t = useTranslations();
    const supabase = createClient();
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);

    // Auto-expand main categories on mount
    useEffect(() => {
        const mainCategories = INTEREST_TAXONOMY.map(cat => cat.id);
        setExpandedCategories(new Set(mainCategories));
    }, []);

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

    // Check if category is selected
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

            if (!error) {
                onComplete();
            }
        } catch (error) {
            console.error('Error saving interests:', error);
        } finally {
            setLoading(false);
        }
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
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${selected
                            ? 'bg-[#D4AF37]/20 border-2 border-[#D4AF37]'
                            : indeterminate
                                ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700'
                                : 'bg-white/50 dark:bg-white/5 border-2 border-transparent hover:bg-white/70 dark:hover:bg-white/10'
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
                                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </motion.div>
                        </button>
                    )}

                    {/* Category Content - Clickable for selection */}
                    <div
                        className="flex items-center gap-3 flex-1 cursor-pointer"
                        onClick={() => toggleInterest(category)}
                    >
                        {/* Category Icon */}
                        <div className="text-2xl">{category.icon}</div>

                        {/* Category Label */}
                        <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white">
                                {category.label}
                            </div>
                            {searchQuery && breadcrumb && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {breadcrumb}
                                </div>
                            )}
                        </div>

                        {/* Selection Checkbox */}
                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${selected
                                ? 'bg-[#D4AF37] border-[#D4AF37]'
                                : indeterminate
                                    ? 'bg-blue-500 border-blue-500'
                                    : 'border-gray-300 dark:border-gray-600'
                            }`}>
                            {selected && <Check className="w-4 h-4 text-white" />}
                            {!selected && indeterminate && <Minus className="w-4 h-4 text-white" />}
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
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden mt-2 space-y-2"
                        >
                            {category.children!.map(child => renderCategory(child, level + 1))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    // Filter categories based on search
    const displayCategories = searchQuery
        ? searchTaxonomy(searchQuery, INTEREST_TAXONOMY)
        : INTEREST_TAXONOMY;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-blue-950 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl backdrop-blur-xl bg-white/40 dark:bg-white/5 rounded-3xl p-8 border border-white/20 dark:border-white/10 shadow-2xl"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles className="w-8 h-8 text-[#D4AF37]" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Select Your Interests
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Choose broad categories or drill down to specifics
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search categories... (e.g., coffee, laptops, قهوة)"
                            className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/50 dark:bg-white/5 border-2 border-gray-200 dark:border-gray-700 focus:border-[#D4AF37] focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Selected Count */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedInterests.length} {selectedInterests.length === 1 ? 'category' : 'categories'} selected
                    </div>
                    {selectedInterests.length > 0 && (
                        <button
                            onClick={() => setSelectedInterests([])}
                            className="text-sm text-red-600 dark:text-red-400 hover:underline"
                        >
                            Clear all
                        </button>
                    )}
                </div>

                {/* Categories List */}
                <div className="max-h-[500px] overflow-y-auto space-y-3 mb-6 pr-2 custom-scrollbar">
                    {searchQuery ? (
                        // Search results (flat list)
                        displayCategories.length > 0 ? (
                            displayCategories.map(category => renderCategory(category, 0))
                        ) : (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                No categories found for "{searchQuery}"
                            </div>
                        )
                    ) : (
                        // Normal hierarchical view
                        INTEREST_TAXONOMY.map(category => renderCategory(category, 0))
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={handleSave}
                        disabled={selectedInterests.length === 0 || loading}
                        className={`flex-1 py-4 rounded-2xl font-bold text-white transition-all ${selectedInterests.length === 0 || loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-[#D4AF37] to-yellow-600 hover:from-yellow-600 hover:to-[#D4AF37] shadow-lg'
                            }`}
                    >
                        {loading ? 'Saving...' : 'Continue'}
                    </button>
                </div>
            </motion.div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #D4AF37;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #b8941f;
                }
            `}</style>
        </div>
    );
}
