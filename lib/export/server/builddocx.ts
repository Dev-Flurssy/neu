import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ImageRun,
  AlignmentType,
} from "docx";

import type {
  PaginationResult,
  LayoutBlock,
  InlineRun,
  TableMeta,
} from "../pagination/docx-type"; // <-- make sure this points to your DOCX types

// UNIT CONVERSION
const PX_TO_TWIP = 15;
const BASE_FONT_SIZE_PT = 14; // Base font size in points
const pxToTwip = (px: number) => Math.round(px * PX_TO_TWIP);
const pxToHalfPoint = (px?: number) => {
  if (px == null) return BASE_FONT_SIZE_PT * 2; // Return base size in half-points (28 half-points = 14pt)
  // Convert px to points: 14px ≈ 10.5pt, so multiply by 0.75
  const points = px * 0.75;
  return Math.round(points * 2); // Convert to half-points
};

// -------------------------------------------------------
// Convert blocks → DOCX
// -------------------------------------------------------
async function convertBlock(
  block: LayoutBlock,
): Promise<(Paragraph | Table)[]> {
  switch (block.type) {
    case "heading":
      return [buildHeading(block)];
    case "paragraph":
      return [buildParagraph(block)];
    case "list":
    case "list-item":
      return buildList(block);
    case "image":
      return [await buildImage(block)];
    case "table":
      return [buildTable(block)];
    default:
      return [buildParagraph(block)];
  }
}

// -------------------------------------------------------
// DOCX Builder from Pagination
// -------------------------------------------------------
export async function buildDocxFromPagination(pagination: PaginationResult) {
  const sections: any[] = [];

  for (let i = 0; i < pagination.pages.length; i++) {
    const page = pagination.pages[i];
    const children: (Paragraph | Table)[] = [];

    for (const block of page.blocks) {
      const converted = await convertBlock(block);
      children.push(...converted);
    }

    sections.push({
      properties: {
        page: {
          // Standard A4 size in twips (8.27 x 11.69 inches)
          size: { width: 11906, height: 16838 },
          margin: {
            top: pxToTwip(80),    // Increased margins
            bottom: pxToTwip(80),
            left: pxToTwip(80),
            right: pxToTwip(80),
          },
        },
        ...(i > 0 ? { pageBreakBefore: true } : {}),
      },
      children,
    });
  }

  const doc = new Document({
    sections,
    numbering: {
      config: [
        {
          reference: "numbering",
          levels: [
            {
              level: 0,
              format: "decimal",
              text: "%1.",
              alignment: AlignmentType.START,
            },
          ],
        },
      ],
    },
  });

  return Packer.toBuffer(doc);
}

// -------------------------------------------------------
// BLOCK BUILDERS
// -------------------------------------------------------
function buildHeading(block: LayoutBlock) {
  const layout = block.meta.layout;
  const inline = block.meta.inline ?? [];
  const level = block.html.startsWith("<h1")
    ? HeadingLevel.HEADING_1
    : block.html.startsWith("<h2")
      ? HeadingLevel.HEADING_2
      : HeadingLevel.HEADING_3;

  return new Paragraph({
    heading: level,
    spacing: {
      before: pxToTwip(layout.marginTop),
      after: pxToTwip(layout.marginBottom),
      line: pxToTwip(layout.lineHeight * layout.fontSize),
    },
    children: inline.map((run) => convertRun(run, layout)),
  });
}

function buildParagraph(block: LayoutBlock) {
  const layout = block.meta.layout;
  const inline = block.meta.inline ?? [];
  return new Paragraph({
    spacing: {
      before: pxToTwip(layout.marginTop),
      after: pxToTwip(layout.marginBottom),
      line: pxToTwip(layout.lineHeight * layout.fontSize),
    },
    alignment: convertAlignment(layout.textAlign),
    children: inline.map((run) => convertRun(run, layout)),
  });
}

function buildList(block: LayoutBlock) {
  const layout = block.meta.layout;
  const inline = block.meta.inline ?? [];
  const isOrdered = block.html.includes("<ol") || block.html.match(/^\d+\./);

  return [
    new Paragraph({
      spacing: {
        before: pxToTwip(layout.marginTop),
        after: pxToTwip(layout.marginBottom),
      },
      numbering: isOrdered ? { reference: "numbering", level: 0 } : undefined,
      bullet: isOrdered ? undefined : { level: 0 },
      children: inline.map((run) => convertRun(run, layout)),
    }),
  ];
}

