"use client";

import Skeleton from "react-loading-skeleton";

export function NoteViewSkeleton() {
  return (
    <div className="mx-auto max-w-md sm:max-w-lg space-y-6 px-4">
      {/* Title */}
      <div className="h-7 sm:h-8 w-3/4">
        <Skeleton height="100%" />
      </div>

      {/* Content */}
      <div className="space-y-3">
        <Skeleton height={14} />
        <Skeleton height={14} />
        <Skeleton height={14} width="90%" />
        <Skeleton height={14} width="80%" />
        <Skeleton height={14} width="85%" />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <div className="h-9 sm:h-10 w-24 sm:w-28">
          <Skeleton height="100%" />
        </div>
        <div className="h-9 sm:h-10 w-24 sm:w-28">
          <Skeleton height="100%" />
        </div>
      </div>
    </div>
  );
}
