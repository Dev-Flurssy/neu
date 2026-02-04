"use client";

import { useRouter } from "next/navigation";
import { useNote } from "@/app/hooks/useNote";
import { NoteViewSkeleton } from "@/app/components/skeleton/NoteViewSkeleton";
import PdfPreview from "@/app/components/editor/PdfPreview";
import { ExportDropdown } from "@/app/components/editor/ExportDropdown";

export default function NotePage({ params }: { params: { noteid: string } }) {
  const router = useRouter();
  const { note, loading, error, deleteNote } = useNote(params.noteid);

  async function handleDelete() {
    if (!confirm("Delete this note?")) return;
    await deleteNote();
    router.push("/dashboard");
    router.refresh();
  }

  if (loading) return <NoteViewSkeleton />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!note) return <p>Note not found</p>;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold">{note.title}</h1>

      <PdfPreview html={note.content} />

      <div className="flex gap-2 items-center">
        <ExportDropdown title={note.title} content={note.content} />

        <button
          onClick={handleDelete}
          className="rounded-md bg-red-600 px-4 py-2 text-white"
        >
          Delete
        </button>

        <button
          onClick={() => router.push(`/notes/${note.id}/edit`)}
          className="rounded-md bg-blue-600 px-4 py-2 text-white"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
