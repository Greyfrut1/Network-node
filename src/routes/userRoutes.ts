import { Router } from 'express';
import { getAllUsers, addUser, loginUser, profileUser } from '../controllers/userController';

const router = Router();

router.get('/users', getAllUsers);
router.post('/register', addUser);
router.post('/login', loginUser);
router.get('/profile/:userId', profileUser);

export default router;
