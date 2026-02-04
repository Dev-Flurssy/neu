"use client";

export function NoteFormSkeleton() {
  return (
    <div
      className="
        space-y-8
        mx-auto
        w-full
        max-w-3xl
        px-4
        sm:px-6
        lg:px-8
        animate-pulse
      "
    >
      {/* AI Toolbar Skeleton */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md py-3 border-b">
        <div className="h-8 sm:h-10 w-32 sm:w-40 bg-gray-200 rounded-md"></div>
      </div>

      {/* Title Skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-10 sm:h-12 w-full bg-gray-200 rounded-md"></div>
      </div>

      {/* Editor Skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>

        <div
          className="
            border
            rounded-xl
            bg-gray-100
            shadow-sm
            p-3 sm:p-4
            min-h-[400px] sm:min-h-[600px]
            w-full
          "
        ></div>
      </div>

      {/* Submit Button Skeleton */}
      <div className="flex justify-end">
        <div className="h-10 sm:h-12 w-28 sm:w-32 bg-gray-300 rounded-md"></div>
      </div>
    </div>
  );
}
