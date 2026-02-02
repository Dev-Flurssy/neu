"use client";

import * as React from "react";
import { AiPromptForm } from "./AiPromptForm";

interface Props {
  onInsert: (markdown: string) => void;
}

export function AiAssistDropdown({ onInsert }: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="bg-gray-100 border px-3 py-2 rounded-md font-medium hover:bg-gray-200"
      >
        {open ? "Hide AI Assistant" : "AI Assistant"}
      </button>

      {open && (
        <div className="border rounded-md p-4 bg-white shadow-sm">
          <AiPromptForm onInsert={onInsert} />
        </div>
      )}
    </div>
  );
}
