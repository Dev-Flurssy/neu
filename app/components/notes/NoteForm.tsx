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
  submitButtonText?: string;
  showCancelButton?: boolean;
  onCancel?: () => void;
}

export function NoteForm({
  initialTitle = "",
  initialContent = "",
  onSubmit,
  isSubmitting,
  error,
  onContentChange,
  submitButtonText = "Save Note",
  showCancelButton = false,
  onCancel,
}: NoteFormProps) {
  const [title, setTitle] = React.useState(initialTitle);
  const [content, setContent] = React.useState(initialContent);
  const [localError, setLocalError] = React.useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [charCount, setCharCount] = React.useState(0);

  const editorRef = React.useRef<any>(null);

  // Track unsaved changes
  React.useEffect(() => {
    const hasChanges = title !== initialTitle || content !== initialContent;
    setHasUnsavedChanges(hasChanges);
  }, [title, content, initialTitle, initialContent]);

  // Update character count
  React.useEffect(() => {
    const textContent = content.replace(/<[^>]*>/g, '').trim();
    setCharCount(textContent.length);
  }, [content]);

  // Warn before leaving with unsaved changes
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !isSubmitting) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, isSubmitting]);

  function handleInsertFromAI(markdown: string) {
    // Remove markdown heading underlines (=== and ---)
    const cleanedMarkdown = markdown.replace(/^[=\-]{3,}$/gm, '');
    
    let html = marked.parse(cleanedMarkdown) as string;
    
    // Add page breaks before H1 headings (except the first one)
    // Use a class instead of inline style for better persistence
    const h1Regex = /<h1>/g;
    let h1Count = 0;
    html = html.replace(h1Regex, (match) => {
      h1Count++;
      if (h1Count > 1) {
        return '<h1 class="page-break" style="break-before: page;">';
      }
      return match;
    });

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

    // Validation
    if (!title.trim()) {
      setLocalError("Please enter a title for your note.");
      return;
    }

    if (title.trim().length < 3) {
      setLocalError("Title must be at least 3 characters long.");
      return;
    }

    if (!content.trim() || content === '<p></p>') {
      setLocalError("Please add some content to your note.");
      return;
    }

    if (charCount < 10) {
      setLocalError("Content must be at least 10 characters long.");
      return;
    }

    setLocalError("");
    onSubmit({ title: title.trim(), content });
  }

  function handleCancel() {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?"
      );
      if (!confirmed) return;
    }
    onCancel?.();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8"
    >
      {/* AI Assist */}
      <AiAssistDropdown onInsert={handleInsertFromAI} />

      {/* Title */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="note-title"
            className="block text-sm font-medium text-gray-700"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <span className="text-xs text-gray-500">
            {title.length}/100
          </span>
        </div>

        <input
          id="note-title"
          value={title}
          onChange={(e) => {
            // Remove === separators and trim
            const cleanTitle = e.target.value.replace(/={2,}/g, '').trim();
            setTitle(cleanTitle.slice(0, 100));
          }}
          placeholder="Enter a clear, descriptive title"
          maxLength={100}
          className="
            w-full border rounded-md p-3 text-lg sm:text-xl font-semibold
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors
          "
          disabled={isSubmitting}
        />
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Content <span className="text-red-500">*</span>
          </label>
          <span className="text-xs text-gray-500">
            {charCount} characters
          </span>
        </div>

        <div className="border rounded-xl bg-white shadow-sm p-3 sm:p-4 min-h-[350px] sm:min-h-[500px] lg:min-h-[600px] w-full overflow-auto">
          <RichTextEditor
            ref={editorRef}
            value={content}
            onChange={(html) => {
              setContent(html);
              onContentChange?.(html);
            }}
            editable={!isSubmitting}
          />
        </div>
      </div>

      {/* Errors */}
      {(localError || error) && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {localError || error}
          </p>
        </div>
      )}

      {/* Unsaved changes indicator */}
      {hasUnsavedChanges && !isSubmitting && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <p className="text-sm text-yellow-700 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            You have unsaved changes
          </p>
        </div>
      )}

      {/* Submit Buttons */}
      <div className="flex items-center justify-end gap-3">
        {showCancelButton && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="
              px-5 py-3 sm:px-6 sm:py-3 rounded-md font-semibold text-sm sm:text-base
              text-gray-700 bg-gray-100 hover:bg-gray-200
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
            "
          >
            Cancel
          </button>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting || !hasUnsavedChanges}
          className="
            bg-blue-600 text-white px-5 py-3 sm:px-6 sm:py-3 rounded-md
            font-semibold text-sm sm:text-base
            hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors flex items-center gap-2
          "
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving…
            </>
          ) : (
            submitButtonText
          )}
        </button>
      </div>
    </form>
  );
}
