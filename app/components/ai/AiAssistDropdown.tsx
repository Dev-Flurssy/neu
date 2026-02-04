"use client";

import { useState } from "react";
import { AiPromptForm } from "./AiPromptForm";

interface AiAssistDropdownProps {
  onInsert: (markdown: string) => void;
}

export function AiAssistDropdown({ onInsert }: AiAssistDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="px-4 py-2 rounded-md bg-purple-600 text-white font-medium text-sm sm:text-base"
      >
        {open ? "Hide AI Assist" : "AI Assist"}
      </button>

      {open && (
        <div className="w-full rounded-xl border bg-white shadow-md p-3 sm:p-4">
          <AiPromptForm
            onInsert={(md) => {
              onInsert(md);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
