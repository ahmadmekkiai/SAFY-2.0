import createNextIntlPlugin from 'next-intl/plugin';
import withPWAInit from 'next-pwa';

// التعديل هنا: حددنا مسار ملف الترجمة بوضوح
const withNextIntl = createNextIntlPlugin('./i18n.ts'); 

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
        hostname: '**', 
      },
    ],
  },
};

export default withPWA(withNextIntl(nextConfig));