"use client";

import { FileText, Plus, StickyNote } from "lucide-react";
import { NotifyLogo, UserInitial } from "@/components/brand/logo";
import { PlayfulBackground } from "@/components/layout/playful-background";
import { NoteSheet, type NoteData } from "@/components/notes/note-sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface NotesViewProps {
  initialNoteId?: string;
  initialCreate?: boolean;
}

export function NotesView({
  initialNoteId,
  initialCreate = false,
}: NotesViewProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const loadNotes = useCallback(async () => {
    const [meRes, notesRes] = await Promise.all([
      fetch("/api/auth/me"),
      fetch("/api/notes"),
    ]);

    if (!meRes.ok || !notesRes.ok) {
      router.push("/login");
      return false;
    }

    const me = await meRes.json();
    const notesData = await notesRes.json();
    setUsername(me.username);
    setNotes(notesData.notes);
    return true;
  }, [router]);

  useEffect(() => {
    async function init() {
      try {
        const ok = await loadNotes();
        if (!ok) return;

        if (initialNoteId) {
          setActiveNoteId(initialNoteId);
          setSheetOpen(true);
        } else if (initialCreate) {
          setActiveNoteId(null);
          setSheetOpen(true);
        }
      } catch {
        setError("Failed to load notes.");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [initialNoteId, initialCreate, loadNotes]);

  function openCreateSheet() {
    setActiveNoteId(null);
    setSheetOpen(true);
    router.replace("/notes", { scroll: false });
  }

  function openEditSheet(noteId: string) {
    setActiveNoteId(noteId);
    setSheetOpen(true);
    router.replace(`/notes/${noteId}`, { scroll: false });
  }

  function handleSheetOpenChange(open: boolean) {
    setSheetOpen(open);
    if (!open) {
      setActiveNoteId(null);
      router.replace("/notes", { scroll: false });
    }
  }

  function handleSaved(note: NoteData) {
    setNotes((prev) => {
      const exists = prev.some((n) => n.id === note.id);
      if (exists) {
        return prev.map((n) => (n.id === note.id ? note : n));
      }
      return [note, ...prev];
    });
  }

  function handleDeleted(noteId: string) {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="relative min-h-full flex-1">
        <PlayfulBackground />
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-8 h-10 w-40 animate-pulse rounded-xl bg-violet-100" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-36 animate-pulse rounded-2xl bg-white/60 ring-1 ring-violet-100"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-full flex-1">
      <PlayfulBackground />

      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <NotifyLogo size="md" />
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              {notes.length} {notes.length === 1 ? "note" : "notes"}
            </Badge>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 rounded-full border border-violet-100 bg-white/70 px-3 py-1.5 text-sm shadow-sm backdrop-blur-sm">
              <UserInitial username={username} className="size-7 text-xs" />
              <span className="font-medium">{username}</span>
            </div>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={handleLogout}
            >
              Logout
            </Button>
            <Button className="rounded-full shadow-md shadow-violet-500/20" onClick={openCreateSheet}>
              <Plus />
              <span className="hidden sm:inline">New note</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </header>

        {error && (
          <p className="mb-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        {notes.length === 0 ? (
          <Card className="border-dashed border-violet-200 bg-white/70 py-16 text-center shadow-sm backdrop-blur-sm">
            <CardContent className="flex flex-col items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100">
                <StickyNote className="size-8 text-violet-500" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-semibold">No notes yet</h2>
                <p className="mt-1 text-muted-foreground">
                  Tap the button below to capture your first idea!
                </p>
              </div>
              <Button size="lg" className="rounded-full" onClick={openCreateSheet}>
                <Plus />
                Create your first note
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note, index) => {
              const accents = [
                "from-violet-500/10 to-fuchsia-500/5 hover:ring-violet-300/50",
                "from-fuchsia-500/10 to-orange-400/5 hover:ring-fuchsia-300/50",
                "from-orange-400/10 to-amber-300/5 hover:ring-orange-300/50",
                "from-sky-400/10 to-violet-400/5 hover:ring-sky-300/50",
              ];
              const accent = accents[index % accents.length];

              return (
                <Card
                  key={note.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openEditSheet(note.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openEditSheet(note.id);
                    }
                  }}
                  className={`cursor-pointer border-0 bg-gradient-to-br ${accent} shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg hover:ring-2`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="line-clamp-2 font-heading text-lg leading-snug">
                        {note.title}
                      </CardTitle>
                      <FileText className="size-4 shrink-0 text-violet-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                      {note.body || "No content yet — tap to add some!"}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <NoteSheet
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
        noteId={activeNoteId}
        onSaved={handleSaved}
        onDeleted={handleDeleted}
      />

      {notes.length > 0 && (
        <Button
          size="icon-lg"
          className="fixed bottom-6 right-6 size-14 rounded-full shadow-xl shadow-violet-500/30 sm:hidden"
          onClick={openCreateSheet}
          aria-label="Create note"
        >
          <Plus className="size-6" />
        </Button>
      )}
    </div>
  );
}
