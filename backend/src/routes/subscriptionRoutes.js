import express from 'express';
import { SubscriptionController } from '../controllers/subscriptionController.js';

const router = express.Router();

router.get('/scrape/cursor', SubscriptionController.scrapeCursor);
router.get('/scrape/claude', SubscriptionController.scrapeClaude);
router.get('/scrape/netflix', SubscriptionController.scrapeNetflix);
router.get('/scrape/prime', SubscriptionController.scrapePrime);
router.get('/scrape/hotstar', SubscriptionController.scrapeHotstar);
router.get('/scrape/appletv', SubscriptionController.scrapeAppleTV);
router.get('/exchange-rate', SubscriptionController.getExchangeRate);
router.get('/subscriptions', SubscriptionController.getSubscriptions);

export default router;
