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
