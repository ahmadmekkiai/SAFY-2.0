import withPWA from "@ducanh2912/next-pwa";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // تجاهل أخطاء التفتيش وقت الرفع
        ignoreDuringBuilds: true,
    },
    typescript: {
        // تأمين إضافي عشان نتجاهل أي أخطاء من التايب سكريبت
        ignoreBuildErrors: true,
    },
    reactStrictMode: true,
    output: 'standalone',
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'picsum.photos',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'source.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: '**.supabase.co',
            },
            {
                protocol: 'https',
                hostname: 'upload.wikimedia.org',
            },
        ],
    },
};

export default withNextIntl(withPWA({
    dest: "public",
    disable: process.env.NODE_ENV === "development",
    register: true,
})(nextConfig));