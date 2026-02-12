import { Page } from "puppeteer";

/**
 * Extract blocks with computed styles from rendered HTML page
 * Used by DOCX and PPTX exporters
 */
export async function extractBlocks(page: Page): Promise<any[]> {
  return await page.evaluate(() => {
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

      // IMAGES (check both direct img tags and imgs inside paragraphs)
      if (tag === "img") {
        const img = el as HTMLImageElement;
        console.log('Found direct image:', img.src.substring(0, 50), img.width, img.height);
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

      // Check if paragraph contains only an image
      if (tag === "p") {
        const imgInP = el.querySelector("img");
        if (imgInP && el.children.length === 1) {
          const img = imgInP as HTMLImageElement;
          console.log('Found image in paragraph:', img.src.substring(0, 50), img.width, img.height);
          blocks.push({
            id: `block-${index++}`,
            type: "image",
            html: img.outerHTML,
            meta: {
              layout: extractLayoutModel(img as HTMLElement),
              image: {
                src: img.src,
                width: img.width || img.naturalWidth,
                height: img.height || img.naturalHeight,
              },
            },
          });
          continue;
        }
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
}
