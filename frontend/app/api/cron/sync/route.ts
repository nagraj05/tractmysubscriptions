import { NextResponse } from 'next/server';
import { SubscriptionService } from '@/services/subscriptionService';
import { scrapeCursor } from '@/services/scrapers/cursor';
import { scrapeClaude } from '@/services/scrapers/claude';

export async function GET(request: Request) {
  // Check for auth if needed (Vercel Cron sent a CRON_SECRET)
  // const authHeader = request.headers.get('authorization');
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new Response('Unauthorized', { status: 401 });
  // }

  console.log(`[CRON] ${new Date().toISOString()}: Starting scheduled sync...`);
  
  try {
    // Create table if not exists (safety)
    await SubscriptionService.createTable();

    // Sync Cursor
    const cursorPlans = await scrapeCursor();
    for (const plan of cursorPlans) {
      await SubscriptionService.upsertSubscription('Cursor', plan);
    }
    console.log(`[CRON] Synced Cursor pricing.`);

    // Sync Claude
    const claudePlans = await scrapeClaude();
    for (const plan of claudePlans) {
      await SubscriptionService.upsertSubscription('Claude', plan);
    }
    console.log(`[CRON] Synced Claude pricing.`);

    return NextResponse.json({
      success: true,
      message: 'Scheduled sync completed successfully.'
    });

  } catch (error: unknown) {

    if (error instanceof Error) {
      console.error(`[CRON] Scheduled sync FAILED:`, error.message);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.error(`[CRON] Scheduled sync FAILED: Unknown error`, error);

    return NextResponse.json(
      { error: "Unknown error occurred" },
      { status: 500 }
    );
  }
}

