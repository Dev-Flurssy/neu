"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function NoteCardSkeleton() {
  return (
    <div className="block p-4 border rounded-xl bg-white shadow-sm">
      <div className="space-y-3">
        <Skeleton height={18} width="70%" />

        <Skeleton height={14} count={2} />

        <Skeleton height={12} width="40%" />
      </div>
    </div>
  );
}
