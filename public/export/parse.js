// Extract layout model from element
function extractLayoutModel(element) {
  const computed = window.getComputedStyle(element);
  const px = (v) => (v.endsWith("px") ? parseFloat(v) : 0);
  const parseLineHeight = (value, fontSize) => {
    if (value === "normal") return 1.2;
    if (value.endsWith("px")) return parseFloat(value) / fontSize;
    const num = parseFloat(value);
    return !isNaN(num) ? num : 1.2;
  };
  const fontSize = px(computed.fontSize);
  const lineHeight = parseLineHeight(computed.lineHeight, fontSize);
  
  return {
    fontSize,
    lineHeight,
    fontFamily: computed.fontFamily,
    fontWeight: computed.fontWeight,
    fontStyle: computed.fontStyle,
    textAlign: computed.textAlign || "left",
    marginTop: px(computed.marginTop),
    marginBottom: px(computed.marginBottom),
    paddingTop: px(computed.paddingTop),
    paddingBottom: px(computed.paddingBottom),
    paddingLeft: px(computed.paddingLeft),
    paddingRight: px(computed.paddingRight),
    color: computed.color,
    backgroundColor: computed.backgroundColor,
  };
}

// Extract inline runs with formatting
function extractInlineRuns(root) {
  const runs = [];

  const walk = (node, inherited = {}) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      if (!text.trim()) return;
      runs.push({ text, ...inherited });
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node;
      const style = window.getComputedStyle(el);
      const next = {
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
          style.backgroundColor !== "rgba(0,0,0,0)"
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
}

window.parseHtmlToBlocks = function (html) {
  const container = document.createElement("div");
  container.innerHTML = html;

  // Remove whitespace-only text nodes
  Array.from(container.childNodes).forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE && !n.textContent.trim()) {
      n.remove();
    }
  });

  let children = Array.from(container.children);

  // Unwrap TipTap root div if needed
  if (children.length === 1 && children[0].tagName === "DIV") {
    children = Array.from(children[0].children);
  }

  const blocks = [];
  let index = 0;

  for (const el of children) {
    const tag = el.tagName.toLowerCase();

    // Skip empty paragraphs
    if (tag === "p" && !el.textContent.trim()) continue;

    // HEADINGS
    if (tag === "h1" || tag === "h2" || tag === "h3") {
      blocks.push({
        id: `block-${index++}`,
        type: "heading",
        html: el.outerHTML,
        meta: {
          layout: extractLayoutModel(el),
          inline: extractInlineRuns(el),
        },
      });
      continue;
    }

    // IMAGES
    if (tag === "img") {
      blocks.push({
        id: `block-${index++}`,
        type: "image",
        html: el.outerHTML,
        meta: {
          layout: extractLayoutModel(el),
          image: {
            src: el.src,
            width: el.width || el.naturalWidth,
            height: el.height || el.naturalHeight,
          },
        },
      });
      continue;
    }

    // TABLES
    if (tag === "table") {
      const rows = Array.from(el.rows).map((tr) => ({
        cells: Array.from(tr.cells).map((td) => ({
          inline: extractInlineRuns(td),
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
          layout: extractLayoutModel(el),
          table: { rows },
        },
      });
      continue;
    }

    // LISTS → convert each <li> into its own block
    if (tag === "ul" || tag === "ol") {
      const items = Array.from(el.querySelectorAll(":scope > li"));

      for (const li of items) {
        if (!li.textContent.trim()) continue;

        blocks.push({
          id: `block-${index++}`,
          type: "list-item",
          html: li.outerHTML,
          meta: {
            layout: extractLayoutModel(li),
            inline: extractInlineRuns(li),
          },
        });
      }

      continue;
    }

    // PARAGRAPHS / OTHER BLOCKS
    blocks.push({
      id: `block-${index++}`,
      type: "paragraph",
      html: el.outerHTML,
      meta: {
        layout: extractLayoutModel(el),
        inline: extractInlineRuns(el),
      },
    });
  }

  return blocks;
};
