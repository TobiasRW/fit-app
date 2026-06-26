import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 3600,
      static: 300,
    },
  },
};

export default nextConfig;
