/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "10.239.63.71",
    "localhost:3000",
    "localhost",
    "127.0.0.1:3000",
    "127.0.0.1",
  ],
  serverExternalPackages: ["@google/genai", "@sentry/nextjs"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "**.cloudfront.net" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.googleapis.com" },
      { protocol: "https", hostname: "flagcdn.com" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/explore",
        destination: "/#explore",
        permanent: true,
      },
      {
        source: "/ai-planner",
        destination: "/#ai-planner",
        permanent: true,
      },
      {
        source: "/saved",
        destination: "/#saved",
        permanent: true,
      },
    ];
  },
};

const withBundleAnalyzer = process.env.ANALYZE === "true"
  ? (await import("@next/bundle-analyzer")).default({ enabled: true })
  : (config) => config;

const { withSentryConfig } = await import("@sentry/nextjs");

const baseConfig = withBundleAnalyzer(nextConfig);

export default withSentryConfig(baseConfig, {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
});
