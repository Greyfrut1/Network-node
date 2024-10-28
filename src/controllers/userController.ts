import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { verifyToken } from '../utils/jwt';


export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserService.getUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get users' });
  }
};

export const addUser = async (req: Request, res: Response) => {
  try {
    // Дістаємо дані з тіла запиту
    const { name, email, password } = req.body;

    // Передаємо дані в сервіс у вигляді об'єкта, як вимагає інтерфейс UserInput
    const newUser = await UserService.createUser({ name, email, password });

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add user' });
    console.log(err)
  }
};


export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Отримуємо користувача та токен
    const { user, token } = await UserService.loginUser({ email, password });

    // Відправляємо відповідь з токеном та даними користувача
    res.status(200).json({
      status: 'success',
      data: {
        user,
        token
      }
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({
      status: 'error',
      message: err instanceof Error ? err.message : 'Login failed'
    });
  }
};

// Middleware для перевірки авторизації
export const authMiddleware = async (req: Request, res: Response, next: Function) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // Можна додати перевірку користувача в базі даних
    // const user = await UserService.getUserById(decoded.userId);

    // Додаємо дані користувача до запиту
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }
};