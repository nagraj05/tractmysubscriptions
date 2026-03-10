import { NextResponse } from 'next/server';
import { SubscriptionService } from '@/services/subscriptionService';
import { scrapeCursor } from '@/services/scrapers/cursor';
import { scrapeClaude } from '@/services/scrapers/claude';
import { scrapeNetflix } from '@/services/scrapers/netflix';
import { scrapePrime } from '@/services/scrapers/prime';
import { scrapeHotstar } from '@/services/scrapers/hotstar';
import { scrapeAppleTV } from '@/services/scrapers/appletv';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ service: string }> }
) {
  const { service: serviceParam } = await params;
  const service = serviceParam.toLowerCase();

  try {
    let plans: { name: string; price: number; currency: string; interval: string }[] = [];
    let serviceLabel = "";

    if (service === 'cursor') {
      plans = (await scrapeCursor()) as any;
      serviceLabel = "Cursor";
    } else if (service === 'claude') {
      plans = (await scrapeClaude()) as any;
      serviceLabel = "Claude";
    } else if (service === 'netflix') {
      plans = (await scrapeNetflix()) as any;
      serviceLabel = "Netflix";
    } else if (service === 'prime') {
      plans = (await scrapePrime()) as any;
      serviceLabel = "Prime Video";
    } else if (service === 'hotstar') {
      plans = (await scrapeHotstar()) as any;
      serviceLabel = "Hotstar";
    } else if (service === 'appletv') {
      plans = (await scrapeAppleTV()) as any;
      serviceLabel = "Apple TV+";
    } else {
      return NextResponse.json(
        { error: `Unknown service: ${service}` },
        { status: 400 }
      );
    }

    for (const plan of plans) {
      await SubscriptionService.upsertSubscription(serviceLabel, plan);
    }

    return NextResponse.json({ success: true, count: plans.length });

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