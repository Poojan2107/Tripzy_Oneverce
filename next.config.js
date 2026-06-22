/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "10.239.63.71",
    "localhost:3000",
    "localhost",
    "127.0.0.1:3000",
    "127.0.0.1",
  ],
  serverExternalPackages: ["@ai-sdk/google", "ai"],
};

export default nextConfig;
