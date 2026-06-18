import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { getDataDir } from "./storage";

export interface Note {
  id: string;
  title: string;
  body: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

function userNotesDir(username: string): string {
  return path.join(getDataDir(), "users", username, "notes");
}

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

async function readNoteFile(filePath: string): Promise<Note | null> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as Note;
  } catch {
    return null;
  }
}

export async function listNotesForUser(username: string): Promise<Note[]> {
  const dir = userNotesDir(username);
  await ensureDir(dir);

  let files: string[];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }

  const notes: Note[] = [];
  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const note = await readNoteFile(path.join(dir, file));
    if (note) notes.push(note);
  }

  return notes.sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export async function createNote(
  username: string,
  title: string,
  body: string,
): Promise<Note> {
  const dir = userNotesDir(username);
  await ensureDir(dir);

  const now = new Date().toISOString();
  const note: Note = {
    id: randomUUID(),
    title,
    body,
    owner: username,
    createdAt: now,
    updatedAt: now,
  };

  await fs.writeFile(
    path.join(dir, `${note.id}.json`),
    JSON.stringify(note, null, 2),
    "utf-8",
  );

  return note;
}

async function listAllUserDirs(): Promise<string[]> {
  const usersRoot = path.join(getDataDir(), "users");
  await ensureDir(usersRoot);

  try {
    return await fs.readdir(usersRoot);
  } catch {
    return [];
  }
}

export async function resolveNoteById(id: string): Promise<Note | null> {
  const users = await listAllUserDirs();

  for (const username of users) {
    const filePath = path.join(userNotesDir(username), `${id}.json`);
    const note = await readNoteFile(filePath);
    if (note) return note;
  }

  return null;
}

export async function updateNoteById(
  id: string,
  title: string,
  body: string,
): Promise<Note | null> {
  const note = await resolveNoteById(id);
  if (!note) return null;

  const updated: Note = {
    ...note,
    title,
    body,
    updatedAt: new Date().toISOString(),
  };

  const filePath = path.join(userNotesDir(note.owner), `${id}.json`);
  await fs.writeFile(filePath, JSON.stringify(updated, null, 2), "utf-8");
  return updated;
}

export async function deleteNoteById(id: string): Promise<boolean> {
  const note = await resolveNoteById(id);
  if (!note) return false;

  const filePath = path.join(userNotesDir(note.owner), `${id}.json`);
  await fs.unlink(filePath);
  return true;
}
