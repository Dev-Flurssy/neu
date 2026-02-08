"use client";

import { useRouter } from "next/navigation";
import { NoteForm } from "@/app/components/notes/NoteForm";
import { NoteFormSkeleton } from "@/app/components/skeleton/NoteFormSkeleton";
import { useNoteSubmit } from "@/app/hooks/useNoteSubmit";

export default function NewNotePage() {
  const router = useRouter();
  const { submit, isSubmitting, error } = useNoteSubmit({
    redirectTo: "/dashboard",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-full transition flex-shrink-0"
              title="Back to Dashboard"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Create New Note</h1>
              <p className="text-sm text-gray-500 mt-0.5">Start writing or use AI to generate content</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="py-6">
        {isSubmitting ? (
          <NoteFormSkeleton />
        ) : (
          <NoteForm 
            onSubmit={submit} 
            isSubmitting={isSubmitting} 
            error={error}
            showCancelButton={true}
            onCancel={() => router.push("/dashboard")}
            submitButtonText="Create Note"
          />
        )}
      </div>
    </div>
  );
}
