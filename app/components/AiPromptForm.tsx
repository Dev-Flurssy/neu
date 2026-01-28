"use client";

import * as React from "react";
import { useAiGenerate } from "@/app/hooks/useAiGenerate";

interface AiPromptFormProps {
  onInsert: (markdown: string) => void;
}

export function AiPromptForm({ onInsert }: AiPromptFormProps) {
  const { generate, loading, error } = useAiGenerate();

  const [topic, setTopic] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [level, setLevel] = React.useState("beginner");

  async function handleGenerate() {
    if (!topic.trim()) {
      alert("Please enter a topic");
      return;
    }

    try {
      const prompt = `
Generate highly structured academic lecture notes in clean Markdown.

### INPUT
Topic: ${topic}
Description: ${description || "N/A"}
Difficulty: ${level}

### OUTPUT REQUIREMENTS
You must follow these rules strictly:

1. **Structure**
   - Start with a clear title (H1)
   - Add a short overview section (H2)
   - Add 3–6 major sections (H2)
   - Each major section must contain:
     - Subsections (H3)
     - Bullet points
     - Definitions, examples, and explanations

2. **Formatting**
   - Use only Markdown (no HTML)
   - Use H1 → H3 headings only
   - Use bullet points, numbered lists, and bold keywords
   - No code blocks unless absolutely necessary

3. **Tone**
   - Academic, clear, and concise
   - Avoid fluff
   - Explain concepts progressively based on difficulty level

4. **Difficulty Adaptation**
   - Beginner → simple explanations, analogies, basic definitions
   - Intermediate → deeper concepts, relationships, diagrams described in text
   - Advanced → technical depth, formulas (in Markdown), assumptions, edge cases

5. **Final Section**
   - Add a “Summary” section (H2)
   - Add 5–10 key takeaways as bullet points

Return ONLY the Markdown content with no commentary.
`;
      const markdown = await generate(prompt);
      onInsert(markdown);
    } catch {
      // error already handled by hook
    }
  }

  return (
    <div className="space-y-4 rounded-xl border bg-gray-50 p-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        🤖 AI Note Generator
      </div>

      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Topic (e.g. Photosynthesis)"
        className="w-full rounded-md border p-2 text-sm"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Short description or focus (optional)"
        className="w-full rounded-md border p-2 text-sm"
        rows={3}
      />

      <label htmlFor="ai-level" className="text-xs font-medium text-gray-600">
        Difficulty Level
      </label>

      <select
        id="ai-level"
        value={level}
        onChange={(e) => setLevel(e.target.value)}
        className="w-full rounded-md border p-2 text-sm"
      >
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading || !topic.trim()}
        className="w-full rounded-md bg-purple-600 p-2 text-white disabled:opacity-50"
      >
        {loading ? "Generating…" : "Generate Note"}
      </button>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
