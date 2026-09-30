import { Router } from 'express';
import submissionsRoutes from './submissions.routes.js';
import registrationsRoutes from './registrations.routes.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    status: 'success',
    message: 'Taxfiler API backend is operational',
    timestamp: new Date().toISOString(),
  });
});

router.use('/v1/user', userRoutes);
router.use('/user', userRoutes);
router.use('/auth', authRoutes);
router.use('/submissions', submissionsRoutes);
router.use('/registrations', registrationsRoutes);

export default router;
