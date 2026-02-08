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
  const [refreshKey, setRefreshKey] = React.useState(0);

  React.useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function fetchNotes() {
      setLoading(true);
      setError(null);
      
      try {
        const res = await fetch("/api/notes", {
          credentials: "include",
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Failed to fetch notes");

        const { data } = await res.json();
        if (!cancelled) setNotes(data);
      } catch (err: any) {
        if (!cancelled && err.name !== "AbortError") {
          setError("Unable to load notes");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchNotes();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [refreshKey]);

  function refresh() {
    setRefreshKey(k => k + 1);
  }

  return { notes, loading, error, refresh };
}
