"use client";

import Skeleton from "react-loading-skeleton";

export function NoteFormSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
      {/* Title */}
      <div>
        <Skeleton height={16} width={80} />
        <Skeleton height={40} className="mt-2" />
      </div>

      {/* AI Generator */}
      <Skeleton height={120} />

      {/* Editor */}
      <div>
        <Skeleton height={16} width={80} />
        <Skeleton height={200} className="mt-2" />
      </div>

      {/* Button */}
      <Skeleton height={44} />
    </div>
  );
}
