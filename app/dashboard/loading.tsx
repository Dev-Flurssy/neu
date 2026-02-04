"use client";

import { NoteCardSkeleton } from "@/app/components/skeleton/NoteCardSkeleton";

export default function DashboardSkeleton({ count }: { count: number }) {
  return (
    <div className="min-h-[70vh] w-full max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <NoteCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
