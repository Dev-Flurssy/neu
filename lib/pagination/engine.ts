import { LayoutBlock, PaginationResult, PageLayout } from "./types";

const PAGE_HEIGHT = 1123 - 80;

function createPageDom(): HTMLDivElement {
  const page = document.createElement("div");
  page.className = "page";

  const content = document.createElement("div");
  content.className = "page-content document-content";

  page.appendChild(content);
  return page;
}

async function waitForImages(container: HTMLElement) {
  const images = Array.from(container.querySelectorAll("img"));
  await Promise.all(
    images.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise<void>((res) => {
            img.onload = () => res();
            img.onerror = () => res();
          }),
    ),
  );
}

async function loadDocumentCss() {
  const res = await fetch("/document-base.css");
  return await res.text();
}

export async function paginateBlocks(
  blocks: LayoutBlock[],
  options?: { pageHeight?: number },
): Promise<PaginationResult> {
  const pageHeight = options?.pageHeight ?? PAGE_HEIGHT;

  // Create worker
  let worker = document.getElementById(
    "pagination-worker",
  ) as HTMLDivElement | null;

  if (!worker) {
    worker = document.createElement("div");
    worker.id = "pagination-worker";
    worker.style.position = "absolute";
    worker.style.top = "-99999px";
    worker.style.left = "-99999px";
    worker.style.width = "794px";
    worker.style.visibility = "hidden";
    document.body.appendChild(worker);
  }

  // Inject CSS + page structure
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

  domPages.push(currentPage);
  logicalPages.push(currentLogicalPage);

  let currentHeight = 0;

  for (const block of blocks) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = block.html;
    const element = wrapper.firstElementChild as HTMLElement;
    if (!element) continue;

    // Measure inside styled workerRoot
    workerRoot.appendChild(element);
    await waitForImages(element);
    const height = element.offsetHeight;
    workerRoot.removeChild(element);

    // New page if needed
    if (currentHeight + height > pageHeight && currentHeight > 0) {
      currentPage = createPageDom();
      domPages.push(currentPage);

      currentLogicalPage = {
        pageIndex: logicalPages.length,
        blocks: [],
      };
      logicalPages.push(currentLogicalPage);

      currentHeight = 0;
    }

    // Append to real page
    const content = currentPage.querySelector(
      ".page-content",
    ) as HTMLDivElement;
    content.appendChild(element);

    currentHeight += height;
    currentLogicalPage.blocks.push(block);
  }

  return {
    pages: logicalPages,
    domPages,
  };
}
