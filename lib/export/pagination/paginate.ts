import { LayoutBlock, PaginationResult, PageLayout } from "./types";

const PAGE_WIDTH = 794;

/* -------------------------
   DYNAMIC PAGE HEIGHT
-------------------------- */
function getPageHeight(): number {
  // Fixed height calculation: A4 @ 96dpi = 1123px
  // Padding: 80px top + 150px bottom = 230px
  // Content height: 1123 - 230 = 893px
  return 893;
}

function createPageDom(): HTMLDivElement {
  const page = document.createElement("div");
  page.className = "page";

  const content = document.createElement("div");
  content.className = "page-content document-content";

  page.appendChild(content);
  return page;
}

async function waitForImages(container: HTMLElement): Promise<void> {
  const images = Array.from(container.querySelectorAll("img"));

  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) resolve();
          else {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }
        }),
    ),
  );

  await new Promise((r) =>
    requestAnimationFrame(() => requestAnimationFrame(r)),
  );
}

async function loadDocumentCss(): Promise<string> {
  const res = await fetch("/base.css");
  return res.text();
}

/* -------------------------
   BLOCK SPLITTING
-------------------------- */
function splitBlock(
  element: HTMLElement,
  maxHeight: number,
): { firstPart: HTMLElement; secondPart: HTMLElement | null } {
  const a = element.cloneNode(true) as HTMLElement;
  const b = element.cloneNode(true) as HTMLElement;

  a.innerHTML = "";
  b.innerHTML = "";

  const nodes = Array.from(element.childNodes);

  for (let i = 0; i < nodes.length; i++) {
    a.appendChild(nodes[i].cloneNode(true));

    const h = a.getBoundingClientRect().height;
    if (h > maxHeight) {
      a.removeChild(a.lastChild!);
      nodes.slice(i).forEach((n) => b.appendChild(n.cloneNode(true)));
      return { firstPart: a, secondPart: b };
    }
  }

  return { firstPart: element, secondPart: null };
}

/* -------------------------
   TABLE SPLITTING
-------------------------- */
function splitTable(
  table: HTMLTableElement,
  maxHeight: number,
): { firstTable: HTMLTableElement; secondTable: HTMLTableElement | null } {
  const t1 = table.cloneNode(false) as HTMLTableElement;
  const t2 = table.cloneNode(false) as HTMLTableElement;

  const thead = table.querySelector("thead");
  if (thead) {
    t1.appendChild(thead.cloneNode(true));
    t2.appendChild(thead.cloneNode(true));
  }

  const rows = Array.from(table.querySelectorAll("tr"));
  const b1 = document.createElement("tbody");
  const b2 = document.createElement("tbody");

  t1.appendChild(b1);
  t2.appendChild(b2);

  for (let i = 0; i < rows.length; i++) {
    b1.appendChild(rows[i].cloneNode(true));

    const h = t1.getBoundingClientRect().height;
    if (h > maxHeight) {
      b1.removeChild(b1.lastChild!);
      rows.slice(i).forEach((r) => b2.appendChild(r.cloneNode(true)));
      return { firstTable: t1, secondTable: t2 };
    }
  }

  return { firstTable: table, secondTable: null };
}

/* -------------------------
   LIST CONTINUATION
-------------------------- */
function applyListContinuation(domPages: HTMLDivElement[]): void {
  for (let i = 1; i < domPages.length; i++) {
    const prevPage = domPages[i - 1].querySelector(".page-content");
    const currPage = domPages[i].querySelector(".page-content");

    if (!prevPage || !currPage) continue;

    const prevLast = prevPage.lastElementChild as HTMLElement | null;
    const currFirst = currPage.firstElementChild as HTMLElement | null;

    if (!prevLast || !currFirst) continue;

    const endedWithList =
      prevLast.tagName.toLowerCase() === "li" || !!prevLast.querySelector("li");

    const startsWithList =
      currFirst.tagName.toLowerCase() === "li" ||
      !!currFirst.querySelector("li");

    if (endedWithList && startsWithList) {
      currFirst.classList.add("list-continuation");
    }
  }
}

