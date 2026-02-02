import puppeteer from "puppeteer";
import { buildExportHtml } from "@/lib/export/server/buildhtml";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { title, contentHtml } = await req.json();

  const html = buildExportHtml(title, contentHtml);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });

  await page.waitForFunction("window.__done === true");

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  // ⭐ Convert Buffer → Uint8Array (TS-safe)
  const uint8 = new Uint8Array(pdf);

  return new Response(uint8, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${title}.pdf"`,
    },
  });
}
