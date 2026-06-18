import { SignJWT, jwtVerify } from "jose";
import { getJwtSecret } from "./constants";

const TOKEN_MAX_AGE = 60 * 60 * 24;

export interface Session {
  username: string;
}

function getSecretKey() {
  return new TextEncoder().encode(getJwtSecret());
}

export async function createSessionToken(username: string): Promise<string> {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_MAX_AGE}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string,
): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    const username = payload.username;
    if (typeof username !== "string" || !username) {
      return null;
    }
    return { username };
  } catch {
    return null;
  }
}

export const TOKEN_MAX_AGE_SECONDS = TOKEN_MAX_AGE;
