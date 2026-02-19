import PptxGenJS from "pptxgenjs";
import type { LayoutBlock } from "../pagination/types";

// PPTX slide dimensions (in inches)
const SLIDE_WIDTH = 10;
const SLIDE_HEIGHT = 7.5;
const MARGIN = 0.5;
const CONTENT_WIDTH = SLIDE_WIDTH - (2 * MARGIN);
const CONTENT_HEIGHT = SLIDE_HEIGHT - (2 * MARGIN) - 0.5; // More buffer
const MAX_CONTENT_Y = SLIDE_HEIGHT - MARGIN - 0.5; // Stop earlier

// Very conservative character-per-line estimates
const CHARS_PER_INCH_16PT = 8; // Reduced from 10
const CHARS_PER_INCH_14PT = 9; // Reduced from 11
const CHARS_PER_INCH_HEADING = 6; // Reduced from 8

export async function buildPptxFromBlocks(
  title: string,
  blocks: LayoutBlock[],
): Promise<Buffer> {
  const pptx = new PptxGenJS();
  
  // Title slide
  const titleSlide = pptx.addSlide();
  titleSlide.addText(title, {
    x: MARGIN,
    y: 2.5,
    w: CONTENT_WIDTH,
    h: 1,
    fontSize: 44,
    bold: true,
    align: "center",
    color: "363636",
  });

  let currentSlide = pptx.addSlide();
  let yPosition = MARGIN;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    switch (block.type) {
      case "heading": {
        const level = block.html.startsWith("<h1")
          ? 1
          : block.html.startsWith("<h2")
            ? 2
            : 3;
        const fontSize = level === 1 ? 32 : level === 2 ? 26 : 22;
        
        const text = extractText(block.html);
        const charsPerLine = Math.floor(CONTENT_WIDTH * CHARS_PER_INCH_HEADING);
        const lines = Math.max(1, Math.ceil(text.length / charsPerLine));
        const lineHeightInches = (fontSize / 72) * 1.5; // Increased from 1.4
        const actualHeight = (lines * lineHeightInches) + 0.25; // More spacing
        
        if (yPosition + actualHeight > MAX_CONTENT_Y) {
          currentSlide = pptx.addSlide();
          yPosition = MARGIN;
        }

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
            x: MARGIN,
            y: yPosition,
            w: CONTENT_WIDTH,
            h: actualHeight,
            wrap: true,
            valign: "top",
          });
        } else {
          currentSlide.addText(text, {
            x: MARGIN,
            y: yPosition,
            w: CONTENT_WIDTH,
            h: actualHeight,
            fontSize,
            bold: true,
            color: rgbToHex(block.meta?.layout?.color) || "363636",
            wrap: true,
            valign: "top",
          });
        }

        yPosition += actualHeight;
        break;
      }

      case "paragraph": {
        const text = extractText(block.html);
        if (!text.trim()) break;

        const fontSize = 16;
        const charsPerLine = Math.floor(CONTENT_WIDTH * CHARS_PER_INCH_16PT);
        const lines = Math.max(1, Math.ceil(text.length / charsPerLine));
        const lineHeightInches = (fontSize / 72) * 1.7; // Increased from 1.6
        const actualHeight = (lines * lineHeightInches) + 0.2; // More spacing

        if (yPosition + actualHeight > MAX_CONTENT_Y) {
          currentSlide = pptx.addSlide();
          yPosition = MARGIN;
        }

        if (block.meta?.inline && block.meta.inline.length > 0) {
          const textOptions = block.meta.inline.map((run: any) => ({
            text: run.text,
            options: {
              fontSize,
              bold: run.bold,
              italic: run.italic,
              underline: run.underline ? { style: "sng" } : undefined,
              color: rgbToHex(run.color || block.meta?.layout?.color),
            },
          }));

          currentSlide.addText(textOptions, {
            x: MARGIN,
            y: yPosition,
            w: CONTENT_WIDTH,
            h: actualHeight,
            wrap: true,
            valign: "top",
          });
        } else {
          currentSlide.addText(text, {
            x: MARGIN,
            y: yPosition,
            w: CONTENT_WIDTH,
            h: actualHeight,
            fontSize,
            color: rgbToHex(block.meta?.layout?.color) || "363636",
            wrap: true,
            valign: "top",
          });
        }
        
        yPosition += actualHeight;
        break;
      }

      case "list":
      case "list-item": {
        const text = extractText(block.html);
        if (!text.trim()) break;

        const fontSize = 14;
        const effectiveWidth = CONTENT_WIDTH - 0.5;
        const charsPerLine = Math.floor(effectiveWidth * CHARS_PER_INCH_14PT);
        const lines = Math.max(1, Math.ceil(text.length / charsPerLine));
        const lineHeightInches = (fontSize / 72) * 1.6; // Increased from 1.5
        const itemHeight = (lines * lineHeightInches) + 0.15; // More spacing

        if (yPosition + itemHeight > MAX_CONTENT_Y) {
          currentSlide = pptx.addSlide();
          yPosition = MARGIN;
        }

        if (block.meta?.inline && block.meta.inline.length > 0) {
          const textOptions = block.meta.inline.map((run: any) => ({
            text: run.text,
            options: {
              fontSize,
              bold: run.bold,
              italic: run.italic,
              underline: run.underline ? { style: "sng" } : undefined,
              color: rgbToHex(run.color || block.meta?.layout?.color),
            },
          }));

          currentSlide.addText(textOptions, {
            x: MARGIN,
            y: yPosition,
            w: CONTENT_WIDTH,
            h: itemHeight,
            bullet: true,
            wrap: true,
            valign: "top",
          });
        } else {
          currentSlide.addText(text, {
            x: MARGIN,
            y: yPosition,
            w: CONTENT_WIDTH,
            h: itemHeight,
            fontSize,
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
            const imgWidth = block.meta?.image?.width || 600;
            const imgHeight = block.meta?.image?.height || 400;
            const aspectRatio = imgWidth / imgHeight;
            
            let displayWidth = Math.min(CONTENT_WIDTH, 7);
            let displayHeight = displayWidth / aspectRatio;
            
            const maxImageHeight = 4.5;
            if (displayHeight > maxImageHeight) {
              displayHeight = maxImageHeight;
              displayWidth = displayHeight * aspectRatio;
            }

            if (yPosition + displayHeight > MAX_CONTENT_Y) {
              currentSlide = pptx.addSlide();
              yPosition = MARGIN;
            }

            const xPos = MARGIN + (CONTENT_WIDTH - displayWidth) / 2;
            let imageData = imgSrc;

            currentSlide.addImage({
              data: imageData,
              x: xPos,
              y: yPosition,
              w: displayWidth,
              h: displayHeight,
            });

            yPosition += displayHeight + 0.25;
          } catch (err) {
            console.error("Failed to add image to PPTX:", err);
            if (yPosition + 0.5 > MAX_CONTENT_Y) {
              currentSlide = pptx.addSlide();
              yPosition = MARGIN;
            }
            currentSlide.addText("[Image could not be loaded]", {
              x: MARGIN,
              y: yPosition,
              w: CONTENT_WIDTH,
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
          const tableHeight = tableData.length * rowHeight + 0.25;
          
          if (yPosition + tableHeight > MAX_CONTENT_Y) {
            if (tableHeight > CONTENT_HEIGHT) {
              const rowsPerSlide = Math.floor((CONTENT_HEIGHT - 0.5) / rowHeight);
              let rowIndex = 0;
              
              while (rowIndex < tableData.length) {
                if (yPosition > MARGIN + 0.5) {
                  currentSlide = pptx.addSlide();
                  yPosition = MARGIN;
                }
                
                const rowsToAdd = Math.min(rowsPerSlide, tableData.length - rowIndex);
                const slideTableData = tableData.slice(rowIndex, rowIndex + rowsToAdd);
                const slideTableHeight = slideTableData.length * rowHeight + 0.25;
                
                currentSlide.addTable(slideTableData, {
                  x: MARGIN,
                  y: yPosition,
                  w: CONTENT_WIDTH,
                  border: { type: "solid", color: "CFCFCF", pt: 1 },
                  fontSize: 11,
                  color: "363636",
                  valign: "top",
                  rowH: rowHeight,
                });
                
                yPosition += slideTableHeight;
                rowIndex += rowsToAdd;
                
                if (rowIndex < tableData.length) {
                  currentSlide = pptx.addSlide();
                  yPosition = MARGIN;
                }
              }
            } else {
              currentSlide = pptx.addSlide();
              yPosition = MARGIN;
              
              currentSlide.addTable(tableData, {
                x: MARGIN,
                y: yPosition,
                w: CONTENT_WIDTH,
                border: { type: "solid", color: "CFCFCF", pt: 1 },
                fontSize: 11,
                color: "363636",
                valign: "top",
                rowH: rowHeight,
              });
              
              yPosition += tableHeight;
            }
          } else {
            currentSlide.addTable(tableData, {
              x: MARGIN,
              y: yPosition,
              w: CONTENT_WIDTH,
              border: { type: "solid", color: "CFCFCF", pt: 1 },
              fontSize: 11,
              color: "363636",
              valign: "top",
              rowH: rowHeight,
            });

            yPosition += tableHeight;
          }
        }
        break;
      }

      default:
        break;
    }
  }

  return pptx.write({ outputType: "nodebuffer" }) as Promise<Buffer>;
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
  
  if (rgb.startsWith("#")) {
    return rgb.substring(1);
  }
  
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return undefined;
  
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  
  return ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}
