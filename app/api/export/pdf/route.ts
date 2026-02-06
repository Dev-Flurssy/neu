import puppeteer from "puppeteer";
import { NextResponse } from "next/server";
import { buildExportHtml } from "@/lib/export/server/buildhtml";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { title, html } = await req.json();

    if (!html) {
      return new NextResponse("Missing HTML", { status: 400 });
    }

    const exportHtml = buildExportHtml(title ?? "document", html);

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });

    const page = await browser.newPage();

    await page.setContent(exportHtml, { waitUntil: "domcontentloaded" });

    // Wait for pagination to finish
    await page.waitForFunction(() => (window as any).__done === true, {
      timeout: 30000,
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });

    await browser.close();

    const pdfUint8 = new Uint8Array(pdfBuffer);

    return new NextResponse(pdfUint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${title ?? "document"}.pdf"`,
      },
    });
  } catch (err) {
    console.error("PDF Export Error:", err);
    return new NextResponse("Failed to generate PDF", { status: 500 });
  }
}
