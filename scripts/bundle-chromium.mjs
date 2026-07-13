/**
 * Postinstall script: packages the @sparticuz/chromium binary into
 * public/chromium-pack.tar so it can be served from our own domain
 * at runtime (avoids GitHub rate limits and libnss3 version mismatches).
 *
 * Only runs when @sparticuz/chromium is available (i.e. in CI/Vercel build).
 * Safe to skip in production runtime where devDependencies are not installed.
 */
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { existsSync, mkdirSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(__dirname);

async function main() {
  try {
    // Resolve the full @sparticuz/chromium package (devDep — only in build env)
    let chromiumPath;
    try {
      const resolved = import.meta.resolve("@sparticuz/chromium");
      chromiumPath = fileURLToPath(resolved);
    } catch {
      console.log("⚠️  @sparticuz/chromium not found — skipping chromium bundling (dev/runtime env)");
      return;
    }

    // Navigate up from build/esm/index.js → package root → bin/
    const chromiumDir = dirname(dirname(dirname(chromiumPath)));
    const binDir = join(chromiumDir, "bin");

    if (!existsSync(binDir)) {
      console.log("⚠️  Chromium bin directory not found at:", binDir);
      console.log("⚠️  Skipping chromium bundling");
      return;
    }

    const publicDir = join(projectRoot, "public");
    const outputPath = join(publicDir, "chromium-pack.tar");

    if (!existsSync(publicDir)) {
      mkdirSync(publicDir, { recursive: true });
    }

    console.log("📦 Bundling Chromium binary into public/chromium-pack.tar...");
    execSync(`tar -cf "${outputPath}" -C "${binDir}" .`, {
      stdio: "inherit",
      cwd: projectRoot,
    });
    console.log("✅ Chromium bundled successfully!");
  } catch (error) {
    console.error("❌ Chromium bundling failed:", error.message);
    // Non-fatal — local dev doesn't need this
    process.exit(0);
  }
}

main();
