"use client";

import * as React from "react";
import * as Form from "@radix-ui/react-form";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { AiGenerateButton } from "./AiGenerateButton";

interface NoteFormProps {
  onSubmit: (data: { title: string; content: string }) => void;
  isSubmitting?: boolean;
  error?: string;
  defaultValues?: {
    title?: string;
    content?: string;
  };
}

export function NoteForm({
  onSubmit,
  isSubmitting = false,
  error,
  defaultValues,
}: NoteFormProps) {
  const [content, setContent] = React.useState(defaultValues?.content ?? "");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;

    if (!content.trim()) return;

    onSubmit({ title, content });
  }

  return (
    <Form.Root
      onSubmit={handleSubmit}
      className="space-y-6 p-6 border rounded-xl bg-white shadow-sm"
    >
      {/* TITLE */}
      <Form.Field name="title" className="space-y-2">
        <Form.Label htmlFor="title" className="block text-sm font-medium">
          Title
        </Form.Label>
        <Form.Control asChild>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="Enter note title"
            defaultValue={defaultValues?.title}
            className="w-full border rounded-md p-2"
          />
        </Form.Control>
      </Form.Field>

      {/* CONTENT */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Content</label>

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

      {/* AI BUTTON BELOW EDITOR */}
      <AiGenerateButton
        onInsert={(markdown) =>
          setContent((prev) => (prev ? `${prev}\n\n${markdown}` : markdown))
        }
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* SAVE */}
      <Form.Submit asChild>
        <button
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white p-2 rounded-md disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Note"}
        </button>
      </Form.Submit>
    </Form.Root>
  );
}
