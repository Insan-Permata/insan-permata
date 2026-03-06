import type { NextConfig } from "next";

const supabaseStorageUrl = process.env.SUPABASE_STORAGE_BUCKET_URL_PREFIX

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseStorageUrl
      ? [new URL(supabaseStorageUrl + "/**")]
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
