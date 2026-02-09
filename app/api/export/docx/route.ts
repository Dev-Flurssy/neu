import { NextResponse } from "next/server";
import { launchBrowser, waitForImages, closeBrowser } from "@/lib/export/server/puppeteer-utils";
import { createDocumentHtml } from "@/lib/export/server/html-templates";
import { extractBlocks } from "@/lib/export/server/block-extractor";
import { buildDocxFromPagination } from "@/lib/export/server/builddocx";
import type { PaginationResult as DocxPaginationResult, LayoutBlock } from "@/lib/export/pagination/docx-type";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  let browser;
  
  try {
    const { title, html } = await req.json();

    if (!html) {
      return new NextResponse("Missing HTML content", { status: 400 });
    }

    const fullHtml = createDocumentHtml(html, "14pt");

    browser = await launchBrowser();
    const page = await browser.newPage();

    await page.setContent(fullHtml, { 
      waitUntil: "networkidle0",
      timeout: 120000
    });

    await waitForImages(page);

    const blocks = await extractBlocks(page);

    await browser.close();

    // Create pagination result
    const pagination: DocxPaginationResult = {
      pages: [
        {
          blocks: blocks as LayoutBlock[],
        },
      ],
    };

    // Build DOCX from pagination result
    const docxBuffer = await buildDocxFromPagination(pagination);

    return new NextResponse(new Uint8Array(docxBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${title || "document"}.docx"`,
      },
    });
  } catch (err) {
    console.error("DOCX Export Error:", err);
    await closeBrowser(browser);
    return new NextResponse("Failed to generate DOCX", { status: 500 });
  }
}
