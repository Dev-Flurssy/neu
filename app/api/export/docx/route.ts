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

    // Use domcontentloaded instead of networkidle0 - faster and sufficient for block extraction
    await page.setContent(fullHtml, { 
      waitUntil: "domcontentloaded",
      timeout: 30000
    });

    // Wait for images to load with a 15 second timeout (increased from 10)
    await waitForImages(page, 15000);

    // Additional wait to ensure all images are fully rendered
    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        // Wait for all images to be complete
        const images = Array.from(document.querySelectorAll('img'));
        if (images.length === 0) {
          resolve();
          return;
        }

        let loadedCount = 0;
        const checkComplete = () => {
          loadedCount++;
          if (loadedCount >= images.length) {
            resolve();
          }
        };

        images.forEach(img => {
          if (img.complete && img.naturalHeight !== 0) {
            checkComplete();
          } else {
            img.addEventListener('load', checkComplete);
            img.addEventListener('error', checkComplete);
          }
        });

        // Timeout after 5 seconds
        setTimeout(() => resolve(), 5000);
      });
    });

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
