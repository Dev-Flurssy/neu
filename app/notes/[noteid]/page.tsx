"use client";

import { useRouter } from "next/navigation";
import { useNote } from "@/app/hooks/useNote";
import ReactMarkdown from "react-markdown";

export default function NotePage({ params }: { params: { noteid: string } }) {
  const router = useRouter();
  const { note, loading, error, deleteNote } = useNote(params.noteid);

  async function handleDelete() {
    if (!confirm("Delete this note?")) return;
    try {
      await deleteNote();
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to delete note");
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!note) return <p>Note not found</p>;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{note.title}</h1>

      {/* MARKDOWN RENDER */}
      <article className="prose max-w-none">
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </article>

      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Delete
        </button>
        <button
          onClick={() => router.push(`/notes/${note.id}/edit`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
