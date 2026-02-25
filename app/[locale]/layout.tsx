import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata, Viewport } from 'next'; // نقلنا الاستدعاء ده لفوق خالص
import PWAInstallButton from '@/components/PWAInstallButton'; 

const locales = ['en', 'ar'];

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

// التحديث الجديد لـ Next.js بيطلب لون الثيم يكون هنا
export const viewport: Viewport = {
  themeColor: '#D4AF37',
};

export const metadata: Metadata = {
  title: 'SAFY App',
  description: 'SAFY Mobile Application',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192x192.png',
    shortcut: '/icon-192x192.png',
    apple: '/icon-192x192.png', // أيقونة الآيفون
  },
};

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!locales.includes(locale)) {
        notFound();
    }

    const messages = await getMessages({ locale });

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <div lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="h-full">
                {children}
                <PWAInstallButton />
            </div>
        </NextIntlClientProvider>
    );
}