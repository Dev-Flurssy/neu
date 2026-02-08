"use client";

import Link from "next/link";
import { NoteCardSkeletonGrid } from "../skeleton/NoteCardSkeleton";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Your Notes
          </h1>
          <p className="text-gray-600">
            Manage and organize your academic notes
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Link
            href="/notes/new"
            className="group p-6 bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50/50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Create New Note
                </h3>
                <p className="text-sm text-gray-500">Start writing or use AI</p>
              </div>
            </div>
          </Link>

          <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {notes.length} {notes.length === 1 ? 'Note' : 'Notes'}
                </h3>
                <p className="text-sm text-gray-500">Total saved</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Powered</h3>
                <p className="text-sm text-gray-500">Smart generation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && <NoteCardSkeletonGrid count={6} />}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load notes</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && notes.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No notes yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start creating your first note using our AI-powered generator or write from scratch
            </p>
            <Link
              href="/notes/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Note
            </Link>
          </div>
        )}

        {/* Notes Grid */}
        {!loading && !error && notes.length > 0 && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {note.title.replace(/={2,}/g, '').trim()}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {note.content
                      .replace(/<\/h[1-6]>/gi, '. ')
                      .replace(/<\/p>/gi, ' ')
                      .replace(/<\/li>/gi, ' ')
                      .replace(/<br\s*\/?>/gi, ' ')
                      .replace(/<[^>]+>/g, '')
                      .replace(/\s+/g, ' ')
                      .trim()
                      .slice(0, 150)}...
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Recently updated</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                  <Link
                    href={`/notes/${note.id}`}
                    className="flex-1 px-4 py-2 text-center text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    View
                  </Link>

                  <Link
                    href={`/notes/${note.id}/edit`}
                    className="flex-1 px-4 py-2 text-center text-sm font-medium bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
