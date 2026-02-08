import { NextResponse } from "next/server";
import { parseHtmlToBlocks } from "@/lib/export/pagination/parseUnified";
import { paginateBlocks } from "@/lib/export/pagination/paginate";
import { buildDocxFromPagination } from "@/lib/export/server/builddocx";
import type { PaginationResult as DocxPaginationResult } from "@/lib/export/pagination/docx-type";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { title, html } = await req.json();

    if (!html) {
      return new NextResponse("Missing HTML content", { status: 400 });
    }

    // Parse and paginate the HTML content with full layout metadata
    const blocks = parseHtmlToBlocks(html);
    const pagination = await paginateBlocks(blocks);

    // Build DOCX from pagination result
    const docxBuffer = await buildDocxFromPagination(pagination as any as DocxPaginationResult);

    return new NextResponse(new Uint8Array(docxBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${title || "document"}.docx"`,
      },
    });
  } catch (err) {
    console.error("DOCX Export Error:", err);
    return new NextResponse("Failed to generate DOCX", { status: 500 });
  }
}
