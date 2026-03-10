import { SubscriptionService } from '../services/subscriptionService.js';
import { scrapeCursor } from '../scrapers/cursor.js';
import { scrapeClaude } from '../scrapers/claude.js';
import { scrapeNetflix } from '../scrapers/netflix.js';
import { scrapePrime } from '../scrapers/prime.js';
import { scrapeHotstar } from '../scrapers/hotstar.js';
import { scrapeAppleTV } from '../scrapers/appletv.js';
import { CurrencyService } from '../services/currencyService.js';

export const SubscriptionController = {
  scrapeCursor: async (req, res) => {
    try {
      const plans = await scrapeCursor();
      for (const plan of plans) {
        await SubscriptionService.upsertSubscription('Cursor', plan);
      }
      res.json(plans);
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
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: "Failed to scrape Claude", details: error.message });
    }
  },

  scrapeNetflix: async (req, res) => {
    try {
      const plans = await scrapeNetflix();
      for (const plan of plans) {
        await SubscriptionService.upsertSubscription('Netflix', plan);
      }
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: "Failed to scrape Netflix", details: error.message });
    }
  },

  scrapePrime: async (req, res) => {
    try {
      const plans = await scrapePrime();
      for (const plan of plans) {
        await SubscriptionService.upsertSubscription('Prime Video', plan);
      }
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: "Failed to scrape Prime Video", details: error.message });
    }
  },

  scrapeHotstar: async (req, res) => {
    try {
      const plans = await scrapeHotstar();
      for (const plan of plans) {
        await SubscriptionService.upsertSubscription('Hotstar', plan);
      }
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: "Failed to scrape Hotstar", details: error.message });
    }
  },

  scrapeAppleTV: async (req, res) => {
    try {
      const plans = await scrapeAppleTV();
      for (const plan of plans) {
        await SubscriptionService.upsertSubscription('Apple TV+', plan);
      }
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: "Failed to scrape Apple TV+", details: error.message });
    }
  },

  getExchangeRate: async (req, res) => {
    try {
      const rate = await CurrencyService.getExchangeRate();
      res.json({ rate });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch exchange rate", details: error.message });
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
