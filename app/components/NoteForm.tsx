"use client";
import * as React from "react";
import * as Form from "@radix-ui/react-form";

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
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const content = (form.elements.namedItem("content") as HTMLTextAreaElement)
      .value;

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
        <Form.Message match="valueMissing" className="text-sm text-red-500">
          Please enter a title
        </Form.Message>
      </Form.Field>

      {/* CONTENT */}
      <Form.Field name="content" className="space-y-2">
        <Form.Label htmlFor="content" className="block text-sm font-medium">
          Content
        </Form.Label>
        <Form.Control asChild>
          <textarea
            id="content"
            name="content"
            rows={5}
            required
            placeholder="Write your note here..."
            defaultValue={defaultValues?.content}
            className="w-full border rounded-md p-2"
          />
        </Form.Control>
        <Form.Message match="valueMissing" className="text-sm text-red-500">
          Please enter some content
        </Form.Message>
      </Form.Field>

      {error && <p className="text-sm text-red-500">{error}</p>}

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
