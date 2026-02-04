"use client";

import Link from "next/link";
import { NoteCardSkeleton } from "../skeleton/NoteCardSkeleton";

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
    <div className="min-h-[70vh] w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
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
        <div className="text-center mt-20 px-4">
          <p className="text-gray-500 mb-4 text-base sm:text-lg">
            No notes yet
          </p>
          <Link
            href="/notes/new"
            className="inline-block bg-blue-600 text-white px-5 py-3 rounded-lg text-sm sm:text-base hover:bg-blue-700 transition"
          >
            Create your first note
          </Link>
        </div>
      )}

      {/* Notes List */}
      {!loading && !error && notes.length > 0 && (
        <>
          <h1 className="text-xl sm:text-2xl font-semibold mb-6 text-center sm:text-left">
            Your Notes
          </h1>

          <div className="flex flex-col gap-5 sm:gap-6">
            {notes.map((note) => (
              <div
                key={note.id}
                className="group border rounded-xl p-5 sm:p-6 bg-white shadow-sm hover:shadow-lg transition duration-200"
              >
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  {note.title}
                </h3>

                <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-3">
                  {note.content.replace(/<[^>]+>/g, "").slice(0, 300)}
                </p>

                <div className="flex justify-end gap-2 sm:gap-3 pt-2">
                  <Link
                    href={`/notes/${note.id}`}
                    className="px-4 py-2 sm:px-6 sm:py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    View
                  </Link>

                  <Link
                    href={`/notes/${note.id}/edit`}
                    className="px-4 py-2 sm:px-6 sm:py-2 text-sm rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
