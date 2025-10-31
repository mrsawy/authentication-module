import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  // output: 'standalone',
  reactStrictMode: true,
  productionBrowserSourceMaps: false,

  images: {
    domains: [],
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;