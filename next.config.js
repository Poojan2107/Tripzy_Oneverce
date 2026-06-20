/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "10.239.63.71",
    "localhost:3000",
    "localhost",
    "127.0.0.1:3000",
    "127.0.0.1",
  ],
  env: {
    GOOGLE_GENERATIVE_AI_API_KEY:
      process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY,
  },
};

export default nextConfig;
