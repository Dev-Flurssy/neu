import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  ImageRun,
  WidthType,
  BorderStyle,
} from "docx";
import type { PaginationResult, LayoutBlock } from "@/lib/pagination/types";

/* -------------------------------------------------------
   MAIN DOCX BUILDER
------------------------------------------------------- */

export async function buildDocxFromPagination(pagination: PaginationResult) {
  const sections = [];

  for (const page of pagination.pages) {
    const children: (Paragraph | Table)[] = [];

    for (const block of page.blocks) {
      const converted = await convertBlockToDocx(block);
      children.push(...converted);
    }

    sections.push({
      properties: {},
      children,
    });
  }

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: "numbering",
          levels: [
            {
              level: 0,
              format: "decimal",
              text: "%1.",
              alignment: "left",
            },
          ],
        },
      ],
    },
    sections,
  });

  return await Packer.toBlob(doc);
}

/* -------------------------------------------------------
   BLOCK → DOCX CONVERSION
------------------------------------------------------- */

async function convertBlockToDocx(
  block: LayoutBlock,
): Promise<(Paragraph | Table)[]> {
  const el = htmlToElement(block.html);
  const tag = el.tagName.toLowerCase();

  // Headings
  if (tag === "h1" || tag === "h2" || tag === "h3") {
    const level =
      tag === "h1"
        ? HeadingLevel.HEADING_1
        : tag === "h2"
          ? HeadingLevel.HEADING_2
          : HeadingLevel.HEADING_3;

    return [
      new Paragraph({
        children: parseInlineFormatting(el),
        heading: level,
      }),
    ];
  }

  // Paragraphs
  if (tag === "p") {
    return [
      new Paragraph({
        children: parseInlineFormatting(el),
      }),
    ];
  }

  // Unordered list
  if (tag === "ul") {
    return Array.from(el.children).map(
      (li) =>
        new Paragraph({
          children: parseInlineFormatting(li as HTMLElement),
          bullet: { level: 0 },
        }),
    );
  }

  // Ordered list
  if (tag === "ol") {
    return Array.from(el.children).map(
      (li) =>
        new Paragraph({
          children: parseInlineFormatting(li as HTMLElement),
          numbering: { reference: "numbering", level: 0 },
        }),
    );
  }

  // Images → must be wrapped in a Paragraph
  if (tag === "img") {
    const imageRun = await convertImage(el as HTMLImageElement);
    return [new Paragraph({ children: [imageRun] })];
  }

  // Tables
  if (tag === "table") {
    return [convertTable(el as HTMLTableElement)];
  }

  // Fallback
  return [
    new Paragraph({
      children: parseInlineFormatting(el),
    }),
  ];
}

/* -------------------------------------------------------
   INLINE FORMATTING (bold, italic, underline)
------------------------------------------------------- */

function parseInlineFormatting(
  el: HTMLElement,
  inherited: { bold?: boolean; italics?: boolean; underline?: boolean } = {},
): TextRun[] {
  const runs: TextRun[] = [];

  el.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      if (text.trim()) {
        runs.push(
          new TextRun({
            text,
            bold: inherited.bold,
            italics: inherited.italics,
            underline: inherited.underline ? {} : undefined,
          }),
        );
      }
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const child = node as HTMLElement;

      const next = {
        bold:
          inherited.bold || child.tagName === "STRONG" || child.tagName === "B",
        italics:
          inherited.italics || child.tagName === "EM" || child.tagName === "I",
        underline: inherited.underline || child.tagName === "U",
      };

      runs.push(...parseInlineFormatting(child, next));
    }
  });

  return runs;
}

/* -------------------------------------------------------
   IMAGES
------------------------------------------------------- */

async function convertImage(el: HTMLImageElement): Promise<ImageRun> {
  const src = el.getAttribute("src")!;
  const res = await fetch(src);
  const buffer = await res.arrayBuffer();

  const type = src.endsWith(".png") ? "png" : "jpg";

  return new ImageRun({
    data: buffer,
    transformation: {
      width: el.width || 400,
      height: el.height || 300,
    },
    type,
  });
}

/* -------------------------------------------------------
   TABLES WITH BORDERS
------------------------------------------------------- */

function convertTable(el: HTMLTableElement): Table {
  const rows = Array.from(el.querySelectorAll("tr")).map((tr) => {
    const cells = Array.from(tr.children).map(
      (td) =>
        new TableCell({
          children: [
            new Paragraph({
              children: parseInlineFormatting(td as HTMLElement),
            }),
          ],
          borders: {
            top: {
              style: BorderStyle.SINGLE,
              size: 1,
              color: "000000",
            },
            bottom: {
              style: BorderStyle.SINGLE,
              size: 1,
              color: "000000",
            },
            left: {
              style: BorderStyle.SINGLE,
              size: 1,
              color: "000000",
            },
            right: {
              style: BorderStyle.SINGLE,
              size: 1,
              color: "000000",
            },
          },
        }),
    );

    return new TableRow({ children: cells });
  });

  return new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

/* -------------------------------------------------------
   HTML → DOM ELEMENT
------------------------------------------------------- */

function htmlToElement(html: string): HTMLElement {
  const div = document.createElement("div");
  div.innerHTML = html.trim();
  return div.firstElementChild as HTMLElement;
}
