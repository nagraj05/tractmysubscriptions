import { NextResponse } from 'next/server';
import { SubscriptionService } from '@/services/subscriptionService';

export async function GET() {
  try {
    const subscriptions = await SubscriptionService.getAllSubscriptions();
    return NextResponse.json(subscriptions);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('API Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
