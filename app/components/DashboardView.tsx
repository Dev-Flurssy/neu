"use client";

import Link from "next/link";

interface Note {
  id: string;
  title: string;
  content: string;
}

function NoteCardSkeleton() {
  return <div className="h-24 bg-gray-200 rounded animate-pulse" />;
}

interface DashboardViewProps {
  notes: Note[];
  loading: boolean;
  error: string | null;
}

export function DashboardView({ notes, loading, error }: DashboardViewProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <NoteCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20">
        <p className="text-red-500 mb-4">Failed to load notes</p>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center mt-20">
        <p className="text-gray-500 mb-4">No notes yet</p>
        <Link
          href="/notes/new"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create your first note
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">Your Notes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.map((note) => (
          <Link
            key={note.id}
            href={`/notes/${note.id}`}
            aria-label={`View note titled ${note.title}`}
            className="block p-4 border rounded-xl hover:shadow"
          >
            <h3 className="font-medium">{note.title}</h3>
            <p className="text-sm text-gray-500 line-clamp-2">{note.content}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
