/**
 * Validate environment variables on import.
 * Server-side only — never expose secret keys to the client.
 */

interface EnvVar {
  key: string;
  required: boolean;
  secret?: boolean;
}

const ENV_VARS: EnvVar[] = [
  { key: "OPENROUTER_API_KEY", required: false, secret: true },
  { key: "NEXT_PUBLIC_SUPABASE_URL", required: false },
  { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", required: false },
  { key: "STRIPE_SECRET_KEY", required: false, secret: true },
  { key: "STRIPE_WEBHOOK_SECRET", required: false, secret: true },
];

export function validateEnv(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  for (const v of ENV_VARS) {
    if (v.required && !process.env[v.key]) {
      missing.push(v.key);
    }
  }

  if (missing.length > 0) {
    console.warn(
      `[env] Missing required environment variables: ${missing.join(", ")}`
    );
  }

  return { valid: missing.length === 0, missing };
}

/**
 * Get a required server-side env var. Throws if missing.
 */
export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Get an optional server-side env var with a fallback.
 */
export function getEnv(key: string, fallback = ""): string {
  return process.env[key] || fallback;
}
