import { query } from '../lib/db';
import { Subscription } from '../types';

export const SubscriptionService = {
  createTable: async () => {
    const sql = `
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        service_name VARCHAR(255) NOT NULL,
        plan_name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        interval VARCHAR(50) DEFAULT 'monthly',
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(service_name, plan_name, interval)
      );
    `;
    return query(sql);
  },

  upsertSubscription: async (serviceName: string, plan: { name: string; price: number; currency: string; interval: string }) => {
    const sql = `
      INSERT INTO subscriptions (service_name, plan_name, price, currency, interval, last_updated)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      ON CONFLICT (service_name, plan_name, interval) 
      DO UPDATE SET price = EXCLUDED.price, last_updated = EXCLUDED.last_updated;
    `;
    return query(sql, [serviceName, plan.name, plan.price, plan.currency, plan.interval]);
  },

  getAllSubscriptions: async (): Promise<Subscription[]> => {
    const result = await query<Subscription>(
      'SELECT * FROM subscriptions ORDER BY service_name, price ASC'
    );
    return result.rows;
  }
};
