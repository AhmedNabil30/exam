import express from 'express';
import { AuthController } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/login', AuthController.login);
router.get('/profile', authMiddleware, AuthController.profile);

export default router;