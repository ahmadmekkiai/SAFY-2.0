"use client";

import { useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";

export const dynamic = 'force-dynamic';

export default function AuthPage() {
    const [mode, setMode] = useState<"login" | "signup">("login");

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 p-4">
            <ThemeToggle />
            <LanguageToggle />
            <AuthForm mode={mode} onToggleMode={() => setMode(mode === "login" ? "signup" : "login")} />
        </div>
    );
}
