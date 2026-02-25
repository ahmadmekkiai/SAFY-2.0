"use client";

interface SuggestedTabProps {
    isActive: boolean;
}

export default function SuggestedTab({ isActive }: SuggestedTabProps) {
    if (!isActive) return null;

    return (
        <div className="flex-1 overflow-y-auto pb-20">
            <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Suggested
                </h1>
                <p className="text-gray-600 mb-6">
                    Discover new opportunities
                </p>

                <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
                        >
                            <div className="w-full h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg mb-3" />
                            <h3 className="text-sm font-bold text-gray-900 mb-1">
                                Suggestion {i}
                            </h3>
                            <p className="text-xs text-gray-500">
                                Placeholder content
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
