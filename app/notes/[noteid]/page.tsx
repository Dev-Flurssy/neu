"use client";

import { useRouter } from "next/navigation";
import { useNote } from "@/app/hooks/useNote";
import { NoteViewSkeleton } from "@/app/components/skeleton/NoteViewSkeleton";
import { ExportDropdown } from "@/app/components/editor/ExportDropdown";

export default function NotePreview({
  params,
}: {
  params: { noteid: string };
}) {
  const router = useRouter();
  const { note, loading, error, deleteNote } = useNote(params.noteid);

  async function handleDelete() {
    if (!confirm("Delete this note?")) return;
    await deleteNote();
    router.push("/dashboard");
    router.refresh();
  }

  if (loading) return <NoteViewSkeleton />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!note) return <p>Note not found</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Google Docs-like Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-full transition"
                title="Back to Dashboard"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div>
                <h1 className="text-lg font-medium text-gray-900">{note.title}</h1>
                <p className="text-xs text-gray-500">Preview Mode</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push(`/notes/${note.id}/edit`)}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition"
              >
                Edit
              </button>
              
              <ExportDropdown title={note.title} content={note.content} />

              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Document Preview - Matches PDF Export Exactly */}
      <div className="pdf-preview-wrapper">
        <div className="pdf-preview-page">
          <div 
            className="pdf-preview-content"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
        </div>
      </div>
    </div>
  );
}
