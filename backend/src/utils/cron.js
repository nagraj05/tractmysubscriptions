import cron from 'node-cron';
import { scrapeCursor } from '../scrapers/cursor.js';
import { scrapeClaude } from '../scrapers/claude.js';
import { SubscriptionService } from '../services/subscriptionService.js';

export const initCronJobs = () => {
  // Schedule a task to run every day at midnight (00:00)
  // Format: minute hour day-of-month month day-of-week
  cron.schedule('0 0 * * *', async () => {
    console.log(`[CRON] ${new Date().toISOString()}: Starting scheduled sync...`);
    try {
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
      
      console.log(`[CRON] Scheduled sync completed successfully.`);
    } catch (error) {
      console.error(`[CRON] Scheduled sync FAILED:`, error.message);
    }
  });

  console.log("Cron jobs initialized (Manual sync every 24h at midnight)");
};
