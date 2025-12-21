"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

interface SubmitOptions {
  noteId?: string;
  redirectTo?: string;
}

type NotePayload = { title: string; content: string };

export function useNoteSubmit({ noteId, redirectTo }: SubmitOptions = {}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  async function submit(data: NotePayload) {
    if (isSubmitting) return; // prevent double submit
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(noteId ? `/api/notes/${noteId}` : "/api/notes", {
        method: noteId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const { message } = await res.json().catch(() => ({ message: "" }));
        setError(message || "Something went wrong. Please try again.");
        return;
      }

      router.push(redirectTo ?? "/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return { submit, isSubmitting, error };
}
