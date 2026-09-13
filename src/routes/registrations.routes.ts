import { Router } from 'express';
import { RegistrationsController } from '../controllers/registrations.controller.js';

const router = Router();
const controller = new RegistrationsController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.patch('/:id', controller.updateStatus);
router.delete('/:id', controller.delete);

export default router;
