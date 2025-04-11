import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cha.veerit.com",
      },
      {
        protocol: "https",
        hostname: "classichorseauction.com",
      },
      {
        protocol: "https",
        hostname: "classichorseauction.com/stage",
      },
    ],
    minimumCacheTTL: 60,
  },

  // CORS Headers Configuration
  async headers() {
    return [
      {
        source: "/api/uwa-auctions",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },

  // Proxy Setup for API Requests
  async rewrites() {
    return [
      {
        source: "/api/uwa-auctions",
        destination:
          "https://classichorseauction.com/stage/graphql/my-account/uwa-auctions/",
      },
    ];
  },
};

export default nextConfig;
