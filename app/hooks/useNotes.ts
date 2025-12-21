"use client";
import * as React from "react";

interface Note {
  id: string;
  title: string;
  content: string;
}

export function useNotes() {
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function fetchNotes() {
      try {
        const res = await fetch("/api/notes", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch notes");

        const { data } = await res.json(); // ✅ unwrap
        if (!cancelled) setNotes(data);
      } catch {
        if (!cancelled) setError("Unable to load notes");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchNotes();
    return () => {
      cancelled = true;
    };
  }, []);

  return { notes, loading, error };
}
