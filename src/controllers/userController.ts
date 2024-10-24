import { Request, Response } from 'express';
import { UserService } from '../services/userService';

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
