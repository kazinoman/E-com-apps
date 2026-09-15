import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev-only: the app is reached on 127.0.0.1 while the dev server binds
  // localhost, so Next treats HMR as cross-origin and blocks it.
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",

      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: "",
        pathname: "/**",
      },
      // Catalog imagery is served straight from Alibaba's CDN (cbu01..cbu04,
      // img.alicdn.com). Without this every product image throws "Invalid src
      // prop" and takes the whole route down, not just the picture.
      {
        protocol: "https",
        hostname: "**.alicdn.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
