"use client";

export function NoteFormSkeleton() {
  return (
    <div className="space-y-6 mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 animate-pulse">
      {/* AI Toolbar Skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-10 w-40 bg-gray-200 rounded-md"></div>
      </div>

      {/* Title Skeleton */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
          <div className="h-3 w-12 bg-gray-100 rounded"></div>
        </div>
        <div className="h-12 w-full bg-gray-200 rounded-md"></div>
      </div>

      {/* Editor Skeleton */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
          <div className="h-3 w-24 bg-gray-100 rounded"></div>
        </div>

        <div className="border rounded-xl bg-gray-50 shadow-sm p-4 min-h-[350px] sm:min-h-[500px] lg:min-h-[600px] w-full space-y-4">
          {/* Toolbar skeleton */}
          <div className="flex gap-2 border-b pb-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-8 w-16 bg-gray-200 rounded"></div>
            ))}
          </div>
          
          {/* Content skeleton */}
          <div className="space-y-3 pt-2">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-11/12 bg-gray-200 rounded"></div>
            <div className="h-4 w-10/12 bg-gray-200 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-9/12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Submit Button Skeleton */}
      <div className="flex justify-end">
        <div className="h-12 w-32 bg-gray-300 rounded-md"></div>
      </div>
    </div>
  );
}
