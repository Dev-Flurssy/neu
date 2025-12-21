"use client";

import { NoteForm } from "@/app/components/NoteForm";
import { useNoteSubmit } from "@/app/hooks/useNoteSubmit";
import { useNote } from "@/app/hooks/useNote";

export default function EditNotePage({
  params,
}: {
  params: { noteid: string };
}) {
  const { submit, isSubmitting, error } = useNoteSubmit({
    noteId: params.noteid,
    redirectTo: `/notes/${params.noteid}`,
  });

  const { note, loading, error: noteError } = useNote(params.noteid);

  if (loading) return <p>Loading...</p>;
  if (noteError) return <p>{noteError}</p>;
  if (!note) return <p>Note not found</p>;

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Note</h1>
      <NoteForm
        onSubmit={submit}
        isSubmitting={isSubmitting}
        error={error}
        defaultValues={{
          title: note.title,
          content: note.content,
        }}
      />
    </div>
  );
}
