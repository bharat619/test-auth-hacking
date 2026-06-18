import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, getAuthUsers } from "./constants";
import {
  createSessionToken,
  TOKEN_MAX_AGE_SECONDS,
  verifySessionToken,
} from "./jwt";

export type { Session } from "./jwt";

export async function createSessionTokenForUser(
  username: string,
): Promise<string> {
  return createSessionToken(username);
}

export { verifySessionToken };

export function validateCredentials(
  username: string,
  password: string,
): boolean {
  const users = getAuthUsers();
  return users.get(username) === password;
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function buildAuthCookie(token: string) {
  return {
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: TOKEN_MAX_AGE_SECONDS,
  };
}

export function buildClearAuthCookie() {
  return {
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}
