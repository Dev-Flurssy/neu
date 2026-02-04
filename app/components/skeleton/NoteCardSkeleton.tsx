"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function NoteCardSkeleton() {
  return (
    <div className="border rounded-xl p-4 sm:p-6 bg-white shadow-sm">
      <div className="space-y-4">
        {/* Title */}
        <Skeleton height={20} width="70%" />

        {/* Content preview */}
        <Skeleton height={14} count={3} />

        {/* Buttons */}
        <div className="flex justify-end gap-2 sm:gap-3 pt-2">
          <Skeleton height={36} width={80} className="sm:h-40 sm:w-100" />
          <Skeleton height={36} width={80} className="sm:h-40 sm:w-100" />
        </div>
      </div>
    </div>
  );
}
