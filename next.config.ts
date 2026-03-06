import type { NextConfig } from "next";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHostname
      ? [
        {
          protocol: 'https',
          hostname: supabaseHostname,
          pathname: '/**',
        },
      ]
      : [],
    formats: ['image/avif', 'image/webp'],
    qualities: [25, 50, 75],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
};

export default nextConfig;
