"use client";

import React from "react";

interface DashboardErrorProps {
  error: Error | string;
}

export default function DashboardError({ error }: DashboardErrorProps) {
  return (
    <div className="max-w-2xl mx-auto mt-20 p-6 border rounded shadow text-center">
      <h1 className="text-2xl font-bold mb-2 text-red-600">Oops!</h1>
      <p className="text-gray-700">
        {typeof error === "string" ? error : error.message}
      </p>
    </div>
  );
}
