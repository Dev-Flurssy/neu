"use client";

import { NoteCardSkeleton } from "@/app/components/NoteCardSkeleton";

export default function DashboardSkeleton() {
  return (
    <div className="min-h-[70vh] w-full max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <NoteCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
