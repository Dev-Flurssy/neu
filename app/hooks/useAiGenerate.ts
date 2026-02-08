"use client";

import * as React from "react";

export function useAiGenerate() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  async function generate(prompt: string, retries = 2) {
    if (loading) return; // prevent double taps on mobile

    setLoading(true);
    setError("");

    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000); // 25s mobile timeout

      try {
        const res = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
          signal: controller.signal,
        });

        const body = await res.json();

        if (!res.ok) {
          throw new Error(body.message || "Generation failed");
        }

        clearTimeout(timeout);
        setLoading(false);
        return body.text as string;
      } catch (err: any) {
        clearTimeout(timeout);
        
        // If this is the last attempt, set error and throw
        if (attempt === retries) {
          if (err.name === "AbortError") {
            setError("Connection too slow. Try again.");
          } else {
            setError(err.message || "Failed to generate content");
          }
          setLoading(false);
          throw err;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }

  return { generate, loading, error };
}
