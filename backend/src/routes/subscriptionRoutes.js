import express from 'express';
import { SubscriptionController } from '../controllers/subscriptionController.js';

const router = express.Router();

router.get('/scrape/cursor', SubscriptionController.scrapeCursor);
router.get('/scrape/claude', SubscriptionController.scrapeClaude);
router.get('/subscriptions', SubscriptionController.getSubscriptions);

export default router;
