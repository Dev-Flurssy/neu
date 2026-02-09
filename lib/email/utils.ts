/**
 * Generate a 6-digit verification code
 */
export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Log email to console (development mode)
 */
export function logEmailToConsole(to: string, subject: string, html: string): void {
  console.log("\n=== EMAIL (DEV MODE) ===");
  console.log("To:", to);
  console.log("Subject:", subject);
  
  // Extract verification code from HTML (looks for code in the .code div)
  const codeMatch = html.match(/<div class="code">(\d{6})<\/div>/i);
  
  if (codeMatch && codeMatch[1]) {
    console.log("\n╔════════════════════════════╗");
    console.log("║  🔑 VERIFICATION CODE:     ║");
    console.log(`║        ${codeMatch[1]}            ║`);
    console.log("╚════════════════════════════╝\n");
  }
  
  console.log("Full HTML available in email preview");
  console.log("========================\n");
}
