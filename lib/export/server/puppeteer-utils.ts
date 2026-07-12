import puppeteer, { Browser, Page } from "puppeteer-core";
import chromium from "@sparticuz/chromium";

/**
 * Launch Puppeteer browser with standard configuration.
 * Uses @sparticuz/chromium on production (Vercel) and the local
 * Chrome/Chromium install in development.
 */
export async function launchBrowser(): Promise<Browser> {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    // In development, use the locally installed Chrome
    return await puppeteer.launch({
      headless: true,
      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH || // allow override via env
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });
  }

  // Production (Vercel serverless): use @sparticuz/chromium bundled binary
  const executablePath = await chromium.executablePath();

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
