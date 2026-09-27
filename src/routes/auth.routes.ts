import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { loginSchema } from '../validators/auth.validator.js';

const router = Router();
const controller = new AuthController();

router.post('/login', validateRequest(loginSchema), controller.login);
router.post('/admin/login', validateRequest(loginSchema), controller.login);
router.post('/user/login', validateRequest(loginSchema), controller.userLogin);
router.post('/client/login', validateRequest(loginSchema), controller.userLogin);
router.get('/me', authenticateToken, controller.getMe);

export default router;
