import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import PWAInstallButton from '@/components/PWAInstallButton'; // سطر استدعاء الزرار

const locales = ['en', 'ar'];

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

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
                <PWAInstallButton /> {/* الزرار هيظهر هنا فوق كل المحتوى */}
            </div>
        </NextIntlClientProvider>
    );
}