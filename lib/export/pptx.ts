import PptxGenJS from "pptxgenjs";
import { parseDocument } from "htmlparser2";

export async function exportPPTX(title: string, content: string) {
  const pptx = new PptxGenJS();
  const slide = pptx.addSlide();

  slide.addText(title, {
    x: 0.5,
    y: 0.3,
    fontSize: 28,
    bold: true,
  });

  let y = 1.2;
  const doc = parseDocument(content);

  function addTextBlock(text: string, opts: any = {}) {
    slide.addText(text, {
      x: 0.5,
      y,
      fontSize: opts.fontSize || 16,
      bold: opts.bold || false,
      italic: opts.italic || false,
      bullet: opts.bullet || false,
    });
    y += 0.5;
  }

  function walk(node: any) {
    if (!node) return;

    if (node.type === "tag") {
      const tag = node.name;

      if (["h1", "h2", "h3"].includes(tag)) {
        const text = node.children.map((c: any) => c.data || "").join("");
        addTextBlock(text, {
          fontSize: tag === "h1" ? 26 : tag === "h2" ? 22 : 20,
          bold: true,
        });
      }

      if (tag === "p") {
        const text = node.children.map((c: any) => c.data || "").join("");
        addTextBlock(text);
      }

      if (tag === "strong" || tag === "b") {
        const text = node.children.map((c: any) => c.data || "").join("");
        addTextBlock(text, { bold: true });
      }

      if (tag === "em" || tag === "i") {
        const text = node.children.map((c: any) => c.data || "").join("");
        addTextBlock(text, { italic: true });
      }

      if (tag === "li") {
        const text = node.children.map((c: any) => c.data || "").join("");
        addTextBlock(text, { bullet: true });
      }

      if (tag === "img") {
        const src = node.attribs.src;
        slide.addImage({
          data: src,
          x: 0.5,
          y,
          w: 6,
        });
        y += 3;
      }

      // Table
      if (tag === "table") {
        const rows: any[][] = [];

        node.children.forEach((rowNode: any) => {
          if (rowNode.name === "tr") {
            const row: any[] = [];

            rowNode.children.forEach((cell: any) => {
              if (cell.name === "td" || cell.name === "th") {
                const text = cell.children
                  .map((c: any) => c.data || "")
                  .join("");

                row.push({ text }); // <-- IMPORTANT: pptxgenjs expects objects
              }
            });

            if (row.length > 0) rows.push(row);
          }
        });

        slide.addTable(rows, {
          x: 0.5,
          y,
          w: 8,
          border: { type: "solid", color: "000000", pt: 1 },
        });

        y += rows.length * 0.4 + 0.5;
      }

      node.children.forEach((child: any) => walk(child));
    }
  }

  doc.children.forEach((node: any) => walk(node));

  pptx.writeFile({ fileName: `${title}.pptx` });
}
