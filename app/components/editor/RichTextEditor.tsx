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
      <div
        className="
          border rounded-lg bg-white shadow-sm 
          w-full 
          h-[350px] sm:h-[500px] lg:h-[600px] 
          overflow-y-auto relative
        "
      >
        {/* Toolbar */}
        <div
          className="
            flex flex-nowrap sm:flex-wrap 
            gap-2 
            overflow-x-auto sm:overflow-visible 
            border-b 
            bg-white 
            sticky top-0 z-10 
            py-2 px-2
          "
        >
          {/* Bold */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-2 py-1 border rounded text-xs sm:text-sm ${
              editor.isActive("bold") ? "bg-gray-200" : ""
            }`}
          >
            Bold
          </button>

          {/* Italic */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-2 py-1 border rounded italic text-xs sm:text-sm ${
              editor.isActive("italic") ? "bg-gray-200" : ""
            }`}
          >
            Italic
          </button>

          {/* Underline */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`px-2 py-1 border rounded underline text-xs sm:text-sm ${
              editor.isActive("underline") ? "bg-gray-200" : ""
            }`}
          >
            Underline
          </button>

          {/* Headings */}
          {([1, 2, 3] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level }).run()
              }
              className={`px-2 py-1 border rounded text-xs sm:text-sm ${
                editor.isActive("heading", { level }) ? "bg-gray-200" : ""
              }`}
            >
              H{level}
            </button>
          ))}

          {/* Bullet List */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-2 py-1 border rounded text-xs sm:text-sm ${
              editor.isActive("bulletList") ? "bg-gray-200" : ""
            }`}
          >
            • List
          </button>

          {/* Ordered List */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-2 py-1 border rounded text-xs sm:text-sm ${
              editor.isActive("orderedList") ? "bg-gray-200" : ""
            }`}
          >
            1. List
          </button>

          {/* Text Color */}
          <input
            type="color"
            onChange={(e) =>
              editor.chain().focus().setColor(e.target.value).run()
            }
            className="w-8 h-8 sm:w-10 sm:h-10 p-1 border rounded cursor-pointer"
            title="Text Color"
          />

          {/* Highlight */}
          <input
            type="color"
            onChange={(e) =>
              editor
                .chain()
                .focus()
                .toggleHighlight({ color: e.target.value })
                .run()
            }
            className="w-8 h-8 sm:w-10 sm:h-10 p-1 border rounded cursor-pointer"
            title="Highlight Color"
          />

          {/* Table */}
          <button
            type="button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
            className="px-2 py-1 border rounded text-xs sm:text-sm"
          >
            Table
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            disabled={!editor.can().addColumnAfter()}
            className="px-2 py-1 border rounded text-xs sm:text-sm disabled:opacity-40"
          >
            + Col
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().addRowAfter().run()}
            disabled={!editor.can().addRowAfter()}
            className="px-2 py-1 border rounded text-xs sm:text-sm disabled:opacity-40"
          >
            + Row
          </button>

          {/* Image Upload */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-2 py-1 border rounded text-xs sm:text-sm"
          >
            Image
          </button>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            aria-label="file-upload"
          />
        </div>

        {/* Editor Content */}
        <div className="p-3 sm:p-4">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
});

export default RichTextEditor;
