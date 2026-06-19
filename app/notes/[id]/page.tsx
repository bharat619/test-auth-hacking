import { NotesView } from "@/components/notes/notes-view";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function NoteDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <NotesView initialNoteId={id} />;
}
