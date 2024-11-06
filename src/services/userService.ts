import { getAllUsersFromDB, insertUserToDB, verifyPassword, getUserProfileInfo } from '../models/userModel';
import { generateToken } from '../utils/jwt';

// Визначаємо інтерфейси
interface UserInput {
  name: string;
  email: string;
  password: string;
}

interface UserResponse {
  id: number;
  name: string;
  email: string;
  created_at: Date;
}

interface LoginResponse {
  user: UserResponse;
  token: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export class UserService {
  // Отримання всіх користувачів
  static async getUsers(): Promise<UserResponse[]> {
    try {
      const users = await getAllUsersFromDB();
      // Видаляємо password_hash з відповіді
      return users.map(({ password_hash, ...user }) => user);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get users: ${error.message}`);
      }
      throw new Error('Failed to get users');
    }
  }

  // Створення користувача
  static async createUser(userData: UserInput): Promise<UserResponse> {
    try {
      // Валідація даних
      this.validateUserData(userData);

      const { name, email, password } = userData;
      const user = await insertUserToDB(name, email, password);
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create user: ${error.message}`);
      }
      throw new Error('Failed to create user');
    }
  }

  // Логін користувача
  static async loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const { email, password } = credentials;
      const user = await verifyPassword(email, password);

      // Генеруємо токен після успішної верифікації
      const token = generateToken({
        userId: user.id,
        email: user.email
      });
      // Повертаємо об'єкт з токеном та даними користувача
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at
        },
        token
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Login failed: ${error.message}`);
      }
      throw new Error('Login failed');
    }
  }

  // Валідація даних користувача
  private static validateUserData(data: UserInput): void {
    const { name, email, password } = data;

    if (!name || name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }

    if (!email || !this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
  }

  // Перевірка формату email
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static async getUserProfile(userId: string): Promise<UserResponse[]> {
    try {
      const userProfileData = await getUserProfileInfo(userId);
      // Видаляємо password_hash з відповіді
      return userProfileData.map(({ password_hash, ...user }) => user);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get users: ${error.message}`);
      }
      throw new Error('Failed to get users');
    }
  }
}