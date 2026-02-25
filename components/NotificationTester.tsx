"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, BellOff, TestTube } from "lucide-react";
import {
    requestNotificationPermission,
    showTestNotification,
    getNotificationPermission
} from "@/lib/pushNotifications";

export function NotificationTester() {
    const [permission, setPermission] = useState<NotificationPermission>(
        getNotificationPermission()
    );
    const [requesting, setRequesting] = useState(false);

    const handleRequestPermission = async () => {
        setRequesting(true);
        const granted = await requestNotificationPermission();
        setPermission(granted ? 'granted' : 'denied');
        setRequesting(false);
    };

    const handleTestNotification = () => {
        if (permission === 'granted') {
            showTestNotification();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/40 dark:bg-white/5 rounded-3xl border border-white/20 dark:border-white/10 shadow-xl p-6"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Push Notifications
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Test PWA notification system
                    </p>
                </div>
            </div>

            {/* Permission Status */}
            <div className="mb-4 p-3 rounded-xl bg-white/50 dark:bg-white/5">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Permission Status:
                    </span>
                    <span className={`text-sm font-bold ${permission === 'granted' ? 'text-green-600 dark:text-green-400' :
                            permission === 'denied' ? 'text-red-600 dark:text-red-400' :
                                'text-yellow-600 dark:text-yellow-400'
                        }`}>
                        {permission === 'granted' ? '✓ Granted' :
                            permission === 'denied' ? '✗ Denied' :
                                '? Not Set'}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
                {permission !== 'granted' && (
                    <button
                        onClick={handleRequestPermission}
                        disabled={requesting || permission === 'denied'}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <Bell className="w-5 h-5" />
                        {requesting ? 'Requesting...' : 'Request Permission'}
                    </button>
                )}

                {permission === 'granted' && (
                    <button
                        onClick={handleTestNotification}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        <TestTube className="w-5 h-5" />
                        Send Test Notification
                    </button>
                )}

                {permission === 'denied' && (
                    <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700">
                        <div className="flex items-start gap-2">
                            <BellOff className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                            <div className="text-sm text-red-700 dark:text-red-300">
                                <p className="font-semibold mb-1">Permission Denied</p>
                                <p className="text-xs">
                                    Please enable notifications in your browser settings to test this feature.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                    <strong>Note:</strong> This tests the browser notification API used for new campaign alerts and reward notifications.
                </p>
            </div>
        </motion.div>
    );
}
