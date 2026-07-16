import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Gelecekte eklenebilecek Next.js ayarları buraya gelebilir.
};

export default withPWA(nextConfig);
