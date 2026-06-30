const IS_VERCEL = process.env.VERCEL === "1" || process.env.CI === "true";

const REQUIRED = [
  "DATABASE_URL",
  "AUTH_SECRET",
  "NEXTAUTH_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_GENERATIVE_AI_API_KEY",
  "ADMIN_SETUP_KEY",
];

const SENTRY_VARS = [
  "NEXT_PUBLIC_SENTRY_DSN",
  "SENTRY_DSN",
  "SENTRY_ORG",
  "SENTRY_PROJECT",
  "SENTRY_AUTH_TOKEN",
];

let exitCode = 0;

for (const key of REQUIRED) {
  if (!process.env[key]) {
    console.error(`  MISSING: ${key}`);
    exitCode = 1;
  }
}

if (exitCode !== 0 && IS_VERCEL) {
  console.error("\n✖ Required environment variables missing. Aborting build.\n");
  process.exit(1);
}

if (exitCode !== 0) {
  console.warn("\n⚠ Some environment variables missing. Build will continue for local dev.\n");
}

const missingSentry = SENTRY_VARS.filter((k) => !process.env[k]);
if (missingSentry.length > 0) {
  console.warn(`  ⚠ Sentry vars not set: ${missingSentry.join(", ")}`);
}

if (exitCode === 0) {
  console.log("✓ Environment variables validated");
}
