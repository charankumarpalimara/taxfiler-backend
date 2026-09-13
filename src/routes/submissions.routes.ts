import { Router } from 'express';
import { SubmissionsController } from '../controllers/submissions.controller.js';

const router = Router();
const controller = new SubmissionsController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
