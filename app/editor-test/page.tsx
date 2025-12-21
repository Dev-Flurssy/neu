"use client";

import dynamic from "next/dynamic";

// Dynamically import your Editor component
const Editor = dynamic(() => import("@/app/components/editor/Editor"), {
  ssr: false, // disable server-side rendering
  loading: () => <p>Loading editor...</p>, // optional fallback
});

export default function EditorTestPage() {
  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-4">Editor Test</h1>
      <Editor />
    </main>
  );
}
