import puppeteer from "puppeteer";

export async function POST(req: Request) {
  const { html } = await req.json();

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Load your preview HTML inside a template
  await page.setContent(`
    <html>
      <head>
        <link rel="stylesheet" href="${process.env.BASE_URL}/styles/document.css" />
        <link rel="stylesheet" href="${process.env.BASE_URL}/styles/preview.css" />
      </head>
      <body>
        <div id="root">${html}</div>
      </body>
    </html>
  `);

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  const safeBuffer = Uint8Array.from(pdfBuffer).buffer;

  return new Response(safeBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="document.pdf"`,
    },
  });
}
