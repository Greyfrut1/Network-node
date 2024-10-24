import { pool } from '../config/database'

export const createUserTables = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    `;
    try {
        await pool.query(query);
        console.log('Users table created successfully');
      } catch (err) {
        console.error('Error creating users table:', err);
      }
}