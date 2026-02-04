"use client";

import React from "react";

export default function SignupError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-sm sm:max-w-md bg-white p-6 sm:p-10 rounded-2xl shadow-xl space-y-6 border border-gray-100 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
          Something went wrong
        </h2>

        <p className="text-gray-600 text-sm sm:text-base">
          {error.message || "Unable to load this page."}
        </p>

        <button
          onClick={reset}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium text-sm sm:text-base"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
