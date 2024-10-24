import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Налаштування підключення до бази даних
export const pool = new Pool({
  user: process.env.DB_USER,
  host: 'localhost',
  database: process.env.DB_NAME,
  password: process.env.DB_USER_PASS,
  port: Number(process.env.DB_PORT),
});

// Функція для підключення до бази даних
export const connectToDatabase = async () => {
  try {
    await pool.connect();
    console.log('Connected to PostgreSQL');
  } catch (err) {
    console.error('Error connecting to PostgreSQL', err);
  }
};
