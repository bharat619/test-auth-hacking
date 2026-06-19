"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

export interface NoteData {
  id: string;
  title: string;
  body: string;
}

interface NoteSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteId?: string | null;
  onSaved: (note: NoteData) => void;
  onDeleted?: (noteId: string) => void;
}

export function NoteSheet({
  open,
  onOpenChange,
  noteId,
  onSaved,
  onDeleted,
}: NoteSheetProps) {
  const isEditing = Boolean(noteId);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setTitle("");
      setBody("");
      setError("");
      return;
    }

    if (!noteId) return;

    async function loadNote() {
      setFetching(true);
      setError("");
      try {
        const response = await fetch(`/api/notes/${noteId}`);
        if (!response.ok) {
          setError("Could not load this note.");
          return;
        }
        const data = await response.json();
        setTitle(data.note.title);
        setBody(data.note.body);
      } catch {
        setError("Could not load this note.");
      } finally {
        setFetching(false);
      }
    }

    loadNote();
  }, [open, noteId]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const trimmedTitle = title.trim();
      if (!trimmedTitle) {
        setError("Title is required.");
        return;
      }

      const response = await fetch(
        isEditing ? `/api/notes/${noteId}` : "/api/notes",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: trimmedTitle, body: body.trim() }),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.error ?? "Something went wrong.");
        return;
      }

      const data = await response.json();
      onSaved(data.note);
      onOpenChange(false);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!noteId || !confirm("Delete this note?")) return;

    setDeleting(true);
    setError("");
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setError("Failed to delete note.");
        return;
      }

      onDeleted?.(noteId);
      onOpenChange(false);
    } catch {
      setError("Failed to delete note.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-violet-100 p-0 sm:max-w-lg"
      >
        <SheetHeader className="border-b border-violet-100/80 bg-violet-50/50 p-5">
          <SheetTitle className="font-heading text-xl">
            {isEditing ? "Edit note" : "New note"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update your note and save when ready."
              : "Jot something down — big or small!"}
          </SheetDescription>
        </SheetHeader>

        {fetching ? (
          <div className="flex flex-1 items-center justify-center p-8">
            <Loader2 className="size-8 animate-spin text-violet-500" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              <div className="space-y-2">
                <Label htmlFor="note-title">Title</Label>
                <Input
                  id="note-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What's on your mind?"
                  className="h-11 rounded-xl"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="note-body">Body</Label>
                <Textarea
                  id="note-body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write your note here..."
                  rows={10}
                  className="min-h-[200px] resize-none rounded-xl"
                />
              </div>
              {error && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}
            </div>

            <SheetFooter className="flex-row gap-2 border-t border-violet-100/80 bg-background p-5">
              {isEditing && (
                <Button
                  type="button"
                  variant="destructive"
                  className="rounded-xl"
                  onClick={handleDelete}
                  disabled={deleting || loading}
                >
                  {deleting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Trash2 />
                  )}
                  Delete
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                className="rounded-xl sm:ml-auto"
                onClick={() => onOpenChange(false)}
                disabled={loading || deleting}
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl" disabled={loading || deleting}>
                {loading && <Loader2 className="animate-spin" />}
                {isEditing ? "Save changes" : "Create note"}
              </Button>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
