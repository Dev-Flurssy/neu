"use client";

export function NoteCardSkeleton() {
  return (
    <div className="border rounded-xl p-4 sm:p-6 bg-white shadow-sm animate-pulse">
      <div className="space-y-4">
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>

        {/* Content preview */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-100 rounded w-full"></div>
          <div className="h-4 bg-gray-100 rounded w-11/12"></div>
          <div className="h-4 bg-gray-100 rounded w-4/5"></div>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-2 pt-2">
          <div className="h-3 bg-gray-100 rounded w-24"></div>
          <div className="h-3 bg-gray-100 rounded w-20"></div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 sm:gap-3 pt-2 border-t">
          <div className="h-9 w-20 bg-gray-200 rounded-md"></div>
          <div className="h-9 w-20 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}

export function NoteCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(count)].map((_, i) => (
        <NoteCardSkeleton key={i} />
      ))}
    </div>
  );
}
