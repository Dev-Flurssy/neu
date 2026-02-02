function paginateContent(htmlString) {
  const container = document.createElement("div");
  container.innerHTML = htmlString;

  // Unwrap Tiptap wrapper
  let children = Array.from(container.children);
  if (children.length === 1 && children[0].tagName === "DIV") {
    children = Array.from(children[0].children);
  }

  const pageHeight = 1123 - 80;
  const pages = [];

  let currentPage = createPage();
  pages.push(currentPage);

  let currentHeight = 0;

  children.forEach((child) => {
    const clone = child.cloneNode(true);

    const content = currentPage.querySelector(".page-content");
    if (!content) return;

    content.appendChild(clone);
    const height = clone.offsetHeight;

    if (currentHeight + height > pageHeight) {
      content.removeChild(clone);

      currentPage = createPage();
      pages.push(currentPage);

      const newContent = currentPage.querySelector(".page-content");
      newContent.appendChild(clone);

      currentHeight = clone.offsetHeight;
    } else {
      currentHeight += height;
    }
  });

  return pages;
}

function createPage() {
  const page = document.createElement("div");
  page.className = "page";

  const content = document.createElement("div");
  content.className = "page-content document-content";

  page.appendChild(content);
  return page;
}
