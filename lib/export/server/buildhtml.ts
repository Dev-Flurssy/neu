import fs from "fs";
import path from "path";

export function buildExportHtml(title: string, contentHtml: string) {
  const cssPath = path.join(process.cwd(), "public/base.css");
  const parseJsPath = path.join(process.cwd(), "public/export/parse.js");
  const paginateJsPath = path.join(process.cwd(), "public/export/paginate.js");

  const baseCss = fs.readFileSync(cssPath, "utf8");
  const parseJs = fs.readFileSync(parseJsPath, "utf8");
  const paginationJs = fs.readFileSync(paginateJsPath, "utf8");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>

  <style>
${baseCss}
  </style>

  <style>
    body {
      margin: 0;
      padding: 0;
      background: white;
    }
    #root {
      display: flex;
      flex-direction: column;
      gap: 24px;
      align-items: center;
      padding: 24px 0;
    }
  </style>
</head>

<body>
  <div id="root"></div>

  <script>
    window.__HTML__ = ${JSON.stringify(contentHtml)};
  </script>

  <script>
    window.onerror = function (msg, url, line, col, error) {
      console.log("EXPORT ERROR:", msg, url, line, col, error);
      window.__done = "error";
    };
  </script>

  <script>
${parseJs}
  </script>

  <script>
${paginationJs}
  </script>

  <script>
    (async function () {
      try {
        if (!window.parseHtmlToBlocks || !window.paginateBlocks) {
          console.log("Missing pagination globals");
          window.__done = "error";
          return;
        }

        const blocks = window.parseHtmlToBlocks(window.__HTML__);
        const { domPages } = await window.paginateBlocks(blocks);

        const root = document.getElementById("root");
        domPages.forEach((p) => root.appendChild(p));

        window.__done = true;
      } catch (e) {
        console.error("Pagination failed", e);
        window.__done = "error";
      }
    })();
  </script>
</body>
</html>`;
}
