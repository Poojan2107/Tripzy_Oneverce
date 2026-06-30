#!/usr/bin/env node
// Usage: node scripts/setup-admin.mjs client@email.com
// Requires ADMIN_SETUP_KEY in .env or environment

const email = process.argv[2];
if (!email) {
  console.error("Usage: node scripts/setup-admin.mjs <email>");
  console.error("  Requires ADMIN_SETUP_KEY env var set");
  process.exit(1);
}

const url = process.env.VERCEL_URL || "https://travebie-oneverce.vercel.app";
const setupKey = process.env.ADMIN_SETUP_KEY;

if (!setupKey) {
  console.error("ADMIN_SETUP_KEY not set in environment");
  process.exit(1);
}

async function main() {
  console.log(`Promoting ${email} to admin on ${url}...`);
  try {
    const res = await fetch(`${url}/api/admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, setupKey }),
    });
    const data = await res.json();
    if (res.ok) {
      console.log("Admin access granted:", data.message);
      console.log("Email:", data.email, "Role:", data.role);
    } else {
      console.error("Error:", data.error);
      process.exit(1);
    }
  } catch (err) {
    console.error("Network error:", err.message);
    process.exit(1);
  }
}

main();
