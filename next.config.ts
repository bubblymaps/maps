import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'quenchbuggy.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
