import { NextResponse } from "next/server";
import { parseHtmlToBlocks } from "@/lib/export/pagination/parseUnified";
import { buildPptxFromBlocks } from "@/lib/export/server/buildpptx";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { title, html } = await req.json();

    if (!html) {
      return new NextResponse("Missing HTML content", { status: 400 });
    }

    // Parse HTML to blocks
    const blocks = parseHtmlToBlocks(html);

    // Build PPTX from blocks
    const pptxBuffer = await buildPptxFromBlocks(title || "Presentation", blocks);

    return new NextResponse(new Uint8Array(pptxBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${title || "presentation"}.pptx"`,
      },
    });
  } catch (err) {
    console.error("PPTX Export Error:", err);
    return new NextResponse("Failed to generate PPTX", { status: 500 });
  }
}
