import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import { SubscriptionService } from './services/subscriptionService.js';
import { initCronJobs } from './utils/cron.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logStream = fs.createWriteStream(path.join(__dirname, '../server.log'), { flags: 'a' });

// Redirect console to file
const originalLog = console.log;
const originalError = console.error;
console.log = (...args) => { originalLog(...args); logStream.write(`[LOG] ${new Date().toISOString()}: ${args.join(' ')}\n`); };
console.error = (...args) => { originalError(...args); logStream.write(`[ERROR] ${new Date().toISOString()}: ${args.join(' ')}\n`); };

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

// Initialize DB
SubscriptionService.createTable()
  .then(() => {
    console.log("Database initialized");
    initCronJobs();
  })
  .catch(err => console.error("DB init failed", err));

app.use('/api', subscriptionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
