import { headers } from "next/headers";
import { getAuth0CallbackPath } from "@/lib/auth0-config";

export async function getAuthCallbackUrl(): Promise<string> {
  const configuredBase =
    process.env.AUTH_URL?.trim() || process.env.APP_BASE_URL?.trim();

  if (configuredBase && !process.env.VERCEL) {
    return `${configuredBase.replace(/\/$/, "")}${getAuth0CallbackPath()}`;
  }

  const headerStore = await headers();
  const host =
    headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "localhost:3000";
  const protocol = headerStore.get("x-forwarded-proto") ?? "http";

  return `${protocol}://${host}${getAuth0CallbackPath()}`;
}
