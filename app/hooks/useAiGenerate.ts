"use client";

import * as React from "react";

export function useAiGenerate() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  async function generate(prompt: string) {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const body = await res.json();

      if (!res.ok) {
        throw new Error(body.message || "Generation failed");
      }

      return body.text as string;
    } catch (err: any) {
      setError(err.message || "Failed to generate content");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { generate, loading, error };
}
