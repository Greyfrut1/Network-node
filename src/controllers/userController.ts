import { Request, Response, NextFunction } from 'express';
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
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      status: 'error',
      message: 'No token provided',
    });
    return; // Оскільки ми відправляємо відповідь, не потрібно викликати next()
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded;
    next(); // Далі передаємо керування на наступний middleware або маршрут
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token',
    });
  }
};
export const profileUser = async (req: Request, res: Response) =>{
    try{
      const userId = req.params.userId;

      const UserData = await UserService.getUserProfile(String(userId));
      if(UserData.length > 0){
        res.status(200).json(UserData);
      }
      else{
        res.status(404).json({
          status: 'error',
          message: '404'
        });
      }

    } catch (err) {
      res.status(404).json({
        status: 'error',
        message: '404'
      });
    }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const userData = await UserService.getUserProfile(String(userId));
    res.status(200).json(userData);
  } catch (err) {
    res.status(404).json({
      status: 'error',
      message: 'User not found',
    });
  }
};

export const editProfile = async (req: Request, res: Response) => {
  try {
    console.log('test')
    console.log(req.file)
    const userId = (req as any).user.userId;
    const { name, email } = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;

    console.log(userId, req.body, avatar);

    const updatedUser = await UserService.editProfile({ name, email, avatar }, userId);
    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'User not found',
    });
  }
};

