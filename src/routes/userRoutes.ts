import { Router } from 'express';
import { getAllUsers, addUser, loginUser, profileUser, getUser, authMiddleware, editProfile } from '../controllers/userController';
import { upload } from '../middlewares/upload';


const router = Router();

router.get('/users', getAllUsers);
router.post('/register', addUser);
router.post('/login', loginUser);

// Захищені маршрути
router.get('/profile/:userId', authMiddleware, profileUser);
router.get('/user', authMiddleware, getUser);
router.post('/settings/profile', authMiddleware, upload.single('image'), editProfile);

export default router;
