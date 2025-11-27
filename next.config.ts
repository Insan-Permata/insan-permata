import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL(process.env.SUPABASE_STORAGE_BUCKET_URL_PREFIX! + "/**")],
    formats: ['image/avif', 'image/webp'],
    qualities: [25, 50, 75],
  },
};

export default nextConfig;
