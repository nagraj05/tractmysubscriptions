import pool from './config/db.js';

async function checkDb() {
  try {
    const res = await pool.query('SELECT * FROM subscriptions');
    console.log("Total rows:", res.rows.length);
    console.table(res.rows);
  } catch (err) {
    console.error("error querying db:", err);
  } finally {
    await pool.end();
  }
}

checkDb();
