import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "images-na.ssl-images-amazon.com" },
      { protocol: "https", hostname: "images.walmart.com" },
      { protocol: "https", hostname: "i5.walmartimages.com" },
      { protocol: "https", hostname: "target.scene7.com" },
      { protocol: "https", hostname: "mobileimages.lowes.com" },
      { protocol: "https", hostname: "cosori.com" },
      { protocol: "https", hostname: "instantpot.com" },
    ],
  },
};

export default nextConfig;
