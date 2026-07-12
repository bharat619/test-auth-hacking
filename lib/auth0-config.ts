const PLACEHOLDER_PATTERNS = [
  "placeholder",
  "your-auth0",
  "your-domain",
  "example.com",
  "changeme",
];

function isPlaceholder(value: string | undefined): boolean {
  if (!value) return true;
  const lower = value.toLowerCase();
  return PLACEHOLDER_PATTERNS.some((pattern) => lower.includes(pattern));
}

export function getAuth0Issuer(): string {
  const domain = process.env.AUTH0_DOMAIN?.trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  if (!domain || isPlaceholder(domain)) {
    return "";
  }

  return `https://${domain}`;
}

export type Auth0ConfigStatus =
  | { ok: true; issuer: string }
  | { ok: false; message: string };

export function getAuth0ConfigStatus(): Auth0ConfigStatus {
  const clientId = process.env.AUTH0_CLIENT_ID?.trim();
  const clientSecret = process.env.AUTH0_CLIENT_SECRET?.trim();
  const issuer = getAuth0Issuer();

  if (!clientId || isPlaceholder(clientId)) {
    return {
      ok: false,
      message:
        "AUTH0_CLIENT_ID is missing or still a placeholder. Set it in .env.local from your Auth0 application.",
    };
  }

  if (!clientSecret || isPlaceholder(clientSecret)) {
    return {
      ok: false,
      message:
        "AUTH0_CLIENT_SECRET is missing or still a placeholder. Set it in .env.local from your Auth0 application.",
    };
  }

  if (!issuer) {
    return {
      ok: false,
      message:
        "AUTH0_DOMAIN is missing. Example: AUTH0_DOMAIN=dev-xxxxx.us.auth0.com",
    };
  }

  const authSecret =
    process.env.AUTH_SECRET?.trim() || process.env.AUTH0_SECRET?.trim();
  if (!authSecret || isPlaceholder(authSecret)) {
    return {
      ok: false,
      message:
        "AUTH_SECRET or AUTH0_SECRET is missing. Generate one with: openssl rand -hex 32",
    };
  }

  return { ok: true, issuer };
}

export function applyAuth0EnvAliases(): void {
  if (!process.env.AUTH_SECRET && process.env.AUTH0_SECRET) {
    process.env.AUTH_SECRET = process.env.AUTH0_SECRET;
  }
  if (!process.env.AUTH_URL && process.env.APP_BASE_URL) {
    process.env.AUTH_URL = process.env.APP_BASE_URL;
  }
}
