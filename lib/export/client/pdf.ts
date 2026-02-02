export async function exportPDF(title: string, contentHtml: string) {
  const response = await fetch("/api/export/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, contentHtml }),
  });

  if (!response.ok) {
    console.error("PDF export failed");
    return;
  }

  const blob = await response.blob();

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title}.pdf`;
  a.click();

  URL.revokeObjectURL(url);
}
