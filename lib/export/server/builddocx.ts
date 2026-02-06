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
const PX_TO_HALF_POINT = 0.75;
const pxToTwip = (px: number) => Math.round(px * PX_TO_TWIP);
const pxToHalfPoint = (px?: number) =>
  px == null ? undefined : Math.round(px * PX_TO_HALF_POINT);

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
          size: { width: pxToTwip(794), height: pxToTwip(1123) },
          margin: {
            top: pxToTwip(40),
            bottom: pxToTwip(40),
            left: pxToTwip(40),
            right: pxToTwip(40),
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
  const isOrdered = block.html.startsWith("<ol");

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
  const img = block.meta.image!;
  const res = await fetch(img.src);
  const buffer = new Uint8Array(await res.arrayBuffer());

  const maxWidth = 794 - 80;
  const scale = Math.min(1, maxWidth / img.width);

  return new Paragraph({
    children: [
      new ImageRun({
        data: buffer,
        type: "png",
        transformation: {
          width: img.width * scale,
          height: img.height * scale,
        },
      }),
    ],
  });
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
function convertRun(run: InlineRun, layout: any) {
  const fontSize = run.fontSize ?? layout.fontSize;
  const fontFamily = run.fontFamily ?? layout.fontFamily;

  return new TextRun({
    text: run.text,
    bold: run.bold,
    italics: run.italic,
    underline: run.underline ? {} : undefined,
    color: run.color?.replace("#", ""),
    shading: run.highlight
      ? { fill: run.highlight.replace("#", "") }
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
