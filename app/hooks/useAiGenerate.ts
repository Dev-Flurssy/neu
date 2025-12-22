"use client";

import * as React from "react";
import { POST } from "@/app/api/ai/generate/route";

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
        throw new Error(body.message || "Generation Failed");
      }
      return body.data as string;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { generate, loading, error };
}
