import { NextResponse } from "next/server";
import { launchBrowser, waitForImages, closeBrowser } from "@/lib/export/server/puppeteer-utils";
import { createPdfHtml } from "@/lib/export/server/html-templates";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  let browser;
  
  try {
    const { title, html } = await req.json();

    if (!html) {
      return new NextResponse("Missing HTML", { status: 400 });
    }

    const fullHtml = createPdfHtml(title, html);

    browser = await launchBrowser();
    const page = await browser.newPage();

    await page.setContent(fullHtml, { 
      waitUntil: "networkidle0",
      timeout: 60000 
    });

    await waitForImages(page);

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        bottom: "25mm",
        left: "20mm",
        right: "20mm",
      },
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="font-size: 9pt; text-align: center; width: 100%; color: #666;">
          <span class="pageNumber"></span> / <span class="totalPages"></span>
        </div>
      `,
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
