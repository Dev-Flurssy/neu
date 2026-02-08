"use client";

import { NoteCardSkeletonGrid } from "@/app/components/skeleton/NoteCardSkeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse mb-2" />
          <div className="h-5 w-64 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Quick Actions Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 bg-white rounded-xl border border-gray-200 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                <div className="flex-1">
                  <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Notes Grid Skeleton */}
        <NoteCardSkeletonGrid count={6} />
      </div>
    </div>
  );
}
