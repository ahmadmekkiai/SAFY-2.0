import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { PWAPermissions } from "@/components/PWAPermissions";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const viewport: Viewport = {
    themeColor: "#D4AF37",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export const metadata: Metadata = {
    title: "SAFY - Your Time, Your Rewards",
    description: "Smart rewards platform for Saudi Arabia",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "SAFY",
    },
    formatDetection: {
        telephone: false,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="manifest" href="/manifest.json" />
            </head>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <PWAPermissions />
                </ThemeProvider>
            </body>
        </html>
    );
}
