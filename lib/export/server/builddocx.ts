import fs from "fs";
import path from "path";
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
} from "docx";

export async function buildDocx(title: string, contentHtml: string) {
  const children = convertHtmlToDocx(contentHtml);

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: "ordered-list",
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
    sections: [
      {
        children: [
          new Paragraph({
            text: title,
            heading: HeadingLevel.TITLE,
          }),
          ...children,
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

function convertHtmlToDocx(html: string): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];

  const blocks = html.replace(/>\s+</g, "><").split(/(?=<)/g);

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    // H1
    if (trimmed.startsWith("<h1")) {
      elements.push(
        new Paragraph({
          children: parseInlineFormatting(trimmed),
          heading: HeadingLevel.HEADING_1,
        }),
      );
      continue;
    }

    // H2
    if (trimmed.startsWith("<h2")) {
      elements.push(
        new Paragraph({
          children: parseInlineFormatting(trimmed),
          heading: HeadingLevel.HEADING_2,
        }),
      );
      continue;
    }

    // Paragraph
    if (trimmed.startsWith("<p")) {
      elements.push(
        new Paragraph({
          children: parseInlineFormatting(trimmed),
        }),
      );
      continue;
    }

    // Image
    if (trimmed.startsWith("<img")) {
      const src = extractImageSrc(trimmed);
      if (!src || src.startsWith("http")) continue;

      const { buffer, type } = loadImageBuffer(src);

      elements.push(
        new Paragraph({
          children: [
            new ImageRun({
              data: buffer,
              type,
              transformation: { width: 500, height: 300 },
            }),
          ],
        }),
      );
      continue;
    }

    // Table
    if (trimmed.startsWith("<table")) {
      const table = buildTableFromHtml(trimmed);
      if (table) elements.push(table);
      continue;
    }

    // Unordered list
    if (trimmed.startsWith("<ul")) {
      elements.push(...buildListFromHtml(trimmed, false));
      continue;
    }

    // Ordered list
    if (trimmed.startsWith("<ol")) {
      elements.push(...buildListFromHtml(trimmed, true));
      continue;
    }
  }

  return elements;
}
function parseInlineFormatting(html: string): TextRun[] {
  const runs: TextRun[] = [];

  const cleaned = html.replace(/^<[^>]+>|<\/[^>]+>$/g, "");
  const parts = cleaned.split(/(<\/?[^>]+>)/g);

  let bold = false;
  let italic = false;
  let underline = false;

  for (const part of parts) {
    switch (part) {
      case "<strong>":
        bold = true;
        continue;
      case "</strong>":
        bold = false;
        continue;
      case "<em>":
        italic = true;
        continue;
      case "</em>":
        italic = false;
        continue;
      case "<u>":
        underline = true;
        continue;
      case "</u>":
        underline = false;
        continue;
    }

    if (!part.startsWith("<")) {
      runs.push(
        new TextRun({
          text: part,
          bold,
          italics: italic,
          underline: underline ? { type: "single" } : undefined,
        }),
      );
    }
  }

  return runs;
}
function buildListFromHtml(html: string, ordered: boolean): Paragraph[] {
  const items: Paragraph[] = [];
  const liRegex = /<li>(.*?)<\/li>/g;

  let match;
  while ((match = liRegex.exec(html)) !== null) {
    items.push(
      new Paragraph({
        children: parseInlineFormatting(match[1]),
        ...(ordered
          ? { numbering: { reference: "ordered-list", level: 0 } }
          : { bullet: { level: 0 } }),
      }),
    );
  }

  return items;
}

function buildTableFromHtml(html: string): Table | null {
  const rows: TableRow[] = [];
  const rowRegex = /<tr>(.*?)<\/tr>/g;

  let rowMatch;
  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const cells: TableCell[] = [];
    const cellRegex = /<t[dh]>(.*?)<\/t[dh]>/g;

    let cellMatch;
    while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
      cells.push(
        new TableCell({
          children: [
            new Paragraph({
              children: parseInlineFormatting(cellMatch[1]),
            }),
          ],
        }),
      );
    }

    rows.push(new TableRow({ children: cells }));
  }

  return rows.length ? new Table({ rows }) : null;
}
function extractImageSrc(html: string) {
  const match = html.match(/src="([^"]+)"/);
  return match ? match[1] : null;
}

function loadImageBuffer(src: string): { buffer: Buffer; type: "png" | "jpg" } {
  const cleanPath = src.replace(/^\//, "");
  const fullPath = path.join(process.cwd(), "public", cleanPath);
  const buffer = fs.readFileSync(fullPath);

  const ext = cleanPath.split(".").pop()?.toLowerCase();
  const type: "png" | "jpg" = ext === "png" ? "png" : "jpg";

  return { buffer, type };
}
