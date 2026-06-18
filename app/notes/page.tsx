"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Note {
  id: string;
  title: string;
  body: string;
}

export default function NotesPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [meRes, notesRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/notes"),
        ]);

        if (!meRes.ok || !notesRes.ok) {
          router.push("/login");
          return;
        }

        const me = await meRes.json();
        const notesData = await notesRes.json();
        setUsername(me.username);
        setNotes(notesData.notes);
      } catch {
        setError("Failed to load notes.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  if (loading) {
    return <main className="p-8">Loading...</main>;
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My Notes</h1>
          <p className="text-sm text-neutral-500">Signed in as {username}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/notes/new"
            className="rounded bg-neutral-900 px-3 py-2 text-sm text-white dark:bg-neutral-100 dark:text-neutral-900"
          >
            New note
          </Link>
          <button
            onClick={handleLogout}
            className="rounded border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700"
          >
            Logout
          </button>
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {notes.length === 0 ? (
        <p className="text-neutral-500">No notes yet. Create your first one.</p>
      ) : (
        <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {notes.map((note) => (
            <li key={note.id} className="py-4">
              <Link href={`/notes/${note.id}`} className="block hover:opacity-80">
                <h2 className="font-medium">{note.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-neutral-500">
                  {note.body || "No content"}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
