import { NextResponse } from "next/server";

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export function requireAuth(session: { username: string } | null) {
  if (!session) {
    return jsonError("Unauthorized", 401);
  }
  return null;
}
