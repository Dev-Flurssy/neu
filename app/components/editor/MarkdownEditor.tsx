"use client";

import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({
  value,
  onChange,
}: MarkdownEditorProps) {
  return (
    <div
      className="mx-auto my-8 p-6 bg-white border rounded-lg shadow-sm
                 focus-within:border-indigo-500 focus-within:shadow-md
                 max-w-[800px] min-h-[80vh]"
    >
      <SimpleMDE
        value={value}
        onChange={onChange}
        options={{
          autofocus: true,
          spellChecker: false,
          status: false,
          placeholder: "Start writing...",
        }}
      />
    </div>
  );
}
