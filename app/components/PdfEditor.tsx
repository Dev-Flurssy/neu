"use client";

import * as React from "react";

export function PdfEditor({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center bg-gray-200 py-6 px-2 sm:px-4">
      <div className="w-full max-w-[210mm]">
        <div className="pdf-page w-full bg-white shadow-md rounded-md p-4 sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
