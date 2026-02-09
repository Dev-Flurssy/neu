"use client";

import { EditorContent } from "@tiptap/react";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { useTiptapEditor } from "../../hooks/useTiptapEditor";

interface Props {
  value: string;
  onChange: (html: string) => void;
  editable?: boolean;
}

const RichTextEditor = forwardRef(function RichTextEditor(
  { value, onChange, editable = true }: Props,
  ref,
) {
  const editor = useTiptapEditor(value, onChange);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    insertHTML: (html: string) => {
      if (!editor) return;
      editor.chain().focus().insertContent(html).run();
    },
  }));

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const reader = new FileReader();
    reader.onload = () => {
      editor
        .chain()
        .focus()
        .setImage({ src: reader.result as string })
        .run();
    };
    reader.readAsDataURL(file);
  }

  if (!editor) return null;

  return (
    <div className="space-y-2 w-full">
      <div className="border rounded-lg bg-white shadow-sm w-full h-[350px] sm:h-[500px] lg:h-[600px] overflow-y-auto relative">
        {/* Toolbar */}
        <div className="border-b bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
          {/* Main Toolbar - Desktop */}
          <div className="hidden sm:flex flex-wrap gap-1 p-2">
            {/* Text Formatting Group */}
            <div className="flex gap-1 p-1 bg-white rounded-lg border border-gray-200">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`
                  px-3 py-1.5 rounded text-sm font-bold transition-all
                  ${
                    editor.isActive("bold")
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
                title="Bold (Ctrl+B)"
              >
                B
              </button>

              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`
                  px-3 py-1.5 rounded text-sm italic font-medium transition-all
                  ${
                    editor.isActive("italic")
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
                title="Italic (Ctrl+I)"
              >
                I
              </button>

              <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`
                  px-3 py-1.5 rounded text-sm font-medium underline transition-all
                  ${
                    editor.isActive("underline")
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
                title="Underline (Ctrl+U)"
              >
                U
              </button>
            </div>

            {/* Headings Group */}
            <div className="flex gap-1 p-1 bg-white rounded-lg border border-gray-200">
              {([1, 2, 3] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level }).run()
                  }
                  className={`
                    px-3 py-1.5 rounded text-sm font-semibold transition-all
                    ${
                      editor.isActive("heading", { level })
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                  title={`Heading ${level}`}
                >
                  H{level}
                </button>
              ))}
            </div>

            {/* Lists Group */}
            <div className="flex gap-1 p-1 bg-white rounded-lg border border-gray-200">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`
                  px-3 py-1.5 rounded text-lg font-bold transition-all
                  ${
                    editor.isActive("bulletList")
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
                title="Bullet List"
              >
                •
              </button>

              <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`
                  px-3 py-1.5 rounded text-sm font-semibold transition-all
                  ${
                    editor.isActive("orderedList")
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
                title="Numbered List"
              >
                1.
              </button>
            </div>

            {/* Colors Group */}
            <div className="flex gap-1 p-1 bg-white rounded-lg border border-gray-200">
              <div className="relative group">
                <input
                  type="color"
                  onChange={(e) =>
                    editor.chain().focus().setColor(e.target.value).run()
                  }
                  className="w-9 h-9 p-1 rounded cursor-pointer hover:opacity-80 transition-opacity"
                  title="Text Color"
                />
              </div>

              <div className="relative group">
                <input
                  type="color"
                  onChange={(e) =>
                    editor
                      .chain()
                      .focus()
                      .toggleHighlight({ color: e.target.value })
                      .run()
                  }
                  className="w-9 h-9 p-1 rounded cursor-pointer hover:opacity-80 transition-opacity"
                  title="Highlight"
                />
              </div>
            </div>

            {/* Table Group */}
            <div className="flex gap-1 p-1 bg-white rounded-lg border border-gray-200">
              <button
                type="button"
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .insertTable({ rows: 2, cols: 2, withHeaderRow: true })
                    .run()
                }
                className="px-2.5 py-1.5 rounded text-gray-700 hover:bg-gray-100 transition-all"
                title="Insert Table"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>

              <div className="w-px bg-gray-200" />

              <button
                type="button"
                onClick={() => editor.chain().focus().addColumnBefore().run()}
                disabled={!editor.can().addColumnBefore()}
                className="px-2.5 py-1.5 rounded text-xs font-medium text-gray-700 hover:bg-gray-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed min-w-[44px] flex items-center justify-center"
                title="Add Column Before"
              >
                ← C
              </button>

              <button
                type="button"
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                disabled={!editor.can().addColumnAfter()}
                className="px-2.5 py-1.5 rounded text-xs font-medium text-gray-700 hover:bg-gray-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed min-w-[44px] flex items-center justify-center"
                title="Add Column After"
              >
                C →
              </button>

              <button
                type="button"
                onClick={() => editor.chain().focus().deleteColumn().run()}
                disabled={!editor.can().deleteColumn()}
                className="px-2.5 py-1.5 rounded text-xs font-medium text-red-600 hover:bg-red-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed min-w-[44px] flex items-center justify-center"
                title="Delete Column"
              >
                - C
              </button>

              <div className="w-px bg-gray-200" />

              <button
                type="button"
                onClick={() => editor.chain().focus().addRowBefore().run()}
                disabled={!editor.can().addRowBefore()}
                className="px-2.5 py-1.5 rounded text-xs font-medium text-gray-700 hover:bg-gray-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed min-w-[44px] flex items-center justify-center"
                title="Add Row Before"
              >
                ↑ R
              </button>

              <button
                type="button"
                onClick={() => editor.chain().focus().addRowAfter().run()}
                disabled={!editor.can().addRowAfter()}
                className="px-2.5 py-1.5 rounded text-xs font-medium text-gray-700 hover:bg-gray-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed min-w-[44px] flex items-center justify-center"
                title="Add Row After"
              >
                R ↓
              </button>

              <button
                type="button"
                onClick={() => editor.chain().focus().deleteRow().run()}
                disabled={!editor.can().deleteRow()}
                className="px-2.5 py-1.5 rounded text-xs font-medium text-red-600 hover:bg-red-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed min-w-[44px] flex items-center justify-center"
                title="Delete Row"
              >
                - R
              </button>

              <div className="w-px bg-gray-200" />

              <button
                type="button"
                onClick={() => editor.chain().focus().deleteTable().run()}
                disabled={!editor.can().deleteTable()}
                className="px-2.5 py-1.5 rounded text-red-600 hover:bg-red-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                title="Delete Table"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {/* Image Group */}
            <div className="flex gap-1 p-1 bg-white rounded-lg border border-gray-200">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2 py-1.5 rounded text-gray-700 hover:bg-gray-100 transition-all"
                title="Insert Image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              aria-label="file-upload"
            />
          </div>

          {/* Mobile Toolbar - Compact */}
          <div className="sm:hidden overflow-x-auto">
            <div className="flex gap-1 p-2 min-w-max">
              {/* Text Formatting */}
              <div className="flex gap-0.5 p-0.5 bg-white rounded border border-gray-200">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`px-2.5 py-1.5 rounded text-xs font-bold ${
                    editor.isActive("bold") ? "bg-blue-600 text-white" : "text-gray-700"
                  }`}
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`px-2.5 py-1.5 rounded text-xs italic ${
                    editor.isActive("italic") ? "bg-blue-600 text-white" : "text-gray-700"
                  }`}
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className={`px-2.5 py-1.5 rounded text-xs underline ${
                    editor.isActive("underline") ? "bg-blue-600 text-white" : "text-gray-700"
                  }`}
                >
                  U
                </button>
              </div>

              {/* Headings */}
              <div className="flex gap-0.5 p-0.5 bg-white rounded border border-gray-200">
                {([1, 2, 3] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
                    className={`px-2 py-1.5 rounded text-xs font-semibold ${
                      editor.isActive("heading", { level }) ? "bg-blue-600 text-white" : "text-gray-700"
                    }`}
                  >
                    H{level}
                  </button>
                ))}
              </div>

              {/* Lists */}
              <div className="flex gap-0.5 p-0.5 bg-white rounded border border-gray-200">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={`px-2.5 py-1.5 rounded text-base font-bold ${
                    editor.isActive("bulletList") ? "bg-blue-600 text-white" : "text-gray-700"
                  }`}
                >
                  •
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={`px-2.5 py-1.5 rounded text-xs font-semibold ${
                    editor.isActive("orderedList") ? "bg-blue-600 text-white" : "text-gray-700"
                  }`}
                >
                  1.
                </button>
              </div>

              {/* Colors */}
              <div className="flex gap-0.5 p-0.5 bg-white rounded border border-gray-200">
                <input
                  type="color"
                  onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                  className="w-8 h-8 p-0.5 rounded cursor-pointer"
                />
                <input
                  type="color"
                  onChange={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
                  className="w-8 h-8 p-0.5 rounded cursor-pointer"
                />
              </div>

              {/* Table */}
              <div className="flex gap-0.5 p-0.5 bg-white rounded border border-gray-200">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().insertTable({ rows: 2, cols: 2, withHeaderRow: true }).run()}
                  className="px-2 py-1.5 rounded text-gray-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>

              {/* Image */}
              <div className="flex gap-0.5 p-0.5 bg-white rounded border border-gray-200">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2 py-1.5 rounded text-gray-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="p-3 sm:p-4">
          <EditorContent editor={editor} />
          
          {/* Helper text */}
          <div className="mt-4 text-xs text-gray-500 space-y-1">
            <p>💡 <strong>Tips:</strong></p>
            <p>• Press Enter on empty list item to exit list</p>
            <p>• Click on image or table cell to select, then use toolbar buttons</p>
            <p>• Select image and press Delete/Backspace to remove it</p>
          </div>
        </div>
      </div>

      {/* Custom Editor Styles */}
      <style jsx global>{`
        .ProseMirror {
          outline: none;
          min-height: 300px;
        }

        .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 1rem 0;
          overflow: hidden;
        }

        .ProseMirror td,
        .ProseMirror th {
          min-width: 1em;
          border: 2px solid #d1d5db;
          padding: 8px 12px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
          text-align: left;
        }

        .ProseMirror th {
          font-weight: 600;
          text-align: left;
          background-color: #f3f4f6;
        }

        .ProseMirror .selectedCell:after {
          z-index: 2;
          position: absolute;
          content: "";
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background: rgba(59, 130, 246, 0.1);
          pointer-events: none;
        }

        .ProseMirror .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: -2px;
          width: 4px;
          background-color: #3b82f6;
          pointer-events: none;
        }

        .ProseMirror img {
          max-width: 100%;
          height: auto;
          cursor: pointer;
        }

        .ProseMirror img.ProseMirror-selectednode {
          outline: 3px solid #3b82f6;
          outline-offset: 2px;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
});

export default RichTextEditor;
