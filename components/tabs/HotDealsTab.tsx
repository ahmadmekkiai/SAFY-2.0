"use client";

interface HotDealsTabProps {
    isActive: boolean;
}

export default function HotDealsTab({ isActive }: HotDealsTabProps) {
    if (!isActive) return null;

    return (
        <div className="flex-1 overflow-y-auto pb-20">
            <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    🔥 Hot Deals
                </h1>
                <p className="text-gray-600 mb-6">
                    Limited time offers
                </p>

                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-300"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-2xl">🔥</span>
                                <span className="text-xs font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full">
                                    {Math.floor(Math.random() * 50) + 10}% OFF
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                Hot Deal {i}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                                Limited time offer - Act fast!
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                    Ends in 2h 30m
                                </span>
                                <button className="text-xs font-semibold text-orange-600 hover:text-orange-700">
                                    View Deal →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
