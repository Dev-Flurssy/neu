import puppeteer, { Browser, Page } from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";

// Remote chromium binary for Vercel — chromium-min downloads this at runtime
// so the binary is NOT bundled into the function (avoids 50MB limit).
// v123 is the last version compatible with Vercel's Amazon Linux 2 runtime (libnss3 constraint).
const CHROMIUM_REMOTE_URL =
  "https://github.com/Sparticuz/chromium/releases/download/v123.0.1/chromium-v123.0.1-pack.tar";

/**
 * Launch Puppeteer browser with standard configuration.
 * Uses @sparticuz/chromium-min on production (Vercel) — binary is fetched at
 * runtime from GitHub releases to stay under Vercel's 50MB function size limit.
 * Uses the local Chrome install in development.
 */
export async function launchBrowser(): Promise<Browser> {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    // In development, use the locally installed Chrome
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

  // Production (Vercel serverless): fetch binary from remote URL at runtime
  const executablePath = await chromium.executablePath(CHROMIUM_REMOTE_URL);

  return await puppeteer.launch({
    args: chromium.args,
    executablePath,
    headless: chromium.headless,
    defaultViewport: chromium.defaultViewport,
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
        setTimeout(() => reject(new Error('Image loading timeout')), timeout)
      )
    ]);
  } catch (err) {
    console.warn('Image loading timeout or error:', err);
    // Continue anyway - some images might have loaded
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
