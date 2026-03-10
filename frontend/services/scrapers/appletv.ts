import axios from 'axios';

export async function scrapeAppleTV() {
  const scraperUrl = process.env.SCRAPER_API_URL || "http://localhost:5000";
  try {
    const res = await axios.get(`${scraperUrl}/api/scrape/appletv`);
    return res.data;
  } catch (error) {
    console.error("Apple TV+ proxy scrape failed:", error);
    throw error;
  }
}
