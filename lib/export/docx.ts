import htmlToDocx from "html-to-docx";
import { saveAs } from "file-saver";

export async function exportDOCX(title: string, content: string) {
  const html = `
    <h1>${title}</h1>
    ${content}
  `;

  const blob = await htmlToDocx(html, {
    table: { row: { cantSplit: true } },
    footer: true,
    pageNumber: true,
  });

  saveAs(blob, `${title}.docx`);
}
