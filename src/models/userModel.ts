import { pool } from '../config/database';
import bcrypt from 'bcrypt';

// Визначаємо інтерфейси
interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

interface PostgresError extends Error {
  code?: string;
}

export const getAllUsersFromDB = async () => {
  const res = await pool.query('SELECT * FROM users');
  return res.rows;
};

export const insertUserToDB = async (name: string, email: string, password: string) => {
  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const res = await pool.query<User>(
      'INSERT INTO users(name, email, password_hash) VALUES($1, $2, $3) RETURNING *',
      [name, email, passwordHash]
    );

    const { password_hash, ...user } = res.rows[0];
    return user;
    
  } catch (error: unknown) {
    if (error instanceof Error && (error as PostgresError).code === '23505') {
      throw new Error('Email already exists');
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

export const verifyPassword = async (email: string, password: string) => {
  try {
    const res = await pool.query<User>(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (res.rows.length === 0) {
      throw new Error('User not found');
    }

    const user = res.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      throw new Error('Invalid password');
    }

    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
    
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};