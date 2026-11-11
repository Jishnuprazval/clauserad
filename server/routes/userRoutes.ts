import { Router } from 'express';
import { getProfile, updateProfile, changePassword } from '../controllers/userController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, updateProfile);
router.put('/change-password', requireAuth, changePassword);

export default router;
