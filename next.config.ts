import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable minimal runtime image via Next.js standalone output
  output: 'standalone',
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
