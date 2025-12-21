"use client";

import { useRef } from "react";
import SimpleMDE from "react-simplemde-editor";
import type EasyMDE from "easymde";
import { EditorToolbar } from "./EditorToolbar";
import { editorActions } from "@/app/hooks/editorActions";
import "easymde/dist/easymde.min.css";

export default function Editor() {
  const mdeRef = useRef<EasyMDE | null>(null);
  const contentRef = useRef(""); // ✅ avoids re-render

  const handleAction = (action: string) => {
    const mde = mdeRef.current;
    if (!mde) return;

    mde.codemirror.focus();

    const toolbarAction = (mde as any).toolbarElements?.[action];
    if (toolbarAction?.action) {
      toolbarAction.action(mde);
    } else {
      mde.codemirror.replaceSelection(getFallbackSyntax(action));
    }
  };

  return (
    <div className="bg-gray-100 py-10">
      <div
        className="mx-auto bg-white rounded-lg shadow
                   max-w-[794px] min-h-[1123px] p-6
                   focus-within:ring-2 focus-within:ring-indigo-500"
      >
        <EditorToolbar actions={editorActions} onAction={handleAction} />

        <SimpleMDE
          getMdeInstance={(instance) => {
            if (!mdeRef.current) {
              mdeRef.current = instance;
            }
          }}
          onChange={(value) => {
            contentRef.current = value; // ✅ safe
          }}
          options={{
            toolbar: false,
            spellChecker: false,
            status: false,
            placeholder: "Start writing...",
          }}
        />
      </div>
    </div>
  );
}

function getFallbackSyntax(action: string) {
  switch (action) {
    case "table":
      return "\n| A | B |\n|---|---|\n|   |   |\n";
    case "horizontal-rule":
      return "\n---\n";
    default:
      return "";
  }
}
