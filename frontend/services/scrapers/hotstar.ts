import axios from 'axios';

export async function scrapeHotstar() {
  const scraperUrl = process.env.SCRAPER_API_URL || "http://localhost:5000";
  try {
    const res = await axios.get(`${scraperUrl}/api/scrape/hotstar`);
    return res.data;
  } catch (error) {
    console.error("Hotstar proxy scrape failed:", error);
    throw error;
  }
}
