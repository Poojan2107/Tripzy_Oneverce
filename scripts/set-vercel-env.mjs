#!/usr/bin/env node
// Usage: node scripts/set-vercel-env.mjs KEY VALUE [environment]
// Sets a Vercel environment variable cleanly via REST API
const projectId = "prj_4i2zmUWzcOPkSJVKsStRxGnNqlYJ";
const teamId = "team_lV0JQ89n4zbZaiUlX48E3RqW";

const key = process.argv[2];
const value = process.argv[3];
const target = process.argv[4] || "production";

if (!key || value === undefined) {
  console.error("Usage: node scripts/set-vercel-env.mjs KEY VALUE [environment]");
  process.exit(1);
}

async function main() {
  try {
    // Use the Vercel CLI OIDC token for auth
    const token = process.env.VERCEL_OIDC_TOKEN || process.env.VERCEL_TOKEN;
    
    const res = await fetch(
      `https://api.vercel.com/v10/projects/${projectId}/env?teamId=${teamId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key,
          value,
          target: [target],
          type: "encrypted",
        }),
      }
    );

    const data = await res.json();
    if (res.ok) {
      console.log(`Set ${key}=${value} on ${target}`);
    } else {
      // If exists, delete and retry
      if (res.status === 400 && data.error?.code === "env_already_exists") {
        // Find and delete the existing env
        const listRes = await fetch(
          `https://api.vercel.com/v10/projects/${projectId}/env?teamId=${teamId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const listData = await listRes.json();
        const existing = listData.envs?.find((e: any) => e.key === key && e.target?.includes(target));
        if (existing) {
          const delRes = await fetch(
            `https://api.vercel.com/v10/projects/${projectId}/env/${existing.id}?teamId=${teamId}`,
            { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
          );
          if (delRes.ok) {
            // Retry create
            const retryRes = await fetch(
              `https://api.vercel.com/v10/projects/${projectId}/env?teamId=${teamId}`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  key,
                  value,
                  target: [target],
                  type: "encrypted",
                }),
              }
            );
            const retryData = await retryRes.json();
            if (retryRes.ok) {
              console.log(`Set ${key}=${value} on ${target} (replaced)`);
            } else {
              console.error("Failed after retry:", retryData.error?.message || JSON.stringify(retryData));
              process.exit(1);
            }
          }
        }
      } else {
        console.error("Error:", data.error?.message || JSON.stringify(data));
        process.exit(1);
      }
    }
  } catch (err) {
    console.error("Network error:", err.message);
    process.exit(1);
  }
}

main();
