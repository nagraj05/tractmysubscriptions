import axios from 'axios';

export async function scrapePrime() {
  const scraperUrl = process.env.SCRAPER_API_URL || "http://localhost:5000";
  try {
    const res = await axios.get(`${scraperUrl}/api/scrape/prime`);
    return res.data;
  } catch (error) {
    console.error("Prime proxy scrape failed:", error);
    throw error;
  }
}
