import { NextResponse } from "next/server";
import { paginateBlocks } from "@/lib/pagination/engine";
import { parseHtmlToBlocks } from "@/lib/pagination/parse";
import { buildDocxFromPagination } from "@/lib/export/server/builddocx";

export async function POST(req: Request) {
  const { html } = await req.json();

  const blocks = parseHtmlToBlocks(html);
  const pagination = await paginateBlocks(blocks);

  const blob = await buildDocxFromPagination(pagination);

  return new NextResponse(blob, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="document.docx"`,
    },
  });
}
