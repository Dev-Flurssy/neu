import puppeteer, { Browser, Page } from "puppeteer";

/**
 * Launch Puppeteer browser with standard configuration
 */
export async function launchBrowser(): Promise<Browser> {
  return await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });
}

/**
 * Wait for all images in the page to load
 */
export async function waitForImages(page: Page): Promise<void> {
  await page.evaluate(() => {
    return Promise.all(
      Array.from(document.images)
        .filter(img => !img.complete)
        .map(img => new Promise(resolve => {
          img.onload = img.onerror = resolve;
        }))
    );
  });
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
