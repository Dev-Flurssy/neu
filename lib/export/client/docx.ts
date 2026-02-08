export async function exportDOCX(title: string, html: string) {
  const res = await fetch("/api/export/docx", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("DOCX export error:", errorText);
    throw new Error(`Failed to export DOCX: ${res.status} ${res.statusText}`);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${title}.docx`;
  a.click();

  URL.revokeObjectURL(url);
}
