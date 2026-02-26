import createNextIntlPlugin from 'next-intl/plugin';
import withPWAInit from 'next-pwa';

const withNextIntl = createNextIntlPlugin();

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // عشان يسمح بصور المطاعم من أي رابط
      },
    ],
  },
};

// هنا بندمج الـ PWA مع اللغات
export default withPWA(withNextIntl(nextConfig));