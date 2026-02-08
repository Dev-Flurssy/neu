"use client";

export function NoteViewSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-5 w-48 bg-gray-200 rounded"></div>
                <div className="h-3 w-32 bg-gray-100 rounded"></div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-9 w-16 bg-gray-200 rounded-md"></div>
              <div className="h-9 w-20 bg-gray-200 rounded-md"></div>
              <div className="h-9 w-20 bg-gray-200 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="pdf-preview-wrapper">
        <div className="pdf-preview-page animate-pulse">
          <div className="space-y-6">
            {/* Title */}
            <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
            
            {/* Divider */}
            <div className="h-px w-full bg-gray-200"></div>
            
            {/* Heading */}
            <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
            
            {/* Content lines */}
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-100 rounded"></div>
              <div className="h-4 w-full bg-gray-100 rounded"></div>
              <div className="h-4 w-11/12 bg-gray-100 rounded"></div>
              <div className="h-4 w-10/12 bg-gray-100 rounded"></div>
            </div>

            {/* Another section */}
            <div className="h-6 w-2/3 bg-gray-200 rounded mt-8"></div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-100 rounded"></div>
              <div className="h-4 w-full bg-gray-100 rounded"></div>
              <div className="h-4 w-9/12 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
