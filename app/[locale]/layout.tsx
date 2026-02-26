import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata, Viewport } from 'next'; 
import PWAInstallButton from '@/components/PWAInstallButton'; 

const locales = ['en', 'ar'];

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

// ضفنا منع الزووم عشان يدي إحساس التطبيق الحقيقي
export const viewport: Viewport = {
  themeColor: '#1a233a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'SAFY', 
  description: 'Your Time, Your Rewards',
  manifest: '/manifest.json',
  applicationName: 'SAFY', // السطر ده مهم جداً عشان يظهر كاسم تطبيق مستقل في الخلفية
  icons: {
    icon: '/icon-192x192.png',
    shortcut: '/icon-192x192.png',
    apple: '/icon-192x192.png', 
  },
  // السطور دي بتجبر الآيفون إنه يخفي شريط المتصفح
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SAFY',
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