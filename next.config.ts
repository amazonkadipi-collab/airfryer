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
      { protocol: "https", hostname: "djd1xqjx2kdnv.cloudfront.net" },
      { protocol: "https", hostname: "smartmag.biz.ua" },
      { protocol: "https", hostname: "www.cuisinart.ca" },
      { protocol: "https", hostname: "i.ebayimg.com" },
    ],
  },
};

export default nextConfig;
