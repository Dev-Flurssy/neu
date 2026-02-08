import PptxGenJS from "pptxgenjs";
import type { LayoutBlock } from "../pagination/types";

export async function buildPptxFromBlocks(
  title: string,
  blocks: LayoutBlock[],
): Promise<Buffer> {
  const pptx = new PptxGenJS();
  
  // Title slide
  const titleSlide = pptx.addSlide();
  titleSlide.addText(title, {
    x: 0.5,
    y: 2.5,
    w: 9,
    h: 1,
    fontSize: 44,
    bold: true,
    align: "center",
    color: "363636",
  });

  let currentSlide = pptx.addSlide();
  let yPosition = 0.5;
  const maxY = 6.5;
  const slideWidth = 9;

  for (const block of blocks) {
    const blockHeight = estimateBlockHeight(block);

    // Create new slide if content doesn't fit
    if (yPosition + blockHeight > maxY && yPosition > 0.5) {
      currentSlide = pptx.addSlide();
      yPosition = 0.5;
    }

    switch (block.type) {
      case "heading": {
        const level = block.html.startsWith("<h1")
          ? 1
          : block.html.startsWith("<h2")
            ? 2
            : 3;
        const fontSize = level === 1 ? 32 : level === 2 ? 28 : 24;
        const text = extractText(block.html);

        currentSlide.addText(text, {
          x: 0.5,
          y: yPosition,
          w: slideWidth,
          fontSize,
          bold: true,
          color: "363636",
        });

        yPosition += blockHeight;
        break;
      }

      case "paragraph": {
        const text = extractText(block.html);
        if (text.trim()) {
          currentSlide.addText(text, {
            x: 0.5,
            y: yPosition,
            w: slideWidth,
            fontSize: 18,
            color: "363636",
          });
          yPosition += blockHeight;
        }
        break;
      }

      case "list-item": {
        const text = extractText(block.html);
        if (text.trim()) {
          if (yPosition + 0.4 > maxY) {
            currentSlide = pptx.addSlide();
            yPosition = 0.5;
          }

          currentSlide.addText(text, {
            x: 0.5,
            y: yPosition,
            w: slideWidth,
            fontSize: 16,
            bullet: true,
            color: "363636",
          });

          yPosition += 0.4;
        }
        break;
      }

      case "image": {
        const imgSrc = extractImageSrc(block.html);
        if (imgSrc) {
          try {
            // Check if we need a new slide for the image
            if (yPosition + 3 > maxY) {
              currentSlide = pptx.addSlide();
              yPosition = 0.5;
            }

            currentSlide.addImage({
              data: imgSrc,
              x: 1,
              y: yPosition,
              w: 8,
              h: 3,
              sizing: { type: "contain", w: 8, h: 3 },
            });

            yPosition += 3.2;
          } catch (err) {
            console.warn("Failed to add image:", err);
          }
        }
        break;
      }

      case "table": {
        const tableData = extractTableData(block.html);
        if (tableData.length > 0) {
          // Tables often need their own slide
          if (yPosition > 0.5) {
            currentSlide = pptx.addSlide();
            yPosition = 0.5;
          }

          currentSlide.addTable(tableData, {
            x: 0.5,
            y: yPosition,
            w: slideWidth,
            border: { type: "solid", color: "CFCFCF", pt: 1 },
            fontSize: 14,
            color: "363636",
          });

          yPosition += tableData.length * 0.4 + 0.5;
        }
        break;
      }

      default:
        break;
    }
  }

  return pptx.write({ outputType: "nodebuffer" }) as Promise<Buffer>;
}

// Helper functions
function estimateBlockHeight(block: LayoutBlock): number {
  switch (block.type) {
    case "heading":
      return 0.6;
    case "paragraph":
      const text = extractText(block.html);
      return Math.max(0.4, Math.ceil(text.length / 100) * 0.3);
    case "list-item":
      return 0.4;
    case "image":
      return 3.2;
    case "table":
      const rows = extractTableData(block.html);
      return rows.length * 0.4 + 0.5;
    default:
      return 0.4;
  }
}

function extractText(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();
}

function extractListItems(html: string): string[] {
  const items: string[] = [];
  const liRegex = /<li[^>]*>(.*?)<\/li>/g;
  let match;

  while ((match = liRegex.exec(html)) !== null) {
    const text = extractText(match[1]);
    if (text) items.push(text);
  }

  return items;
}

function extractImageSrc(html: string): string | null {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/);
  return match ? match[1] : null;
}

function extractTableData(html: string): any[][] {
  const rows: any[][] = [];
  const trRegex = /<tr[^>]*>(.*?)<\/tr>/g;
  let trMatch;

  while ((trMatch = trRegex.exec(html)) !== null) {
    const row: any[] = [];
    const tdRegex = /<t[dh][^>]*>(.*?)<\/t[dh]>/g;
    let tdMatch;

    while ((tdMatch = tdRegex.exec(trMatch[1])) !== null) {
      const text = extractText(tdMatch[1]);
      row.push({ text });
    }

    if (row.length > 0) rows.push(row);
  }

  return rows;
}
