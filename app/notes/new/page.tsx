"use client";

import { NoteForm } from "@/app/components/NoteForm";
import { useNoteSubmit } from "@/app/hooks/useNoteSubmit";

export default function NewNotePage() {
  const { submit, isSubmitting, error } = useNoteSubmit({
    redirectTo: "/dashboard",
  });

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create a New Note</h1>
      <NoteForm onSubmit={submit} isSubmitting={isSubmitting} error={error} />
    </div>
  );
}
