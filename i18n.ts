import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

const locales = ['en', 'ar'];

export default getRequestConfig(async ({ locale }) => {
    // Fallback to 'en' if locale is undefined or invalid
    const validLocale = locale && locales.includes(locale) ? locale : 'en';

    // Validate locale - if not in our list, use 'en' as fallback
    if (!locales.includes(validLocale as any)) {
        return {
            locale: 'en',
            messages: (await import(`./messages/en.json`)).default
        };
    }

    try {
        // Try to import the locale messages
        const messages = (await import(`./messages/${validLocale}.json`)).default;

        return {
            locale: validLocale,
            messages
        };
    } catch (error) {
        // If import fails, fallback to English
        console.error(`Failed to load messages for locale: ${validLocale}, falling back to 'en'`, error);

        return {
            locale: 'en',
            messages: (await import(`./messages/en.json`)).default
        };
    }
});
