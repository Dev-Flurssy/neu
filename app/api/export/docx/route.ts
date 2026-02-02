import { buildDocx } from "@/lib/export/server/builddocx";

export const runtime = "nodejs";

function safeFilename(name: string) {
  return name
    .replace(/[^a-z0-9_\- ]/gi, "")
    .trim()
    .replace(/\s+/g, "_");
}

export async function POST(req: Request) {
  try {
    const { title, content } = await req.json();

    if (!content) {
      return new Response("Missing content", { status: 400 });
    }

    const buffer = await buildDocx(title || "Document", content);
    const filename = safeFilename(title || "document");

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}.docx"`,
      },
    });
  } catch (err) {
    console.error("DOCX export error:", err);
    return new Response("Failed to generate document", { status: 500 });
  }
}
