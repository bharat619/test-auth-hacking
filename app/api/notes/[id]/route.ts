import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { jsonError, requireAuth } from "@/lib/api";
import {
  deleteNoteById,
  resolveNoteById,
  updateNoteById,
} from "@/lib/notes";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getSession();
  const authError = requireAuth(session);
  if (authError) return authError;

  const { id } = await context.params;
  const note = await resolveNoteById(id);

  if (!note) {
    return jsonError("Note not found", 404);
  }

  return NextResponse.json({ note });
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await getSession();
  const authError = requireAuth(session);
  if (authError) return authError;

  const { id } = await context.params;

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

  const note = await updateNoteById(id, title, noteBody);
  if (!note) {
    return jsonError("Note not found", 404);
  }

  return NextResponse.json({ note });
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const session = await getSession();
  const authError = requireAuth(session);
  if (authError) return authError;

  const { id } = await context.params;
  const deleted = await deleteNoteById(id);

  if (!deleted) {
    return jsonError("Note not found", 404);
  }

  return NextResponse.json({ ok: true });
}
