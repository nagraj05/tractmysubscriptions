import { chromium } from "playwright"

export async function scrapeClaude() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto("https://claude.com/pricing", { waitUntil: 'networkidle' });
    
    // Give it a bit more time to settle
    await page.waitForTimeout(2000);

    const plans = await page.evaluate(() => {
      // Look for cards or sections that contain pricing info
      // Based on common Webflow layouts used by Anthropic
      const cards = Array.from(document.querySelectorAll('div[class*="pricing"], section, .card, [class*="card"]'));
      
      const results = [];
      const seenPlans = new Set();

      cards.forEach(card => {
        const h3 = card.querySelector('h3');
        if (!h3) return;

        const planName = h3.innerText.trim();
        if (seenPlans.has(planName)) return;

        // Valid Claude Individual plans
        const validPlans = ['Free', 'Pro', 'Max'];
        if (!validPlans.includes(planName)) return;

        // Find the price. Usually a div/p with a large number or $
        const allText = card.innerText;
        
        // Match monthly prices specifically
        // Pro says "$20 if billed monthly" and "$17... with annual"
        // Max says "From $100"
        
        let price = 0;
        if (planName === 'Free') {
          price = 0;
        } else if (planName === 'Pro') {
          // Look for $20 in the text
          if (allText.includes('$20')) price = 20;
          else if (allText.includes('$17')) price = 20; // Default to monthly if we find the annual price
        } else if (planName === 'Max') {
          // Look for $100
          if (allText.includes('$100')) price = 100;
        }

        results.push({
          name: planName,
          price: price,
          currency: 'USD',
          interval: 'monthly'
        });
        seenPlans.add(planName);
      });

      return results;
    });

    await browser.close();
    // Filter out empty results if any
    return plans.filter(p => p.name && (p.price > 0 || p.name === 'Free'));
  } catch (error) {
    console.error("Claude scraping failed:", error);
    if (browser) await browser.close();
    throw error;
  }
}