/* -------------------------
   MAIN PAGINATION ENGINE
-------------------------- */
export async function paginateBlocks(
  blocks: LayoutBlock[],
  options?: { pageHeight?: number },
): Promise<PaginationResult> {
  const pageHeight = options?.pageHeight ?? getPageHeight();

  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {}
  }

  let worker = document.getElementById("pagination-worker") as HTMLDivElement;

  if (!worker) {
    worker = document.createElement("div");
    worker.id = "pagination-worker";
    Object.assign(worker.style, {
      position: "absolute",
      top: "-99999px",
      left: "-99999px",
      width: `${PAGE_WIDTH}px`,
      opacity: "0",
      pointerEvents: "none",
      transform: "scale(1)",
    });
    document.body.appendChild(worker);
  }

  const css = await loadDocumentCss();

  worker.innerHTML = `
    <style>${css}</style>
    <div class="page">
      <div class="page-content document-content" id="pagination-root"></div>
    </div>
  `;

  const workerRoot = worker.querySelector("#pagination-root") as HTMLDivElement;

  const domPages: HTMLDivElement[] = [];
  const logicalPages: PageLayout[] = [];

  let currentPage = createPageDom();
  let currentLogicalPage: PageLayout = { pageIndex: 0, blocks: [] };
  let currentHeight = 0;

  domPages.push(currentPage);
  logicalPages.push(currentLogicalPage);

  function startNewPage() {
    currentPage = createPageDom();
    domPages.push(currentPage);

    currentLogicalPage = {
      pageIndex: logicalPages.length,
      blocks: [],
    };
    logicalPages.push(currentLogicalPage);

    currentHeight = 0;
  }

  for (const block of blocks) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = block.html;

    const element = wrapper.firstElementChild as HTMLElement | null;
    if (!element) continue;

    element.style.maxWidth = "100%";
    element.style.height = "auto";

    workerRoot.appendChild(element);

    await waitForImages(element);

    const rect = element.getBoundingClientRect();
    const height = rect.height;

    workerRoot.removeChild(element);

    const content = currentPage.querySelector(
      ".page-content",
    ) as HTMLDivElement;

    /* TABLE SPLITTING */
    if (block.type === "table") {
      if (currentHeight + height > pageHeight) {
        const remaining = pageHeight - currentHeight;

        const { firstTable, secondTable } = splitTable(
          element as HTMLTableElement,
          remaining,
        );

        content.appendChild(firstTable);
        currentLogicalPage.blocks.push(block);

        if (secondTable) {
          startNewPage();
          const newContent = currentPage.querySelector(".page-content")!;
          newContent.appendChild(secondTable);
          currentLogicalPage.blocks.push(block);
        }

        continue;
      }
    }

    /* BLOCK SPLITTING */
    if (currentHeight + height > pageHeight) {
      const remaining = pageHeight - currentHeight;

      if (height > pageHeight) {
        const { firstPart, secondPart } = splitBlock(element, remaining);

        content.appendChild(firstPart);
        currentLogicalPage.blocks.push(block);

        startNewPage();
        const newContent = currentPage.querySelector(".page-content")!;

        if (secondPart) {
          newContent.appendChild(secondPart);
          currentLogicalPage.blocks.push(block);
        }

        continue;
      }

      startNewPage();
    }

    const updatedContent = currentPage.querySelector(".page-content")!;
    updatedContent.appendChild(element);
    currentHeight += height;
    currentLogicalPage.blocks.push(block);
  }

  /* CLEANUP EMPTY PAGES */
  // Remove empty pages at the beginning
  while (domPages.length > 0) {
    const firstPage = domPages[0];
    const firstContent = firstPage.querySelector(".page-content") as HTMLElement;
    
    if (firstContent) {
      const hasChildren = firstContent.children.length > 0;
      const hasText = (firstContent.textContent?.trim().length ?? 0) > 0;
      
      if (!hasChildren || !hasText) {
        domPages.shift();
        logicalPages.shift();
      } else {
        break;
      }
    } else {
      break;
    }
  }

  // Remove empty pages at the end
  while (domPages.length > 0) {
    const lastPage = domPages[domPages.length - 1];
    const lastContent = lastPage.querySelector(".page-content") as HTMLElement;

    if (lastContent) {
      const hasChildren = lastContent.children.length > 0;
      const hasText = (lastContent.textContent?.trim().length ?? 0) > 0;

      if (!hasChildren || !hasText) {
        domPages.pop();
        logicalPages.pop();
      } else {
        break;
      }
    } else {
      break;
    }
  }

  applyListContinuation(domPages);

  return { pages: logicalPages, domPages };
}
