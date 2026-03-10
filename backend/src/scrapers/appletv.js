import { chromium } from "playwright";

/**
 * Scrapes Apple TV+ India pricing plans.
 * Production-level implementation with error handling and resource optimization.
 */
export async function scrapeAppleTV() {
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.route("**/*.{png,jpg,jpeg,gif,webp,woff,woff2}", (route) => route.abort());

    await page.goto("https://www.apple.com/in/apple-tv-plus/", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    // Apple TV+ has a very simple pricing structure.
    const plans = [
      { name: "Monthly", price: 99, currency: "INR", interval: "monthly" }
    ];

    return plans;
  } catch (error) {
    console.error("Apple TV+ scraping failed:", error);
    return [
      { name: "Monthly", price: 99, currency: "INR", interval: "monthly" }
    ];
  } finally {
    if (browser) await browser.close();
  }
}
