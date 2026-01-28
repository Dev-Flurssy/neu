"use client";

import Link from "next/link";

export default function NotesNotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-6 text-center">
      <div className="text-6xl">📝</div>

      <h1 className="text-3xl font-bold">Note not found</h1>

      <p className="max-w-md text-gray-600">
        The note you’re looking for doesn’t exist, may have been deleted, or the
        link is incorrect.
      </p>

      <div className="flex gap-3">
        <Link
          href="/dashboard"
          className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300"
        >
          Back to Dashboard
        </Link>

        <Link
          href="/notes/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Create New Note
        </Link>
      </div>
    </div>
  );
}
