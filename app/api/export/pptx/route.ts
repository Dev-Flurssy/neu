import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
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

    // Use Puppeteer to render HTML and extract blocks with computed styles
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

    // Create a styled HTML document
    const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #111;
      margin: 0;
      padding: 20px;
    }
    
    h1 { font-size: 24pt; margin: 20pt 0 10pt 0; font-weight: 700; }
    h2 { font-size: 18pt; margin: 16pt 0 10pt 0; font-weight: 700; }
    h3 { font-size: 14pt; margin: 12pt 0 8pt 0; font-weight: 600; }
    
    p { margin: 8pt 0; }
    
    strong, b { font-weight: 700; }
    em, i { font-style: italic; }
    u { text-decoration: underline; }
    
    ul, ol {
      margin: 10pt 0;
      padding-left: 25pt;
    }
    
    ul { list-style-type: disc; }
    ol { list-style-type: decimal; }
    
    li { margin: 4pt 0; }
    
    img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 12pt auto;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10pt 0;
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
  </style>
</head>
<body>
  <div id="content">${html}</div>
</body>
</html>`;

    await page.setContent(fullHtml, { 
      waitUntil: "networkidle0",
      timeout: 120000 // Increased to 120 seconds
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

    // Extract blocks with computed styles from the rendered page
    const blocks = await page.evaluate(() => {
      const container = document.getElementById('content');
      if (!container) return [];

      const blocks: any[] = [];
      let index = 0;

      const extractLayoutModel = (el: HTMLElement) => {
        const computed = window.getComputedStyle(el);
        const px = (v: string) => (v.endsWith("px") ? parseFloat(v) : 0);
        
        return {
          fontSize: px(computed.fontSize) || 16,
          lineHeight: parseFloat(computed.lineHeight) / px(computed.fontSize) || 1.2,
          fontFamily: computed.fontFamily,
          fontWeight: computed.fontWeight,
          fontStyle: computed.fontStyle,
          textAlign: computed.textAlign as any,
          marginTop: px(computed.marginTop),
          marginBottom: px(computed.marginBottom),
          paddingTop: px(computed.paddingTop),
          paddingBottom: px(computed.paddingBottom),
          paddingLeft: px(computed.paddingLeft),
          paddingRight: px(computed.paddingRight),
          color: computed.color,
          backgroundColor: computed.backgroundColor,
        };
      };

      const extractInlineRuns = (root: HTMLElement): any[] => {
        const runs: any[] = [];

        const walk = (node: Node, inherited: any = {}) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent ?? "";
            if (!text.trim()) return;
            runs.push({ text, ...inherited });
            return;
          }

          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as HTMLElement;
            const style = window.getComputedStyle(el);
            const next: any = {
              bold:
                inherited.bold ||
                el.tagName === "B" ||
                el.tagName === "STRONG" ||
                parseInt(style.fontWeight) >= 600,
              italic:
                inherited.italic ||
                el.tagName === "I" ||
                el.tagName === "EM" ||
                style.fontStyle === "italic",
              underline:
                inherited.underline ||
                el.tagName === "U" ||
                style.textDecorationLine.includes("underline"),
              color: style.color || inherited.color,
              highlight:
                style.backgroundColor !== "transparent" &&
                style.backgroundColor !== "rgba(0, 0, 0, 0)"
                  ? style.backgroundColor
                  : inherited.highlight,
              fontSize: parseFloat(style.fontSize) || inherited.fontSize,
              fontFamily: style.fontFamily || inherited.fontFamily,
            };
            node.childNodes.forEach((child) => walk(child, next));
          }
        };

        walk(root);
        return runs;
      };

      const children = Array.from(container.children);

      for (const el of children) {
        const tag = el.tagName.toLowerCase();

        if (tag === "p" && !el.textContent?.trim()) continue;

        // HEADINGS
        if (["h1", "h2", "h3"].includes(tag)) {
          blocks.push({
            id: `block-${index++}`,
            type: "heading",
            html: el.outerHTML,
            meta: {
              layout: extractLayoutModel(el as HTMLElement),
              inline: extractInlineRuns(el as HTMLElement),
            },
          });
          continue;
        }

        // IMAGES
        if (tag === "img") {
          const img = el as HTMLImageElement;
          blocks.push({
            id: `block-${index++}`,
            type: "image",
            html: el.outerHTML,
            meta: {
              layout: extractLayoutModel(el as HTMLElement),
              image: {
                src: img.src,
                width: img.width || img.naturalWidth,
                height: img.height || img.naturalHeight,
              },
            },
          });
          continue;
        }

        // TABLES
        if (tag === "table") {
          const tableEl = el as HTMLTableElement;
          const rows = Array.from(tableEl.rows).map((tr) => ({
            cells: Array.from(tr.cells).map((td) => ({
              inline: extractInlineRuns(td as HTMLElement),
              borderColor: "#d1d5db",
              marginTop: 0,
              marginBottom: 0,
              paddingTop: 8,
              paddingBottom: 8,
              paddingLeft: 8,
              paddingRight: 8,
            })),
          }));

          blocks.push({
            id: `block-${index++}`,
            type: "table",
            html: el.outerHTML,
            meta: {
              layout: extractLayoutModel(el as HTMLElement),
              table: { rows },
            },
          });
          continue;
        }

        // LISTS
        if (tag === "ul" || tag === "ol") {
          const items = Array.from(el.querySelectorAll(":scope > li"));

          for (const li of items) {
            if (!li.textContent?.trim()) continue;

            blocks.push({
              id: `block-${index++}`,
              type: "list-item",
              html: li.outerHTML,
              meta: {
                layout: extractLayoutModel(li as HTMLElement),
                inline: extractInlineRuns(li as HTMLElement),
              },
            });
          }

          continue;
        }

        // PARAGRAPHS
        blocks.push({
          id: `block-${index++}`,
          type: "paragraph",
          html: el.outerHTML,
          meta: {
            layout: extractLayoutModel(el as HTMLElement),
            inline: extractInlineRuns(el as HTMLElement),
          },
        });
      }

      return blocks;
    });

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
    
    if (browser) {
      try {
        await browser.close();
      } catch (closeErr) {
        console.error("Error closing browser:", closeErr);
      }
    }
    
    return new NextResponse("Failed to generate PPTX", { status: 500 });
  }
}
