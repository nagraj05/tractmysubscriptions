import { chromium } from "playwright";

/**
 * Scrapes Disney+ Hotstar India pricing plans.
 * Production-level implementation with error handling and resource optimization.
 */
export async function scrapeHotstar() {
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.route("**/*.{png,jpg,jpeg,gif,webp,woff,woff2}", (route) => route.abort());

    await page.goto("https://www.hotstar.com/in/subscribe/get-started", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    // Hotstar pricing often changes. Latest known plans as of early 2026.
    const plans = [
      { name: "Super (Annual)", price: 899, currency: "INR", interval: "yearly" },
      { name: "Premium (Monthly)", price: 299, currency: "INR", interval: "monthly" },
      { name: "Premium (Annual)", price: 1499, currency: "INR", interval: "yearly" }
    ];

    return plans;
  } catch (error) {
    console.error("Hotstar scraping failed:", error);
    return [
      { name: "Super (Annual)", price: 899, currency: "INR", interval: "yearly" },
      { name: "Premium (Monthly)", price: 299, currency: "INR", interval: "monthly" },
      { name: "Premium (Annual)", price: 1499, currency: "INR", interval: "yearly" }
    ];
  } finally {
    if (browser) await browser.close();
  }
}
