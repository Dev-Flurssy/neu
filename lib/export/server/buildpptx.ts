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
  const slideHeight = 7.5;

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
        const fontSize = level === 1 ? 28 : level === 2 ? 24 : 20;
        
        // Use inline runs if available for rich text
        if (block.meta?.inline && block.meta.inline.length > 0) {
          const textOptions = block.meta.inline.map((run: any) => ({
            text: run.text,
            options: {
              fontSize,
              bold: run.bold || true,
              italic: run.italic,
              underline: run.underline ? { style: "sng" } : undefined,
              color: rgbToHex(run.color || block.meta?.layout?.color),
            },
          }));

          currentSlide.addText(textOptions, {
            x: 0.5,
            y: yPosition,
            w: slideWidth,
            h: blockHeight,
            wrap: true,
            valign: "top",
          });
        } else {
          const text = extractText(block.html);
          currentSlide.addText(text, {
            x: 0.5,
            y: yPosition,
            w: slideWidth,
            h: blockHeight,
            fontSize,
            bold: true,
            color: rgbToHex(block.meta?.layout?.color) || "363636",
            wrap: true,
            valign: "top",
          });
        }

        yPosition += blockHeight;
        break;
      }

      case "paragraph": {
        const text = extractText(block.html);
        if (!text.trim()) break;

        // Calculate actual height needed for text
        const lines = Math.ceil(text.length / 80); // Approximate 80 chars per line
        const actualHeight = Math.max(0.4, lines * 0.25);

        // Check if we need a new slide
        if (yPosition + actualHeight > maxY) {
          currentSlide = pptx.addSlide();
          yPosition = 0.5;
        }

        // Use inline runs if available for rich text
        if (block.meta?.inline && block.meta.inline.length > 0) {
          const textOptions = block.meta.inline.map((run: any) => ({
            text: run.text,
            options: {
              fontSize: 16,
              bold: run.bold,
              italic: run.italic,
              underline: run.underline ? { style: "sng" } : undefined,
              color: rgbToHex(run.color || block.meta?.layout?.color),
            },
          }));

          currentSlide.addText(textOptions, {
            x: 0.5,
            y: yPosition,
            w: slideWidth,
            h: actualHeight,
            wrap: true,
            valign: "top",
          });
        } else {
          currentSlide.addText(text, {
            x: 0.5,
            y: yPosition,
            w: slideWidth,
            h: actualHeight,
            fontSize: 16,
            color: rgbToHex(block.meta?.layout?.color) || "363636",
            wrap: true,
            valign: "top",
          });
        }
        
        yPosition += actualHeight;
        break;
      }

      case "list-item": {
        const text = extractText(block.html);
        if (!text.trim()) break;

        const lines = Math.ceil(text.length / 70);
        const itemHeight = Math.max(0.35, lines * 0.25);

        if (yPosition + itemHeight > maxY) {
          currentSlide = pptx.addSlide();
          yPosition = 0.5;
        }

        // Use inline runs if available for rich text
        if (block.meta?.inline && block.meta.inline.length > 0) {
          const textOptions = block.meta.inline.map((run: any) => ({
            text: run.text,
            options: {
              fontSize: 14,
              bold: run.bold,
              italic: run.italic,
              underline: run.underline ? { style: "sng" } : undefined,
              color: rgbToHex(run.color || block.meta?.layout?.color),
            },
          }));

          currentSlide.addText(textOptions, {
            x: 0.5,
            y: yPosition,
            w: slideWidth,
            h: itemHeight,
            bullet: true,
            wrap: true,
            valign: "top",
          });
        } else {
          currentSlide.addText(text, {
            x: 0.5,
            y: yPosition,
            w: slideWidth,
            h: itemHeight,
            fontSize: 14,
            bullet: true,
            color: rgbToHex(block.meta?.layout?.color) || "363636",
            wrap: true,
            valign: "top",
          });
        }

        yPosition += itemHeight;
        break;
      }

      case "image": {
        const imgSrc = block.meta?.image?.src || extractImageSrc(block.html);
        if (imgSrc) {
          try {
            // Check if we need a new slide for the image
            const imageHeight = 3;
            if (yPosition + imageHeight > maxY) {
              currentSlide = pptx.addSlide();
              yPosition = 0.5;
            }

            // Handle base64 images
            let imageData = imgSrc;
            if (imgSrc.startsWith("data:")) {
              // Extract base64 data
              const matches = imgSrc.match(/^data:image\/(png|jpeg|jpg|gif);base64,(.+)$/);
              if (matches) {
                imageData = matches[2]; // Use just the base64 part
              }
            }

            currentSlide.addImage({
              data: imageData,
              x: 1,
              y: yPosition,
              w: 8,
              h: imageHeight,
              sizing: { type: "contain", w: 8, h: imageHeight },
            });

            yPosition += imageHeight + 0.2;
          } catch (err) {
            console.error("Failed to add image to PPTX:", err);
            // Add placeholder text if image fails
            currentSlide.addText("[Image]", {
              x: 1,
              y: yPosition,
              w: 8,
              fontSize: 14,
              color: "999999",
              italic: true,
            });
            yPosition += 0.5;
          }
        }
        break;
      }

      case "table": {
        const tableData = block.meta?.table?.rows 
          ? block.meta.table.rows.map((row: any) => 
              row.cells.map((cell: any) => ({
                text: cell.inline?.map((run: any) => run.text).join("") || "",
              }))
            )
          : extractTableData(block.html);
          
        if (tableData.length > 0) {
          const tableHeight = tableData.length * 0.35 + 0.5;
          
          // Tables often need their own slide
          if (yPosition + tableHeight > maxY) {
            currentSlide = pptx.addSlide();
            yPosition = 0.5;
          }

          currentSlide.addTable(tableData, {
            x: 0.5,
            y: yPosition,
            w: slideWidth,
            border: { type: "solid", color: "CFCFCF", pt: 1 },
            fontSize: 12,
            color: "363636",
            valign: "top",
          });

          yPosition += tableHeight;
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
    case "heading": {
      const text = extractText(block.html);
      const lines = Math.ceil(text.length / 60); // Headings are larger font
      return Math.max(0.5, lines * 0.35);
    }
    case "paragraph": {
      const text = extractText(block.html);
      const lines = Math.ceil(text.length / 80); // ~80 chars per line at 16pt
      return Math.max(0.4, lines * 0.25);
    }
    case "list-item": {
      const text = extractText(block.html);
      const lines = Math.ceil(text.length / 70);
      return Math.max(0.35, lines * 0.25);
    }
    case "image":
      return 3.2;
    case "table": {
      const rows = block.meta?.table?.rows || extractTableData(block.html);
      return rows.length * 0.35 + 0.5;
    }
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

function rgbToHex(rgb: string | undefined): string | undefined {
  if (!rgb) return undefined;
  
  // If already hex, return without #
  if (rgb.startsWith("#")) {
    return rgb.substring(1);
  }
  
  // Parse rgb(r, g, b) or rgba(r, g, b, a)
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return undefined;
  
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  
  return ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}
