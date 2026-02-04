"use client";

import * as React from "react";
import { NoteForm } from "@/app/components/notes/NoteForm";
import { NoteFormSkeleton } from "@/app/components/skeleton/NoteFormSkeleton";
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

  const { note, loading } = useNote(params.noteid);

  if (loading || !note) return <NoteFormSkeleton />;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold">Edit Note</h1>

      <NoteForm
        initialTitle={note.title}
        initialContent={note.content}
        onSubmit={submit}
        isSubmitting={isSubmitting}
        error={error}
      />
    </div>
  );
}