async function buildImage(block: LayoutBlock) {
  try {
    const img = block.meta.image!;
    
    if (!img || !img.src) {
      console.warn('DOCX: No image source found in block');
      return new Paragraph({ text: "[No image source]" });
    }
    
    // Handle base64 images
    let buffer: Buffer;
    let imageType: "png" | "jpg" | "gif" = "png";
    
    if (img.src.startsWith("data:")) {
      // Extract base64 data
      const matches = img.src.match(/^data:image\/(png|jpeg|jpg|gif);base64,(.+)$/);
      if (!matches) {
        console.error("DOCX: Invalid base64 image format:", img.src.substring(0, 100));
        return new Paragraph({ text: "[Invalid image format]" });
      }
      
      imageType = matches[1] === "jpeg" ? "jpg" : matches[1] as "png" | "jpg" | "gif";
      const base64Data = matches[2];
      
      // Validate base64 data
      if (!base64Data || base64Data.length < 100) {
        console.error("DOCX: Base64 data too short or empty");
        return new Paragraph({ text: "[Invalid image data]" });
      }
      
      try {
        buffer = Buffer.from(base64Data, 'base64');
      } catch (err) {
        console.error("DOCX: Failed to decode base64:", err);
        return new Paragraph({ text: "[Failed to decode image]" });
      }
    } else {
      // Fetch external image
      try {
        const res = await fetch(img.src);
        if (!res.ok) {
          console.warn(`DOCX: Failed to fetch image: ${img.src}, status: ${res.status}`);
          return new Paragraph({ text: "[Image not available]" });
        }
        
        // Determine type from URL or content-type
        const contentType = res.headers.get("content-type");
        if (contentType?.includes("jpeg") || img.src.includes(".jpg") || img.src.includes(".jpeg")) {
          imageType = "jpg";
        } else if (contentType?.includes("gif") || img.src.includes(".gif")) {
          imageType = "gif";
        }
        
        buffer = Buffer.from(await res.arrayBuffer());
      } catch (err) {
        console.error("DOCX: Failed to fetch external image:", err);
        return new Paragraph({ text: "[Failed to load image]" });
      }
    }

    // Validate buffer
    if (!buffer || buffer.length === 0) {
      console.error("DOCX: Image buffer is empty");
      return new Paragraph({ text: "[Empty image data]" });
    }

    // Get image dimensions (use actual dimensions if available, otherwise defaults)
    let imageWidth = img.width || 400;
    let imageHeight = img.height || 300;
    
    // Calculate max width in pixels (A4 width - margins)
    // A4 width: 8.27 inches = 794 pixels at 96 DPI
    // Margins: 80px on each side
    const maxWidthPx = 794 - (2 * 80); // 634px
    
    // Scale down if too wide, maintaining aspect ratio
    if (imageWidth > maxWidthPx) {
      const scale = maxWidthPx / imageWidth;
      imageWidth = maxWidthPx;
      imageHeight = Math.round(imageHeight * scale);
    }
    
    // Also limit height to reasonable size (max 600px)
    const maxHeightPx = 600;
    if (imageHeight > maxHeightPx) {
      const scale = maxHeightPx / imageHeight;
      imageHeight = maxHeightPx;
      imageWidth = Math.round(imageWidth * scale);
    }
    
    return new Paragraph({
      children: [
        new ImageRun({
          data: buffer,
          type: imageType,
          transformation: {
            width: imageWidth,
            height: imageHeight,
          },
        }),
      ],
      spacing: {
        before: pxToTwip(12),
        after: pxToTwip(12),
      },
      alignment: AlignmentType.CENTER,
    });
  } catch (err) {
    console.error("DOCX: Error building image:", err);
    return new Paragraph({ text: "[Image could not be loaded]" });
  }
}

function buildTable(block: LayoutBlock) {
  const tableMeta = block.meta.table as TableMeta;
  const rows = tableMeta.rows.map(
    (row) =>
      new TableRow({
        children: row.cells.map((cell) => {
          return new TableCell({
            children: [
              new Paragraph({
                children: cell.inline.map((run) => convertRun(run, cell)),
                spacing: {
                  before: pxToTwip(cell.marginTop),
                  after: pxToTwip(cell.marginBottom),
                },
              }),
            ],
            borders: {
              top: {
                style: BorderStyle.SINGLE,
                size: 1,
                color: cell.borderColor,
              },
              bottom: {
                style: BorderStyle.SINGLE,
                size: 1,
                color: cell.borderColor,
              },
              left: {
                style: BorderStyle.SINGLE,
                size: 1,
                color: cell.borderColor,
              },
              right: {
                style: BorderStyle.SINGLE,
                size: 1,
                color: cell.borderColor,
              },
            },
            margins: {
              top: pxToTwip(cell.paddingTop),
              bottom: pxToTwip(cell.paddingBottom),
              left: pxToTwip(cell.paddingLeft),
              right: pxToTwip(cell.paddingRight),
            },
          });
        }),
      }),
  );

  return new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } });
}

// -------------------------------------------------------
// INLINE RUNS & ALIGNMENT
// -------------------------------------------------------
function rgbToHex(color: string | undefined): string | undefined {
  if (!color) return undefined;
  
  // If already hex, return without #
  if (color.startsWith("#")) {
    return color.substring(1);
  }
  
  // Parse rgb(r, g, b) or rgba(r, g, b, a)
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return undefined;
  
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  
  return ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}

function convertRun(run: InlineRun, layout: any) {
  const fontSize = run.fontSize ?? layout.fontSize;
  const fontFamily = run.fontFamily ?? layout.fontFamily;

  return new TextRun({
    text: run.text,
    bold: run.bold,
    italics: run.italic,
    underline: run.underline ? {} : undefined,
    color: rgbToHex(run.color),
    shading: run.highlight
      ? { fill: rgbToHex(run.highlight) }
      : undefined,
    size: pxToHalfPoint(fontSize),
    font: fontFamily.split(",")[0].replace(/['"]/g, "").trim(),
  });
}

function convertAlignment(align: string) {
  switch (align) {
    case "center":
      return AlignmentType.CENTER;
    case "right":
      return AlignmentType.RIGHT;
    case "justify":
      return AlignmentType.BOTH;
    default:
      return AlignmentType.LEFT;
  }
}
