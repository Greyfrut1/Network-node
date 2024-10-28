import { Router } from 'express';
import { getAllUsers, addUser, loginUser } from '../controllers/userController';

const router = Router();

router.get('/users', getAllUsers);
router.post('/register', addUser);
router.post('/login', loginUser)

export default router;
