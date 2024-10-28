import { Router } from 'express';
import { getAllUsers, addUser } from '../controllers/userController';

const router = Router();

router.get('/users', getAllUsers);
router.post('/register', addUser);

export default router;
