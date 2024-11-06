import { Router } from 'express';
import { getAllUsers, addUser, loginUser, profileUser, getUser, authMiddleware } from '../controllers/userController';

const router = Router();

router.get('/users', getAllUsers); // Не потребує авторизації
router.post('/register', addUser); // Не потребує авторизації
router.post('/login', loginUser);  // Не потребує авторизації

// Захищені маршрути
router.get('/profile/:userId', authMiddleware, profileUser);  // Тепер захищений
router.get('/user', authMiddleware, getUser);  // Тепер захищений

export default router;
