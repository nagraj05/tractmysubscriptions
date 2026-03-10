import axios from 'axios';

export async function scrapeNetflix() {
  const scraperUrl = process.env.SCRAPER_API_URL || "http://localhost:5000";
  try {
    const res = await axios.get(`${scraperUrl}/api/scrape/netflix`);
    return res.data;
  } catch (error) {
    console.error("Netflix proxy scrape failed:", error);
    throw error;
  }
}
