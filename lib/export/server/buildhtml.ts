import fs from "fs";

export function buildExportHtml(title: string, contentHtml: string) {
  const baseCss = fs.readFileSync("public/document-base.css", "utf8");

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>

    <style>${baseCss}</style>
  </head>

  <body>
    <div id="root"></div>

    <script>
      window.__HTML__ = ${JSON.stringify(contentHtml)};
    </script>

    <!-- Load pagination script from public folder -->
    <script src="/export/paginate.js"></script>

    <script>
      const pages = paginateContent(window.__HTML__);
      const root = document.getElementById("root");
      pages.forEach(p => root.appendChild(p));
      window.__done = true;
    </script>
  </body>
</html>
`;
}
