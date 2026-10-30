import type { NextConfig } from "next";

// Allow next/image to optimise media served from the S3/R2 public bucket URL.
const remotePatterns: NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]> = [];
if (process.env.S3_PUBLIC_URL) {
  try {
    const u = new URL(process.env.S3_PUBLIC_URL);
    remotePatterns.push({
      protocol: u.protocol.replace(":", "") as "http" | "https",
      hostname: u.hostname,
      pathname: "/**",
    });
  } catch {
    // ignore malformed URL — images will fall back to unoptimised loading
  }
}

// Google Translate (language switch) loads its script, styles and translations from these hosts.
const GOOGLE_TRANSLATE = "https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com https://www.gstatic.com";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' ${GOOGLE_TRANSLATE}` + (process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""),
      `style-src 'self' 'unsafe-inline' ${GOOGLE_TRANSLATE}`,
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      `connect-src 'self' ${GOOGLE_TRANSLATE}`,
      `frame-src https://www.google.com https://maps.google.com https://www.openstreetmap.org ${GOOGLE_TRANSLATE}`,
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  // Always render <title>/<meta> in the initial <head> (instead of streaming them
  // into <body>) so every crawler, social preview scraper and audit tool sees them.
  htmlLimitedBots: /.*/,
  images: {
    remotePatterns,
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    serverActions: { bodySizeLimit: "12mb" },
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
