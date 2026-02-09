"use client";

export function SettingsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        {/* Header */}
        <div className="mb-8">
          <div className="h-10 w-64 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-56 bg-gray-100 rounded"></div>
        </div>

        {/* Account Information Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            <div>
              <div className="h-3 w-16 bg-gray-100 rounded mb-2"></div>
              <div className="h-5 w-64 bg-gray-200 rounded"></div>
            </div>
            <div>
              <div className="h-3 w-12 bg-gray-100 rounded mb-2"></div>
              <div className="h-5 w-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* Security Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            <div>
              <div className="h-3 w-20 bg-gray-100 rounded mb-2"></div>
              <div className="h-4 w-full bg-gray-100 rounded mb-3"></div>
              <div className="h-10 w-40 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* Danger Zone Card */}
        <div className="bg-white rounded-xl border-2 border-red-200 shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg"></div>
            <div className="flex-1 space-y-3">
              <div className="h-6 w-32 bg-gray-200 rounded"></div>
              <div className="h-4 w-full bg-gray-100 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
              <div className="h-10 w-36 bg-red-200 rounded mt-4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
