"use client";

import { useAiGenerate } from "@/app/hooks/useAiGenerate";

interface AiGenerateButtonProps {
  onInsert: (markdown: string) => void;
}

export function AiGenerateButton({ onInsert }: AiGenerateButtonProps) {
  const { generate, loading } = useAiGenerate();

  async function handleGenerate() {
    const topic = prompt("What should the note be about?");
    if (!topic) return;

    const markdown = await generate(topic);
    onInsert(markdown);
  }

  return (
    <button
      type="button"
      onClick={handleGenerate}
      disabled={loading}
      className="mb-3 bg-purple-600 text-white px-3 py-2 rounded disabled:opacity-50"
    >
      {loading ? "Generating..." : "Generate with AI"}
    </button>
  );
}
