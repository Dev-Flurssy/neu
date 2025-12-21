"use client";

import { DashboardView } from "@/app/components/DashboardView";
import { useNotes } from "@/app/hooks/useNotes";

export default function DashboardPage() {
  const { notes, loading, error } = useNotes();
  return <DashboardView notes={notes} loading={loading} error={error} />;
}
