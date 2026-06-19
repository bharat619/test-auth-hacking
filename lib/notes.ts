import { ensureSchema, getSql } from "./db";

export interface Note {
  id: string;
  title: string;
  body: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteRow {
  id: string;
  owner: string;
  title: string;
  body: string;
  created_at: Date;
  updated_at: Date;
}

function rowToNote(row: NoteRow): Note {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    owner: row.owner,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function listNotesForUser(username: string): Promise<Note[]> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql<NoteRow[]>`
    SELECT id, owner, title, body, created_at, updated_at
    FROM notes
    WHERE owner = ${username}
    ORDER BY updated_at DESC
  `;
  return rows.map(rowToNote);
}

export async function createNote(
  username: string,
  title: string,
  body: string,
): Promise<Note> {
  await ensureSchema();
  const sql = getSql();
  const [row] = await sql<NoteRow[]>`
    INSERT INTO notes (owner, title, body)
    VALUES (${username}, ${title}, ${body})
    RETURNING id, owner, title, body, created_at, updated_at
  `;
  return rowToNote(row);
}

export async function resolveNoteById(id: string): Promise<Note | null> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql<NoteRow[]>`
    SELECT id, owner, title, body, created_at, updated_at
    FROM notes
    WHERE id = ${id}
    LIMIT 1
  `;
  return rows[0] ? rowToNote(rows[0]) : null;
}

export async function updateNoteById(
  id: string,
  title: string,
  body: string,
): Promise<Note | null> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql<NoteRow[]>`
    UPDATE notes
    SET title = ${title}, body = ${body}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, owner, title, body, created_at, updated_at
  `;
  return rows[0] ? rowToNote(rows[0]) : null;
}

export async function deleteNoteById(id: string): Promise<boolean> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql<{ id: string }[]>`
    DELETE FROM notes
    WHERE id = ${id}
    RETURNING id
  `;
  return rows.length > 0;
}
