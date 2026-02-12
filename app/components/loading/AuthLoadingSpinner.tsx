"use client";

interface AuthLoadingSpinnerProps {
  message?: string;
}

export default function AuthLoadingSpinner({ message = "Loading..." }: AuthLoadingSpinnerProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-6 animate-pulse">
          <span className="text-white font-bold text-3xl">N</span>
        </div>

        {/* Spinner */}
        <div className="flex justify-center mb-4">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
        </div>

        {/* Message */}
        <p className="text-lg font-medium text-gray-700 mb-2">{message}</p>
        <p className="text-sm text-gray-500">Please wait...</p>
      </div>
    </div>
  );
}
