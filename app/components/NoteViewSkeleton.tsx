"use client";

import Skeleton from "react-loading-skeleton";

export function NoteViewSkeleton() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      {/* Title */}
      <Skeleton height={32} width="70%" />

      {/* Content */}
      <div className="space-y-3">
        <Skeleton height={16} />
        <Skeleton height={16} />
        <Skeleton height={16} width="90%" />
        <Skeleton height={16} width="80%" />
        <Skeleton height={16} width="85%" />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <Skeleton height={40} width={100} />
        <Skeleton height={40} width={100} />
      </div>
    </div>
  );
}
