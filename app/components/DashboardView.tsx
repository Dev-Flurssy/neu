"use client";

import Link from "next/link";
import { NoteCardSkeleton } from "./NoteCardSkeleton";

interface Note {
  id: string;
  title: string;
  content: string;
}

interface DashboardViewProps {
  notes: Note[];
  loading: boolean;
  error: string | null;
}

export function DashboardView({ notes, loading, error }: DashboardViewProps) {
  return (
    <div className="min-h-[70vh] w-full max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Loading State */}
      {loading && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <NoteCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="text-center mt-20">
          <p className="text-red-500 mb-4">Failed to load notes</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && notes.length === 0 && (
        <div className="text-center mt-20">
          <p className="text-gray-500 mb-4">No notes yet</p>
          <Link
            href="/notes/new"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create your first note
          </Link>
        </div>
      )}

      {/* Notes List (Row by Row) */}
      {!loading && !error && notes.length > 0 && (
        <>
          <h1 className="text-xl sm:text-2xl font-semibold mb-6 text-center sm:text-left">
            Your Notes
          </h1>

          <div className="flex flex-col gap-4">
            {notes.map((note) => (
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                aria-label={`View note titled ${note.title}`}
                className="block p-4 border rounded-xl hover:shadow transition bg-white"
              >
                <h3 className="font-medium text-lg">{note.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {note.content}
                </p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
