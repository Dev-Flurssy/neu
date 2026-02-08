export async function exportPPTX(title: string, html: string) {
  const res = await fetch("/api/export/pptx", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("PPTX export error:", errorText);
    throw new Error(`Failed to export PPTX: ${res.status} ${res.statusText}`);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${title}.pptx`;
  a.click();

  URL.revokeObjectURL(url);
}
