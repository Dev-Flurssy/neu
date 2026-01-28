"use client";

import * as React from "react";
import { marked } from "marked";

import { AiPromptForm } from "./AiPromptForm";
import RichTextEditor from "./RichTextEditor";
import { ExportDropdown } from "./ExportDropdown";

interface NoteFormProps {
  initialTitle?: string;
  initialContent?: string;
  onSubmit: (data: { title: string; content: string }) => void;
  isSubmitting?: boolean;
  error?: string;
}

export function NoteForm({
  initialTitle = "",
  initialContent = "",
  onSubmit,
  isSubmitting,
  error,
}: NoteFormProps) {
  const [title, setTitle] = React.useState(initialTitle);
  const [content, setContent] = React.useState(initialContent); // HTML

  function handleInsertFromAI(markdown: string) {
    const html = marked.parse(markdown);
    setContent(html);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ title, content });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 mx-auto w-full max-w-3xl px-4"
    >
      {/* AI Generator */}
      <AiPromptForm onInsert={handleInsertFromAI} />

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
          className="w-full border rounded-md p-3 text-lg font-medium focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Editor */}
      <div id="note-preview" className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Content
        </label>

        <RichTextEditor value={content} onChange={setContent} />
      </div>

      {/* Error */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <ExportDropdown title={title} content={content} />

        <button
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : "Save Note"}
        </button>
      </div>
    </form>
  );
}
