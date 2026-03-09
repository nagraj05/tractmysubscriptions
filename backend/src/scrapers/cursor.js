import { chromium } from "playwright"

export async function scrapeCursor() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto("https://cursor.com/pricing", { waitUntil: 'networkidle' });
    await page.waitForSelector('h3');

    const plans = await page.evaluate(() => {
      // The individual pricing cards are <a> tags with class 'card'
      const cardElements = Array.from(document.querySelectorAll('a.card'));
      
      return cardElements.map(card => {
        const h3 = card.querySelector('h3');
        const planName = h3 ? h3.innerText.trim() : null;
        
        // Find the price - it's usually in a paragraph below the h3
        const paragraphs = Array.from(card.querySelectorAll('p'));
        // The price paragraph often contains '$' or 'Free'
        const priceParagraph = paragraphs.find(p => p.innerText.includes('$') || p.innerText.toLowerCase().includes('free'));
        
        if (!planName || !priceParagraph) return null;

        const priceText = priceParagraph.innerText.trim();
        let price = 0;
        let currency = 'USD';

        if (priceText.toLowerCase().includes('free')) {
          price = 0;
        } else {
          // Extract digits and decimals, handle $20/mo. -> 20
          const match = priceText.match(/\d+/);
          price = match ? parseFloat(match[0]) : 0;
        }
        
        return {
          name: planName,
          price: price,
          currency: currency,
          interval: 'monthly'
        };
      }).filter(p => p !== null);
    });

    await browser.close();
    return plans;
  } catch (error) {
    console.error("Scraping failed:", error);
    if (browser) await browser.close();
    throw error;
  }
}
