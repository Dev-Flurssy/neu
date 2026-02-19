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

    const controller = new AbortController();
    let cancelled = false;

    async function fetchNote() {
      try {
        const res = await fetch(`/api/notes/${noteId}`, {
          credentials: "include",
          signal: controller.signal,
        });

        if (res.status === 404) notFound();
        if (!res.ok) throw new Error("Failed to load note");

        const { data } = await res.json();
        if (!cancelled) setNote(data);
      } catch (err: any) {
        if (!cancelled && err.name !== "AbortError") {
          setError(err.message || "Unable to load note");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchNote();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [noteId]);

  async function updateNote(updates: Partial<Note>) {
    // Optimistic update
    setNote(prev => prev ? { ...prev, ...updates } : null);

    try {
      const res = await fetch(`/api/notes/${noteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });

      if (!res.ok) {
        // Revert on failure - refetch the note
        const revertRes = await fetch(`/api/notes/${noteId}`, {
          credentials: "include",
        });
        if (revertRes.ok) {
          const { data } = await revertRes.json();
          setNote(data);
        }
        throw new Error("Failed to update note");
      }

      const { data } = await res.json();
      // Force a new object reference to trigger re-renders
      setNote({ ...data });
    } catch (err: any) {
      setError(err.message || "Failed to update note");
      throw err;
    }
  }

  async function refreshNote() {
    try {
      const res = await fetch(`/api/notes/${noteId}`, {
        credentials: "include",
      });
      if (res.ok) {
        const { data } = await res.json();
        setNote({ ...data });
      }
    } catch (err) {
      console.error("Failed to refresh note:", err);
    }
  }

  async function deleteNote() {
    const res = await fetch(`/api/notes/${noteId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to delete note");
  }

  return { note, loading, error, updateNote, deleteNote, refreshNote };
}
