import type { NextConfig } from "next";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : null;

// Build a strict CSP. js.stripe.com is needed for Stripe.js, the Supabase
// hostname for storage/auth, and Turnstile for the bot-check widget. Everything
// else falls back to 'self'. Inline scripts/styles get 'unsafe-inline' because
// Next.js still ships some inline runtime — tightening this further requires
// nonce-based CSP via middleware.
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://challenges.cloudflare.com`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob:${supabaseHostname ? ` https://${supabaseHostname}` : ''}`,
  `font-src 'self' data:`,
  `connect-src 'self'${supabaseHostname ? ` https://${supabaseHostname} wss://${supabaseHostname}` : ''} https://api.stripe.com https://challenges.cloudflare.com`,
  `frame-src https://js.stripe.com https://hooks.stripe.com https://challenges.cloudflare.com`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `form-action 'self' https://checkout.stripe.com`,
  `object-src 'none'`,
  `upgrade-insecure-requests`,
].join('; ');

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'Content-Security-Policy', value: csp },
];

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
    qualities: [25, 50, 75, 85],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
