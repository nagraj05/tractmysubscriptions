import { chromium } from "playwright";

interface ScrapedPlan {
  name: string;
  price: number;
  currency: string;
  interval: string;
}

export async function scrapeClaude() {
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

    await page.goto("https://claude.ai/pricing", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    await page.waitForSelector("body", { timeout: 10000 });
    await new Promise(resolve => setTimeout(resolve, 3000));

    const plans = await page.evaluate(() => {
      const results: { name: string; price: number; currency: string; interval: string }[] = [];
      const seenPlans = new Set<string>();

      const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4"));
      const validPlans = ["Free", "Pro", "Max"];

      headings.forEach((heading) => {
        const htmlHeading = heading as HTMLElement;
        const planName = htmlHeading.innerText?.trim();
        if (!validPlans.includes(planName)) return;
        if (seenPlans.has(planName)) return;

        let container = htmlHeading as HTMLElement;
        for (let i = 0; i < 5; i++) {
          if (container.parentElement) container = container.parentElement as HTMLElement;
        }

        const allText = container.innerText || "";

        let price = 0;
        if (planName !== "Free") {
          const priceMatches = allText.match(/\$(\d+)/g);
          if (priceMatches && priceMatches.length > 0) {
            price = parseInt(priceMatches[0].replace("$", ""), 10);
          }
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

    return (plans as ScrapedPlan[]).filter((p) => p.name && (p.price > 0 || p.name === "Free"));
  } catch (error) {
    console.error("Claude scraping failed:", error);
    throw error;
  } finally {
    if (browser) await browser.close();
  }
}
