"use client";

import { NoteForm } from "@/app/components/NoteForm";
import { NoteFormSkeleton } from "@/app/components/NoteFormSkeleton";
import { useNoteSubmit } from "@/app/hooks/useNoteSubmit";

export default function NewNotePage() {
  const { submit, isSubmitting, error } = useNoteSubmit({
    redirectTo: "/dashboard",
  });

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Create a New Note</h1>

      {isSubmitting ? (
        <NoteFormSkeleton />
      ) : (
        <NoteForm onSubmit={submit} isSubmitting={isSubmitting} error={error} />
      )}
    </div>
  );
}
