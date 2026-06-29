# Tripzy Security Audit Report

This report documents critical and high-severity security findings in the Tripzy codebase, along with remediation details.

---

## 1. Summary of Findings

| ID | Title | Severity | Status | Description |
| :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | Testing Mode Admin Promotion Bypass | **Critical** | **Open** | If `TESTING_MODE` env variable is set to `"true"`, any signed-in user visiting the admin endpoint is automatically promoted to a full `ADMIN` with database write permissions. |
| **SEC-02** | Unprotected Server Actions exposing user directory | **High** | **Fixed** | The `getAdminUsers` and `getDashboardMetrics` Server Actions were exposed publicly without authentication checks. Any guest could call them to fetch user registries, emails, and site telemetry. |
| **SEC-03** | Weak Admin Promotion Authorization Key | **High** | **Open** | Promoted admins are created via a `POST` route requiring `ADMIN_SETUP_KEY`. A short, weak, or brute-forceable setup key can lead to admin privilege escalation. |
| **SEC-04** | Lack of Sanitization on User-Input Prompts | **Medium** | **Open** | User inputs (`interests`) are directly interpolated into the RAG prompt for Gemini without validation or safety checks. |

---

## 2. Detailed Findings & Mitigation Guidance

### SEC-01: Testing Mode Admin Promotion Bypass (Critical)
- **Location**: `src/app/api/admin/route.ts` (Lines 26–32)
```typescript
    // TESTING_MODE: auto-promote any signed-in user to ADMIN for easy testing
    if (process.env.TESTING_MODE === "true" && user.role !== "ADMIN") {
      user = await db.user.update({
        where: { id: session.user.id },
        data: { role: "ADMIN" },
      });
    }
```
- **Vulnerability**: If the `TESTING_MODE` environment variable is enabled in production, any user who registers via Google login is immediately promoted to `ADMIN`, giving them unrestricted access to add, edit, or delete destinations.
- **Remediation**:
  - Disable `TESTING_MODE` in production immediately.
  - Remove this code snippet before merging to main, or enforce a build-time guard check (e.g. `process.env.NODE_ENV !== "production"`).

### SEC-02: Unprotected Server Actions (High)
- **Location**: `src/backend/actions/adminActions.ts` and `src/backend/actions/analyticsActions.ts`
- **Vulnerability**: Before this audit pass, these files exported server actions (`getAdminUsers`, `getDashboardMetrics`) that queried sensitive database statistics and user registries (including emails) without authentication checks. Any client could import and execute these actions directly.
- **Remediation**:
  - **Fixed**: During this pass, a `verifyAdmin` helper was introduced in both files. They now await the validation of the session and role, throwing an error if the user is not an authorized administrator.

### SEC-03: Weak Admin Promotion Authorization Key (High)
- **Location**: `src/app/api/admin/route.ts` (Lines 56–68)
- **Vulnerability**: The route allows admin generation if `setupKey` matches `process.env.ADMIN_SETUP_KEY`. If this key is simple (e.g., "secret", "tripzy123") or not set, it is vulnerable to brute-force or access denial.
- **Remediation**:
  - Enforce a strong, cryptographically secure 32-character key for `ADMIN_SETUP_KEY`.
  - Disable this endpoint completely once initial admins are provisioned.

### SEC-04: Lack of Sanitization on User-Input Prompts (Medium)
- **Location**: `src/backend/api-handlers/plan-trip.ts` (Line 728)
- **Vulnerability**: User input `interests` is directly placed into the prompt sent to Gemini. A malicious user could craft a prompt injection attack (e.g., instructing the model to output system instructions or ignore schema constraints).
- **Remediation**:
  - Truncate and sanitize user input `interests` to letters and numbers only.
  - Implement length limits (e.g., max 150 characters) on all planner wizard text fields.
