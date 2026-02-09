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
        ? `Generate a complete set of lecture notes with natural length appropriate for a university-level class (typically 2-3 pages worth of content).`
        : `Generate a COMPLETE note with enough detailed content to fill approximately ${pages} full A4 page(s). This means substantial content with multiple sections, subsections, examples, and explanations.`;

    const prompt = `
Generate a COMPLETE, ready-to-use academic lecture note in clean Markdown format.

### INPUT
Topic: ${String(topic)}
Description: ${String(description || "N/A")}
Tone: ${String(tone)}
Page Target: ${String(pages || "Not specified")}

### LENGTH REQUIREMENT (CRITICAL)
${pageRequirement}

IMPORTANT: Generate the FULL note content now. Do not provide outlines or summaries. The user expects a complete, detailed note they can use immediately.

### OUTPUT FORMAT RULES
- Use ONLY Markdown syntax (no HTML)
- Use ONLY #, ##, ### for headings (no underline syntax === or ---)
- Do NOT include any commentary, meta-text, or phrases like "Here is your content"
- Output MUST be pure Markdown content only

### STRUCTURE REQUIREMENTS
1. Start with a clear title using H1 (#)
2. Add an "Overview" section using H2 (##) with 2-3 paragraphs
3. Create ${pages && pages > 1 ? `${Math.max(3, Math.min(6, pages * 2))}` : "3-6"} major sections using H2 (##)
4. Each major section should contain:
   - Multiple subsections using H3 (###)
   - Detailed explanations with bullet points
   - Definitions of key terms (use **bold**)
   - Concrete examples
   - Important concepts and relationships

### FORMATTING RULES
- Use bullet points (- or *) for lists
- Use numbered lists for sequential steps or processes
- Use **bold** for key terms and important concepts
- Break content into readable chunks
- Include sufficient detail to meet the page requirement

### FINAL SECTION
- End with a "Summary" or "Key Takeaways" section using H2 (##)
- Include 5-10 bullet points summarizing main concepts

Generate the COMPLETE note now. Return ONLY the Markdown content.
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
