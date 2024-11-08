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

interface EditProfileData {
  name: string;
  email: string;
  avatar?: string;
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

export const getUserProfileInfo = async (userID: string) => {
  const res = await pool.query(`SELECT * FROM users WHERE id = $1`, [userID]);
  return res.rows;
};

export const editProfileInfo = async (userId: string, ProfileData: EditProfileData) => {
  try {
    const query = `
      UPDATE users 
      SET name = $1, email = $2, profile_photo_url = COALESCE($3, profile_photo_url)
      WHERE id = $4
      RETURNING *`;
    const values = [ProfileData.name, ProfileData.email, ProfileData.avatar || null, userId];

    const res = await pool.query(query, values);
    return res.rows[0];
  } catch (err) {
    console.log(err);
    throw new Error('Model server error');
  }
};
