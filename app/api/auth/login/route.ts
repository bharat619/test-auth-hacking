import { NextRequest, NextResponse } from "next/server";
import {
  buildAuthCookie,
  createSessionTokenForUser,
  validateCredentials,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const username = body.username?.trim();
  const password = body.password ?? "";

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required" },
      { status: 400 },
    );
  }

  if (!validateCredentials(username, password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await createSessionTokenForUser(username);
  const response = NextResponse.json({ username });
  response.cookies.set(buildAuthCookie(token));
  return response;
}
