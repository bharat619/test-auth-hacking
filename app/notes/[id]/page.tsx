"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

interface Note {
  id: string;
  title: string;
  body: string;
  owner: string;
}

export default function NoteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const noteId = params.id as string;

  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(`/api/notes/${noteId}`);
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }
          setError("Note not found.");
          return;
        }
        const data = await response.json();
        setNote(data.note);
        setTitle(data.note.title);
        setBody(data.note.body);
      } catch {
        setError("Failed to load note.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [noteId, router]);

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error ?? "Failed to save note");
        return;
      }

      const data = await response.json();
      setNote(data.note);
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this note?")) return;

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setError("Failed to delete note.");
        return;
      }

      router.push("/notes");
      router.refresh();
    } catch {
      setError("Something went wrong.");
    }
  }

  if (loading) {
    return <main className="p-8">Loading...</main>;
  }

  if (!note && error) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <p className="text-red-600">{error}</p>
        <Link href="/notes" className="mt-4 inline-block text-sm underline">
          Back to notes
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <Link href="/notes" className="text-sm text-neutral-500 hover:underline">
        Back to notes
      </Link>
      <h1 className="mb-6 mt-4 text-2xl font-semibold">Edit note</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
            required
          />
        </div>
        <div>
          <label htmlFor="body" className="mb-1 block text-sm">
            Body
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            className="w-full rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-neutral-900 px-4 py-2 text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded border border-red-300 px-4 py-2 text-red-600 dark:border-red-800"
          >
            Delete
          </button>
        </div>
      </form>
    </main>
  );
}
