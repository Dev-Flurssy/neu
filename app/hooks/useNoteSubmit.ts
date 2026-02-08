"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

interface SubmitOptions {
  noteId?: string;
  redirectTo?: string;
  onSuccess?: (noteId: string) => void;
}

type NotePayload = { title: string; content: string };

export function useNoteSubmit({ noteId, redirectTo, onSuccess }: SubmitOptions = {}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  async function submit(data: NotePayload) {
    if (isSubmitting) return; // mobile double-tap protection

    setIsSubmitting(true);
    setError("");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    try {
      const res = await fetch(noteId ? `/api/notes/${noteId}` : "/api/notes", {
        method: noteId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);

        if (body?.message) setError(body.message);
        else if (body?.errors) setError("Please check your input fields.");
        else setError("Something went wrong. Please try again.");

        return;
      }

      const responseData = await res.json();
      const createdOrUpdatedNoteId = responseData?.data?.id || noteId;

      // Call success callback if provided
      if (onSuccess && createdOrUpdatedNoteId) {
        onSuccess(createdOrUpdatedNoteId);
      }

      if (redirectTo) {
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        setError("Network too slow. Try again.");
      } else {
        setError(err.message || "Unexpected error occurred.");
      }
    } finally {
      clearTimeout(timeout);
      setIsSubmitting(false);
    }
  }

  return { submit, isSubmitting, error };
}
