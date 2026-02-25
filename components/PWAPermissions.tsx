"use client";

import { useEffect, useState } from "react";
import { Bell, MapPin, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function PWAPermissions() {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const checkPermissions = async () => {
            let needsPrompt = false;

            // Check Notifications
            if ("Notification" in window) {
                if (Notification.permission === "default") {
                    needsPrompt = true;
                }
            }

            // Geolocation Permissions API check
            if (navigator.permissions) {
                try {
                    const geoStatus = await navigator.permissions.query({ name: 'geolocation' });
                    if (geoStatus.state === "prompt") {
                        needsPrompt = true;
                    }
                } catch (e) {
                    // Ignore Safari strict errors
                }
            }

            // Only show modal once per session
            const hasSeenPrompt = sessionStorage.getItem("pwa_perms_prompt");
            if (needsPrompt && !hasSeenPrompt) {
                setTimeout(() => setShowModal(true), 2500); // Wait 2.5s before prompting
            }
        };

        checkPermissions();
    }, []);

    const handleEnable = async () => {
        sessionStorage.setItem("pwa_perms_prompt", "true");

        // Request Notifications
        if ("Notification" in window && Notification.permission === "default") {
            await Notification.requestPermission();
        }

        // Request Geolocation
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                () => console.log("GPS granted"),
                (e) => console.log("GPS denied", e)
            );
        }

        setShowModal(false);
    };

    const handleDismiss = () => {
        sessionStorage.setItem("pwa_perms_prompt", "true");
        setShowModal(false);
    };

    return (
        <AnimatePresence>
            {showModal && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.95 }}
                    className="fixed bottom-24 left-4 right-4 z-50 bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-700 max-w-sm mx-auto"
                >
                    <button onClick={handleDismiss} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex gap-3 mb-4 mt-2">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                            <Bell className="w-6 h-6" />
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Enable App Experience</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                        SAFY works best when you enable Location for hyper-local deals and Notifications for instant cash rewards.
                    </p>

                    <div className="flex gap-3">
                        <button onClick={handleDismiss} className="flex-1 py-3.5 rounded-xl font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors">
                            Maybe Later
                        </button>
                        <button onClick={handleEnable} className="flex-1 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all active:scale-95">
                            Enable Now
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
