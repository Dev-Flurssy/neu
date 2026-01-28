"use client";

import * as React from "react";
import { notFound } from "next/navigation";

interface Note {
  id: string;
  title: string;
  content: string;
}

export function useNote(noteId: string) {
  const [note, setNote] = React.useState<Note | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!noteId) return;

    let cancelled = false;

    async function fetchNote() {
      try {
        const res = await fetch(`/api/notes/${noteId}`, {
          credentials: "include",
        });

        if (res.status === 404) {
          notFound();
        }

        if (!res.ok) {
          throw new Error("Failed to load note");
        }

        const { data } = await res.json();

        if (!cancelled) {
          setNote(data);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || "Unable to load note");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchNote();

    return () => {
      cancelled = true;
    };
  }, [noteId]);

  async function deleteNote() {
    const res = await fetch(`/api/notes/${noteId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to delete note");
    }
  }

  return { note, loading, error, deleteNote };
}
