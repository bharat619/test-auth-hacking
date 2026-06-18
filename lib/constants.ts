export const AUTH_COOKIE_NAME = "auth_token";

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
}

export function getAuthUsers(): Map<string, string> {
  const raw = process.env.AUTH_USERS ?? "";
  const users = new Map<string, string>();

  for (const entry of raw.split(",")) {
    const trimmed = entry.trim();
    if (!trimmed) continue;
    const separator = trimmed.indexOf(":");
    if (separator === -1) continue;
    const username = trimmed.slice(0, separator).trim();
    const password = trimmed.slice(separator + 1).trim();
    if (username && password) {
      users.set(username, password);
    }
  }

  return users;
}
