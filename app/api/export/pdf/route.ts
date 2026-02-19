import { NextResponse } from "next/server";
import { launchBrowser, waitForImages, closeBrowser } from "@/lib/export/server/puppeteer-utils";
import { createPdfHtml } from "@/lib/export/server/html-templates";

export const runtime = "nodejs";
export const maxDuration = 120; // 2 minutes for large documents with images

export async function POST(req: Request) {
  let browser;
  
  try {
    const { title, html } = await req.json();

    if (!html) {
      return new NextResponse("Missing HTML", { status: 400 });
    }

    // Use simple PDF HTML without JS pagination - let Puppeteer handle page breaks
    const fullHtml = createPdfHtml(title, html);

    browser = await launchBrowser();
    const page = await browser.newPage();
    
    // Set viewport to match A4 dimensions
    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 1,
    });

    await page.setContent(fullHtml, { 
      waitUntil: "domcontentloaded", // Faster than networkidle0
      timeout: 30000 
    });

    await waitForImages(page);

    // Small delay to ensure rendering is complete
    await new Promise(resolve => setTimeout(resolve, 500));

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        bottom: "25mm",
        left: "20mm",
        right: "20mm",
      },
      preferCSSPageSize: false,
    });

    await browser.close();

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${title || "document"}.pdf"`,
      },
    });
  } catch (err) {
    console.error("PDF Export Error:", err);
    await closeBrowser(browser);
    return new NextResponse("Failed to generate PDF", { status: 500 });
  }
}
