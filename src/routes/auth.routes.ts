import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();
const controller = new AuthController();

router.post('/login', controller.login);
router.get('/me', authenticateToken, controller.getMe);

export default router;
