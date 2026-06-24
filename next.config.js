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

const { withSentryConfig } = await import("@sentry/nextjs");

export default withSentryConfig(nextConfig, {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
});
