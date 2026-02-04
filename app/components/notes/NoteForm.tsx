"use client";

import * as React from "react";
import { marked } from "marked";
import { AiAssistDropdown } from "../ai/AiAssistDropdown";
import RichTextEditor from "../editor/RichTextEditor";

interface NoteFormProps {
  initialTitle?: string;
  initialContent?: string;
  onSubmit: (data: { title: string; content: string }) => void;
  isSubmitting?: boolean;
  error?: string;
  onContentChange?: (html: string) => void;
}

export function NoteForm({
  initialTitle = "",
  initialContent = "",
  onSubmit,
  isSubmitting,
  error,
  onContentChange,
}: NoteFormProps) {
  const [title, setTitle] = React.useState(initialTitle);
  const [content, setContent] = React.useState(initialContent);
  const [localError, setLocalError] = React.useState("");

  const editorRef = React.useRef<any>(null);

  function handleInsertFromAI(markdown: string) {
    const html = marked.parse(markdown);

    if (editorRef.current?.insertHTML) {
      editorRef.current.insertHTML(html);
      return;
    }

    setContent((prev) => {
      const updated = prev + "<br/><br/>" + html;
      onContentChange?.(updated);
      return updated;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setLocalError(
        "Please fill in both the title and the content before saving.",
      );
      return;
    }

    setLocalError("");
    onSubmit({ title, content });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        space-y-6
        mx-auto
        w-full
        max-w-4xl
        px-4
        sm:px-6
        lg:px-8
      "
    >
      {/* AI Assist */}
      <AiAssistDropdown onInsert={handleInsertFromAI} />

      {/* Title */}
      <div className="space-y-2">
        <label
          htmlFor="note-title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>

        <input
          id="note-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a clear, descriptive title"
          className="
            w-full
            border
            rounded-md
            p-3
            text-lg
            sm:text-xl
            font-semibold
            focus:ring-2
            focus:ring-blue-500
          "
        />
      </div>

      {/* Content */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Content
        </label>

        <div
          className="
            border
            rounded-xl
            bg-white
            shadow-sm
            p-3
            sm:p-4
            min-h-[350px]
            sm:min-h-[500px]
            lg:min-h-[600px]
            w-full
            overflow-auto
          "
        >
          <RichTextEditor
            ref={editorRef}
            value={content}
            onChange={(html) => {
              setContent(html);
              onContentChange?.(html);
            }}
          />
        </div>
      </div>

      {/* Errors */}
      {(localError || error) && (
        <p className="text-sm text-red-500">{localError || error}</p>
      )}

      {/* Submit */}
      <div className="flex items-center justify-end">
        <button
          disabled={isSubmitting}
          className="
            bg-blue-600
            text-white
            px-5
            py-3
            sm:px-6
            sm:py-3
            rounded-md
            font-semibold
            text-sm
            sm:text-base
            hover:bg-blue-700
            disabled:opacity-50
          "
        >
          {isSubmitting ? "Saving…" : "Save Note"}
        </button>
      </div>
    </form>
  );
}
