/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true },

  // ⚠️ disable PWA temporarily
  // ...withPWA({
  //   dest: "public",
  //   register: true,
  //   skipWaiting: true,
  // }),
};

module.exports = nextConfig;
