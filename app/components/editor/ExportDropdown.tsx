"use client";

import * as React from "react";
import { exportNote, ExportFormat } from "@/lib/export";
import { useParams } from "next/navigation";

interface Props {
  title: string;
  content: string;
}

export function ExportDropdown({ title, content }: Props) {
  const [open, setOpen] = React.useState(false);
  const [exporting, setExporting] = React.useState<ExportFormat | null>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const params = useParams();
  const noteId = params?.noteid as string;

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  async function handleExport(format: ExportFormat) {
    setExporting(format);
    try {
      await exportNote(format, title, content, noteId);
    } catch (error) {
      console.error("Export failed:", error);
      alert(`Failed to export as ${format.toUpperCase()}. Please try again.`);
    } finally {
      setExporting(null);
      setOpen(false);
    }
  }

  const formatIcons = {
    pdf: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
      </svg>
    ),
    docx: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2h-1.528A6 6 0 004 9.528V4z" clipRule="evenodd" />
      </svg>
    ),
    pptx: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={exporting !== null}
        className="
          flex items-center gap-2
          rounded-md border border-gray-300
          px-4 py-2
          text-sm font-medium 
          bg-white hover:bg-gray-50
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors
          shadow-sm
        "
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {exporting ? `Exporting...` : "Export"}
      </button>

      {open && (
        <div
          className="
            absolute right-0 mt-2 
            w-48
            rounded-lg border border-gray-200 bg-white shadow-xl 
            z-20
            overflow-hidden
          "
        >
          <div className="py-1">
            {(["pdf", "docx", "pptx"] as ExportFormat[]).map((format) => (
              <button
                key={format}
                onClick={() => handleExport(format)}
                disabled={exporting !== null}
                className="
                  flex items-center gap-3
                  w-full 
                  px-4 py-2.5
                  text-left text-sm 
                  hover:bg-gray-50
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors
                "
              >
                <span className="text-gray-500">{formatIcons[format]}</span>
                <span className="flex-1">
                  {format === "pdf" && "PDF Document"}
                  {format === "docx" && "Word Document"}
                  {format === "pptx" && "PowerPoint"}
                </span>
                {exporting === format && (
                  <svg className="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
