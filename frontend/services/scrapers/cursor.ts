import { chromium, Request } from "playwright";

interface ScrapedPlan {
  name: string;
  price: number;
  currency: string;
  interval: string;
}

export async function scrapeCursor() {
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.route("**/*.{png,jpg,jpeg,gif,webp,woff,woff2}", (route) =>
      route.abort()
    );

    await page.goto("https://cursor.com/pricing", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    await page.waitForSelector("h3", { timeout: 10000 });

    const plans = await page.evaluate(() => {
      const results: { name: string; price: number; currency: string; interval: string }[] = [];
      const seenPlans = new Set<string>();

      let cards = Array.from(document.querySelectorAll("a.card"));

      if (cards.length === 0) {
        const headings = Array.from(document.querySelectorAll("h3"));
        cards = headings.map((h) => {
          let container = h as HTMLElement;
          for (let i = 0; i < 5; i++) {
            if (container.parentElement) container = container.parentElement as HTMLElement;
          }
          return container;
        });
      }

      cards.forEach((card) => {
        const htmlCard = card as HTMLElement;
        const h3 = htmlCard.querySelector("h3");
        if (!h3) return;

        const planName = (h3 as HTMLElement).innerText?.trim();
        if (!planName || seenPlans.has(planName)) return;

        const allText = (htmlCard as HTMLElement).innerText || "";

        let price = 0;
        if (
          allText.toLowerCase().includes("free") &&
          !allText.includes("$")
        ) {
          price = 0;
        } else {
          const match = allText.match(/\$(\d+(?:\.\d+)?)/);
          price = match ? parseFloat(match[1]) : 0;
        }

        results.push({
          name: planName,
          price,
          currency: "USD",
          interval: "monthly",
        });

        seenPlans.add(planName);
      });

      return results;
    });

    return (plans as ScrapedPlan[]).filter((p) => p.name);
  } catch (error) {
    console.error("Cursor scraping failed:", error);
    throw error;
  } finally {
    if (browser) await browser.close();
  }
}
