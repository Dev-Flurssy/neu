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
  const maxY = 6.8; // Slightly more conservative to avoid overflow
  const slideWidth = 9;
  const leftMargin = 0.5;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const blockHeight = estimateBlockHeight(block);

    // Create new slide if content doesn't fit (with some buffer)
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
        const fontSize = level === 1 ? 32 : level === 2 ? 26 : 22;
        const actualHeight = level === 1 ? 0.7 : level === 2 ? 0.6 : 0.5;
        
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
              fontSize,
              bold: run.bold || true,
              italic: run.italic,
              underline: run.underline ? { style: "sng" } : undefined,
              color: rgbToHex(run.color || block.meta?.layout?.color),
            },
          }));

          currentSlide.addText(textOptions, {
            x: leftMargin,
            y: yPosition,
            w: slideWidth,
            h: actualHeight,
            wrap: true,
            valign: "top",
          });
        } else {
          const text = extractText(block.html);
          currentSlide.addText(text, {
            x: leftMargin,
            y: yPosition,
            w: slideWidth,
            h: actualHeight,
            fontSize,
            bold: true,
            color: rgbToHex(block.meta?.layout?.color) || "363636",
            wrap: true,
            valign: "top",
          });
        }

        yPosition += actualHeight + 0.15; // Add spacing after heading
        break;
      }

      case "paragraph": {
        const text = extractText(block.html);
        if (!text.trim()) break;

        // Calculate actual height needed for text (more accurate)
        const charCount = text.length;
        const charsPerLine = 90; // ~90 chars per line at 16pt on 9" width
        const lines = Math.ceil(charCount / charsPerLine);
        const actualHeight = Math.max(0.35, lines * 0.22);

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
            x: leftMargin,
            y: yPosition,
            w: slideWidth,
            h: actualHeight,
            wrap: true,
            valign: "top",
          });
        } else {
          currentSlide.addText(text, {
            x: leftMargin,
            y: yPosition,
            w: slideWidth,
            h: actualHeight,
            fontSize: 16,
            color: rgbToHex(block.meta?.layout?.color) || "363636",
            wrap: true,
            valign: "top",
          });
        }
        
        yPosition += actualHeight + 0.1;
        break;
      }

      case "list-item": {
        const text = extractText(block.html);
        if (!text.trim()) break;

        const charCount = text.length;
        const charsPerLine = 80; // Slightly less for bullets
        const lines = Math.ceil(charCount / charsPerLine);
        const itemHeight = Math.max(0.3, lines * 0.2);

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
            x: leftMargin,
            y: yPosition,
            w: slideWidth,
            h: itemHeight,
            bullet: true,
            wrap: true,
            valign: "top",
          });
        } else {
          currentSlide.addText(text, {
            x: leftMargin,
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

        yPosition += itemHeight + 0.05;
        break;
      }

      case "image": {
        const imgSrc = block.meta?.image?.src || extractImageSrc(block.html);
        if (imgSrc) {
          try {
            // Images get their own slide for better presentation
            currentSlide = pptx.addSlide();
            yPosition = 0.5;

            // Handle base64 images
            let imageData = imgSrc;
            if (imgSrc.startsWith("data:")) {
              // PptxGenJS can handle data URLs directly
              imageData = imgSrc;
            }

            // Get image dimensions if available
            const imgWidth = block.meta?.image?.width || 600;
            const imgHeight = block.meta?.image?.height || 400;
            
            // Calculate aspect ratio
            const aspectRatio = imgWidth / imgHeight;
            
            // Fit image to slide (max 8" wide, 5" tall)
            let displayWidth = 8;
            let displayHeight = displayWidth / aspectRatio;
            
            if (displayHeight > 5) {
              displayHeight = 5;
              displayWidth = displayHeight * aspectRatio;
            }

            // Center the image
            const xPos = (10 - displayWidth) / 2;
            const yPos = (7.5 - displayHeight) / 2;

            currentSlide.addImage({
              data: imageData,
              x: xPos,
              y: yPos,
              w: displayWidth,
              h: displayHeight,
            });

            // Start fresh on next slide
            currentSlide = pptx.addSlide();
            yPosition = 0.5;
          } catch (err) {
            console.error("Failed to add image to PPTX:", err);
            // Add placeholder text if image fails
            if (yPosition + 0.5 > maxY) {
              currentSlide = pptx.addSlide();
              yPosition = 0.5;
            }
            currentSlide.addText("[Image could not be loaded]", {
              x: leftMargin,
              y: yPosition,
              w: slideWidth,
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
          const rowHeight = 0.4;
          const tableHeight = tableData.length * rowHeight + 0.3;
          
          // Tables get their own slide if they're large
          if (tableHeight > 4 || yPosition + tableHeight > maxY) {
            currentSlide = pptx.addSlide();
            yPosition = 0.5;
          }

          currentSlide.addTable(tableData, {
            x: leftMargin,
            y: yPosition,
            w: slideWidth,
            border: { type: "solid", color: "CFCFCF", pt: 1 },
            fontSize: 12,
            color: "363636",
            valign: "top",
            rowH: rowHeight,
          });

          yPosition += tableHeight + 0.2;
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
      const level = block.html.startsWith("<h1") ? 1 : block.html.startsWith("<h2") ? 2 : 3;
      return level === 1 ? 0.7 : level === 2 ? 0.6 : 0.5;
    }
    case "paragraph": {
      const text = extractText(block.html);
      const lines = Math.ceil(text.length / 90);
      return Math.max(0.35, lines * 0.22);
    }
    case "list-item": {
      const text = extractText(block.html);
      const lines = Math.ceil(text.length / 80);
      return Math.max(0.3, lines * 0.2);
    }
    case "image":
      return 5.5; // Images get their own slide
    case "table": {
      const rows = block.meta?.table?.rows || extractTableData(block.html);
      return rows.length * 0.4 + 0.3;
    }
    default:
      return 0.35;
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
