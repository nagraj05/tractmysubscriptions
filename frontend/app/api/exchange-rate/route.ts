import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  const scraperUrl = process.env.SCRAPER_API_URL || "http://localhost:5000";
  try {
    const res = await axios.get(`${scraperUrl}/api/exchange-rate`);
    return NextResponse.json(res.data);
  } catch (error) {
    console.error("Exchange rate proxy failed:", error);
    // Fallback if backend is down
    return NextResponse.json({ rate: 83.0 });
  }
}
