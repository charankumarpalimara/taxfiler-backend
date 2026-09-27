import { Router } from 'express';
import { RegistrationsController } from '../controllers/registrations.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createRegistrationSchema, updateRegistrationStatusSchema } from '../validators/registration.validator.js';

const router = Router();
const controller = new RegistrationsController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validateRequest(createRegistrationSchema), controller.create);
router.patch('/:id', validateRequest(updateRegistrationStatusSchema), controller.updateStatus);
router.delete('/:id', controller.delete);

export default router;
