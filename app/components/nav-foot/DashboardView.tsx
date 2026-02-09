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

        {/* Welcome / Empty State */}
        {!loading && !error && notes.length === 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl border-2 border-blue-100 shadow-xl overflow-hidden">
              <div className="p-8 sm:p-12 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Welcome to Your Note Space! 🎉
                </h2>
                
                <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
                  You're all set to start your learning journey. Create your first note and experience the power of AI-assisted note-taking.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto">
                  <div className="bg-white/80 backdrop-blur rounded-xl p-6 border border-blue-200">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">AI-Powered</h3>
                    <p className="text-sm text-gray-600">Generate notes instantly with AI assistance</p>
                  </div>

                  <div className="bg-white/80 backdrop-blur rounded-xl p-6 border border-purple-200">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Rich Editor</h3>
                    <p className="text-sm text-gray-600">Format text, add tables, lists, and more</p>
                  </div>

                  <div className="bg-white/80 backdrop-blur rounded-xl p-6 border border-pink-200">
                    <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Export Anywhere</h3>
                    <p className="text-sm text-gray-600">Download as PDF, DOCX, or PPTX</p>
                  </div>
                </div>

                <Link
                  href="/notes/new"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all font-semibold text-lg group"
                >
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Your First Note
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>

                <p className="text-sm text-gray-500 mt-6">
                  Tip: Use the AI generator to create structured notes in seconds
                </p>
              </div>
            </div>
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
