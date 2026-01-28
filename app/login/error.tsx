"use client";

import React from "react";

export default function LoginError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="max-w-md mx-auto mt-20 text-center space-y-4">
      <h2 className="text-xl font-semibold text-red-600">
        Something went wrong
      </h2>

      <p className="text-gray-600 text-sm">
        {error.message || "Unable to load the login page."}
      </p>

      <button
        onClick={reset}
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        Try again
      </button>
    </div>
  );
}
