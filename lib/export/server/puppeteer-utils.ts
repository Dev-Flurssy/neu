import puppeteer, { Browser, Page } from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";

// Serve the chromium binary from our own domain (bundled at build time via scripts/bundle-chromium.mjs)
// This avoids GitHub rate limits and ensures the binary matches Vercel's runtime environment.
const CHROMIUM_PACK_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/chromium-pack.tar`
  : "https://neu-dawt.vercel.app/chromium-pack.tar";

// Cache executable path across warm invocations to avoid re-downloading
let cachedExecutablePath: string | null = null;
let downloadPromise: Promise<string> | null = null;

async function getChromiumPath(): Promise<string> {
  if (cachedExecutablePath) return cachedExecutablePath;
  if (!downloadPromise) {
    downloadPromise = chromium
      .executablePath(CHROMIUM_PACK_URL)
      .then((path) => {
        cachedExecutablePath = path;
        return path;
      })
      .catch((err) => {
        downloadPromise = null; // allow retry
        throw err;
      });
  }
  return downloadPromise;
}

/**
 * Launch Puppeteer browser.
 * - Development: uses local Chrome install
 * - Production (Vercel): uses chromium binary bundled at build time, served from our domain
 */
export async function launchBrowser(): Promise<Browser> {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    return await puppeteer.launch({
      headless: true,
      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH ||
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });
  }

  const executablePath = await getChromiumPath();

  return await puppeteer.launch({
    args: chromium.args,
    executablePath,
    headless: true,
  });
}

/**
 * Wait for all images in the page to load
 */
export async function waitForImages(page: Page, timeout: number = 60000): Promise<void> {
  try {
    await Promise.race([
      page.evaluate(() => {
        return Promise.all(
          Array.from(document.images)
            .filter(img => !img.complete)
            .map(img => new Promise(resolve => {
              img.onload = img.onerror = resolve;
            }))
        );
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Image loading timeout")), timeout)
      ),
    ]);
  } catch (err) {
    console.warn("Image loading timeout or error:", err);
  }
}

/**
 * Safely close browser instance
 */
export async function closeBrowser(browser: Browser | undefined): Promise<void> {
  if (browser) {
    try {
      await browser.close();
    } catch (closeErr) {
      console.error("Error closing browser:", closeErr);
    }
  }
}
