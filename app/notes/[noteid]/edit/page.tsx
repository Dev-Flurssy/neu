"use client";

import * as React from "react";
import { NoteForm } from "@/app/components/NoteForm";
import { NoteFormSkeleton } from "@/app/components/NoteFormSkeleton";
import { useNoteSubmit } from "@/app/hooks/useNoteSubmit";
import { useNote } from "@/app/hooks/useNote";
import { PdfEditor } from "@/app/components/PdfEditor";

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

  // Track live content for preview
  const [content, setContent] = React.useState("");

  if (loading || !note) return <NoteFormSkeleton />;

  return (
    <>
      <div className="mx-auto max-w-[210mm] flex justify-between items-center py-4">
        <h1 className="text-xl font-semibold">Edit Note</h1>
      </div>

      <PdfEditor>
        <NoteForm
          initialTitle={note.title}
          initialContent={note.content}
          onSubmit={(data) => submit(data)}
          isSubmitting={isSubmitting}
          error={error}
          onContentChange={setContent}
        />
      </PdfEditor>
    </>
  );
}
