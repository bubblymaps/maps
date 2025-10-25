import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: ['quenchbuggy.com'],
  },
};

export default nextConfig;
