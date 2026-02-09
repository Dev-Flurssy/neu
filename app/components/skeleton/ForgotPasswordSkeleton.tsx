"use client";

export function ForgotPasswordSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full animate-pulse">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full"></div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-2"></div>
            <div className="h-4 w-64 bg-gray-100 rounded mx-auto"></div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-12 w-full bg-gray-100 rounded-lg"></div>
            </div>

            {/* Button */}
            <div className="h-12 w-full bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg"></div>
          </div>

          {/* Link */}
          <div className="mt-6 text-center">
            <div className="h-4 w-32 bg-gray-100 rounded mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
