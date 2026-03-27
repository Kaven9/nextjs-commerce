const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // cacheComponents 现在不需要在 experimental 中
  cacheComponents: true,
  experimental: {
    inlineCss: true,
    useCache: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
    ],
  },
  // 确保正确设置 turbopack 根目录
  turbopack: {
    root: path.resolve(__dirname),
  },
};

module.exports = nextConfig;