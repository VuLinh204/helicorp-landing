import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
  },

  // Enable compression
  compress: true,

  // PoweredByHeader: hide for security
  poweredByHeader: false,

  // Strict mode for better React practices
  reactStrictMode: true,

  // Production source maps off for smaller bundles
  productionBrowserSourceMaps: false,
};

export default nextConfig;
