import { NextResponse } from "next/server";
import { buildClearAuthCookie } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(buildClearAuthCookie());
  return response;
}
