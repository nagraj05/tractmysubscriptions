import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ service: string }> }
) {
  const { service: serviceParam } = await params;
  const service = serviceParam.toLowerCase();

  try {
    const endpoint = `${process.env.SCRAPER_API_URL || "http://localhost:5000"}/api/scrape/${service}`;
    const res = await axios.get(endpoint);
    const plans = res.data as { plan_name: string; price: number; currency: string; interval: string }[];

    return NextResponse.json({ success: true, count: plans.length, data: plans });

  } catch (error: unknown) {

    console.error(`Scrape Error (${service}):`, error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Unknown error occurred" },
      { status: 500 }
    );
  }
}