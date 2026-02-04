"use client";

import * as React from "react";
import { exportNote, ExportFormat } from "@/lib/export";

interface Props {
  title: string;
  content: string;
}

export function ExportDropdown({ title, content }: Props) {
  const [open, setOpen] = React.useState(false);

  function handleExport(format: ExportFormat) {
    exportNote(format, title, content);
    setOpen(false);
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="
          rounded-md border 
          px-3 py-2 
          sm:px-4 sm:py-2
          text-sm font-medium 
          bg-white hover:bg-gray-50
          w-full sm:w-auto
        "
      >
        Export
      </button>

      {open && (
        <div
          className="
            absolute right-0 mt-2 
            w-40 sm:w-44 
            rounded-md border bg-white shadow-lg 
            z-20
          "
        >
          {(["pdf", "docx", "pptx"] as ExportFormat[]).map((format) => (
            <button
              key={format}
              onClick={() => handleExport(format)}
              className="
                block w-full 
                px-4 py-2 
                text-left text-sm 
                hover:bg-gray-100
              "
            >
              Export as {format.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
