import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { jsonError, requireAuth } from "@/lib/api";
import { createNote, listNotesForUser } from "@/lib/notes";

export async function GET() {
  const session = await getSession();
  const authError = requireAuth(session);
  if (authError) return authError;

  const notes = await listNotesForUser(session!.username);
  return NextResponse.json({ notes });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  const authError = requireAuth(session);
  if (authError) return authError;

  let body: { title?: string; body?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid request body", 400);
  }

  const title = body.title?.trim();
  const noteBody = body.body?.trim() ?? "";

  if (!title) {
    return jsonError("Title is required", 400);
  }

  const note = await createNote(session!.username, title, noteBody);
  return NextResponse.json({ note }, { status: 201 });
}
