"use client";

import * as React from "react";

export function useAiGenerate() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  async function generate(prompt: string) {
    if (loading) return; // prevent double taps on mobile

    setLoading(true);
    setError("");

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

      return body.text as string;
    } catch (err: any) {
      if (err.name === "AbortError") {
        setError("Connection too slow. Try again.");
      } else {
        setError(err.message || "Failed to generate content");
      }
      throw err;
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }

  return { generate, loading, error };
}
