"use client";

import * as React from "react";
import { useAiGenerate } from "@/app/hooks/useAiGenerate";

interface AiPromptFormProps {
  onInsert: (markdown: string) => void;
}

export function AiPromptForm({ onInsert }: AiPromptFormProps) {
  const { generate, loading, error: aiError } = useAiGenerate();

  const [topic, setTopic] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [pages, setPages] = React.useState<number | "">("");
  const [tone, setTone] = React.useState("academic");

  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
  const [hasGenerated, setHasGenerated] = React.useState(false);

  function validate() {
    const newErrors: { [key: string]: string } = {};

    if (!topic.trim()) newErrors.topic = "Topic is required.";
    if (pages !== "" && (pages < 1 || pages > 20))
      newErrors.pages = "Pages must be between 1 and 20.";
    if (!tone) newErrors.tone = "Please select a tone.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleGenerate() {
    if (!validate()) return;

    const pageRequirement =
      pages === ""
        ? `Generate a natural-length set of lecture notes appropriate for a university-level class.`
        : `Generate enough content to realistically fill **${pages} full A4 page(s)**.`;

    const prompt = `
Generate highly structured academic lecture notes in clean Markdown.

### INPUT
Topic: ${String(topic)}
Description: ${String(description || "N/A")}
Tone: ${String(tone)}
Page Target: ${String(pages || "Not specified")}

### LENGTH REQUIREMENT
${pageRequirement}

### GLOBAL RULES (IMPORTANT)
- Use ONLY Markdown syntax.
- Use ONLY #, ##, ### for headings.
- Do NOT use heading underline syntax (=== or ---).
- Do NOT include HTML.
- Do NOT include commentary, explanations, or meta text.
- Do NOT include phrases like "Here is your content" or "As requested".
- Output MUST be valid Markdown only.

### STRUCTURE REQUIREMENTS
1. Start with a clear title using H1 (#).
2. Add a short "Overview" section using H2 (##).
3. Add 3–6 major sections using H2 (##).
4. Inside each major section:
   - Include subsections using H3 (###).
   - Use bullet points.
   - Include definitions, examples, and explanations.
   - Use bold for key terms.

### FORMATTING RULES
- Use bullet points (- or *).
- Use numbered lists where appropriate.
- Use bold for important concepts.
- Avoid long paragraphs; break content into readable chunks.
- No code blocks unless absolutely necessary.

### FINAL SECTION
- Add a "Summary" section using H2 (##).
- Include 5–10 key takeaways as bullet points.

Return ONLY the Markdown content with no commentary.
`;

    try {
      const markdown = await generate(prompt);
      if (!markdown) return; // <-- guarantees string
      onInsert(markdown);
      setHasGenerated(true);
    } catch {
      return;
    }
  }

  return (
    <div className="space-y-4 rounded-xl border bg-gray-50 p-3 sm:p-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        🤖 AI Note Generator
      </div>

      {/* Topic */}
      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Topic (e.g. Photosynthesis)"
        className="w-full rounded-md border p-2 text-sm"
      />
      {errors.topic && <p className="text-xs text-red-500">{errors.topic}</p>}

      {/* Description */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Short description or focus (optional)"
        className="w-full rounded-md border p-2 text-sm"
        rows={3}
      />

      {/* Page Count */}
      <label className="text-xs font-medium text-gray-600">
        Number of Pages (optional)
      </label>
      <input
        type="number"
        min={1}
        max={20}
        value={pages}
        onChange={(e) =>
          setPages(e.target.value === "" ? "" : Number(e.target.value))
        }
        placeholder="Leave empty for natural length"
        className="w-full rounded-md border p-2 text-sm"
      />
      {errors.pages && <p className="text-xs text-red-500">{errors.pages}</p>}

      {/* Tone */}
      <label className="text-xs font-medium text-gray-600">Tone</label>
      <select
        value={tone}
        onChange={(e) => setTone(e.target.value)}
        aria-label="Select tone for the generated notes"
        className="w-full rounded-md border p-2 text-sm"
      >
        <option value="academic">Academic</option>
        <option value="simplified">Simplified</option>
        <option value="technical">Technical</option>
      </select>

      {/* Button */}
      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        className="w-full rounded-md bg-purple-600 p-2 text-white text-sm sm:text-base disabled:opacity-50"
      >
        {loading
          ? "Generating…"
          : hasGenerated
            ? "Generate Again"
            : "Generate Note"}
      </button>

      {aiError && <p className="text-xs text-red-500">{aiError}</p>}
    </div>
  );
}
