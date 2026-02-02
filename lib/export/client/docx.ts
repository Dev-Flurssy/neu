// lib/export/client/docx.ts
export async function exportDOCX(title: string, contentHtml: string) {
  const res = await fetch("/api/export/docx", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content: contentHtml }),
  });

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${title}.docx`;
  a.click();

  URL.revokeObjectURL(url);
}
