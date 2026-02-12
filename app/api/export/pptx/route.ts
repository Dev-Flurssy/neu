import { NextResponse } from "next/server";
import { launchBrowser, waitForImages, closeBrowser } from "@/lib/export/server/puppeteer-utils";
import { createDocumentHtml } from "@/lib/export/server/html-templates";
import { extractBlocks } from "@/lib/export/server/block-extractor";
import { buildPptxFromBlocks } from "@/lib/export/server/buildpptx";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  let browser;
  
  try {
    const { title, html } = await req.json();

    if (!html) {
      return new NextResponse("Missing HTML content", { status: 400 });
    }

    const fullHtml = createDocumentHtml(html, "11pt");

    browser = await launchBrowser();
    const page = await browser.newPage();

    // Use domcontentloaded for faster loading
    await page.setContent(fullHtml, { 
      waitUntil: "domcontentloaded",
      timeout: 30000
    });

    // Wait for images with timeout
    await waitForImages(page, 10000);

    const blocks = await extractBlocks(page);

    await browser.close();

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
    await closeBrowser(browser);
    return new NextResponse("Failed to generate PPTX", { status: 500 });
  }
}
