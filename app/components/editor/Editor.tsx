"use client";

import SimpleMDE from "react-simplemde-editor";
import { useState } from "react";
import "easymde/dist/easymde.min.css";
import { useAiGenerate } from "@/app/hooks/useAiGenerate";

import { AiGenerateButton } from "@/app/components/AiGenerateButton";

export default function Editor() {
  const [content, setContent] = useState("");

  return (
    <div className="bg-gray-100 py-10">
      <div className="mx-auto max-w-[794px] min-h-[1123px] bg-white rounded-lg shadow p-6">
        <AiGenerateButton
          onInsert={(markdown) =>
            setContent((prev) => (prev ? `${prev}\n\n${markdown}` : markdown))
          }
        />

        <SimpleMDE
          value={content}
          onChange={setContent}
          options={{
            autofocus: true,
            spellChecker: false,
            status: false,
            placeholder: "Start writing...",
          }}
        />
      </div>
    </div>
  );
}
