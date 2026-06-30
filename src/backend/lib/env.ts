const REQUIRED: string[] = [
  "DATABASE_URL",
  "AUTH_SECRET",
  "NEXTAUTH_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_GENERATIVE_AI_API_KEY",
  "ADMIN_SETUP_KEY",
];

const SENTRY_VARS: string[] = [
  "NEXT_PUBLIC_SENTRY_DSN",
  "SENTRY_DSN",
  "SENTRY_ORG",
  "SENTRY_PROJECT",
  "SENTRY_AUTH_TOKEN",
];

export function checkEnv(): string[] {
  const missing: string[] = [];

  for (const key of REQUIRED) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  for (const key of SENTRY_VARS) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  return missing;
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}
