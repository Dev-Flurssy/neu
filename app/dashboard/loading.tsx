"use client";

import React from "react";

export default function DashboardSkeleton() {
  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-gray-200 h-24 rounded-lg"
        ></div>
      ))}
    </div>
  );
}
