import { SubscriptionService } from '../services/subscriptionService.js';
import { scrapeCursor } from '../scrapers/cursor.js';
import { scrapeClaude } from '../scrapers/claude.js';

export const SubscriptionController = {
  scrapeCursor: async (req, res) => {
    try {
      const plans = await scrapeCursor();
      for (const plan of plans) {
        await SubscriptionService.upsertSubscription('Cursor', plan);
      }
      res.json({ message: "Cursor pricing updated", data: plans });
    } catch (error) {
      res.status(500).json({ error: "Failed to scrape Cursor", details: error.message });
    }
  },

  scrapeClaude: async (req, res) => {
    try {
      const plans = await scrapeClaude();
      for (const plan of plans) {
        await SubscriptionService.upsertSubscription('Claude', plan);
      }
      res.json({ message: "Claude pricing updated", data: plans });
    } catch (error) {
      res.status(500).json({ error: "Failed to scrape Claude", details: error.message });
    }
  },

  getSubscriptions: async (req, res) => {
    console.log("GET /api/subscriptions");
    try {
      const result = await SubscriptionService.getAllSubscriptions();
      console.log(`Found ${result.rows.length} subscriptions`);
      res.json(result.rows);
    } catch (error) {
      console.error("Error in getSubscriptions:", error);
      res.status(500).json({ error: "Failed to fetch subscriptions", details: error.message });
    }
  }
};
