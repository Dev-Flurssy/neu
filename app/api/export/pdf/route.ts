import puppeteer from "puppeteer";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  let browser;
  
  try {
    const { title, html } = await req.json();

    if (!html) {
      return new NextResponse("Missing HTML", { status: 400 });
    }

    // Create a simple HTML document with proper styling
    const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title || "Document"}</title>
  <style>
    @page {
      size: A4;
      margin: 20mm 20mm 25mm 20mm;
    }
    
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #111;
      margin: 0;
      padding: 0;
    }
    
    h1 { font-size: 24pt; margin: 20pt 0 10pt 0; font-weight: 700; page-break-after: avoid; }
    h2 { font-size: 18pt; margin: 16pt 0 10pt 0; font-weight: 700; page-break-after: avoid; }
    h3 { font-size: 14pt; margin: 12pt 0 8pt 0; font-weight: 600; page-break-after: avoid; }
    
    p { margin: 8pt 0; orphans: 3; widows: 3; }
    
    strong, b { font-weight: 700; }
    em, i { font-style: italic; }
    u { text-decoration: underline; }
    
    ul, ol {
      margin: 10pt 0;
      padding-left: 25pt;
      page-break-inside: avoid;
    }
    
    ul { list-style-type: disc; }
    ol { list-style-type: decimal; }
    
    li {
      margin: 4pt 0;
      page-break-inside: avoid;
    }
    
    ul ul { list-style-type: circle; }
    ul ul ul { list-style-type: square; }
    ol ol { list-style-type: lower-alpha; }
    ol ol ol { list-style-type: lower-roman; }
    
    img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 12pt auto;
      page-break-inside: avoid;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10pt 0;
      page-break-inside: avoid;
    }
    
    th, td {
      border: 1px solid #d1d5db;
      padding: 6pt;
      text-align: left;
    }
    
    th {
      background-color: #f3f4f6;
      font-weight: 600;
    }
    
    tr:nth-child(even) td {
      background-color: #fafafa;
    }
    
    hr {
      border: none;
      border-top: 1px solid #ddd;
      margin: 15pt 0;
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;

    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();

    await page.setContent(fullHtml, { 
      waitUntil: "networkidle0",
      timeout: 60000 
    });

    // Wait for images to load
    await page.evaluate(() => {
      return Promise.all(
        Array.from(document.images)
          .filter(img => !img.complete)
          .map(img => new Promise(resolve => {
            img.onload = img.onerror = resolve;
          }))
      );
    });

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
    
    if (browser) {
      try {
        await browser.close();
      } catch (closeErr) {
        console.error("Error closing browser:", closeErr);
      }
    }
    
    return new NextResponse("Failed to generate PDF", { status: 500 });
  }
}
