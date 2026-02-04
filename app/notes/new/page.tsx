"use client";

import { NoteForm } from "@/app/components/notes/NoteForm";
import { NoteFormSkeleton } from "@/app/components/skeleton/NoteFormSkeleton";
import { useNoteSubmit } from "@/app/hooks/useNoteSubmit";

export default function NewNotePage() {
  const { submit, isSubmitting, error } = useNoteSubmit({
    redirectTo: "/dashboard",
  });

  return (
    <div
      className="
        w-full 
        max-w-7xl 
        mx-auto 
        px-4 
        sm:px-6 
        lg:px-8 
        py-6 
        space-y-6
      "
    >
      <h1 className="text-2xl font-bold">Create a New Note</h1>

      {isSubmitting ? (
        <NoteFormSkeleton />
      ) : (
        <NoteForm onSubmit={submit} isSubmitting={isSubmitting} error={error} />
      )}
    </div>
  );
}
