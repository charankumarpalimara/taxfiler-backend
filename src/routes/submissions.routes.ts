import { Router } from 'express';
import { SubmissionsController } from '../controllers/submissions.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createSubmissionSchema, updateSubmissionStatusSchema } from '../validators/submission.validator.js';

const router = Router();
const controller = new SubmissionsController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validateRequest(createSubmissionSchema), controller.create);
router.patch('/:id', validateRequest(updateSubmissionStatusSchema), controller.update);
router.delete('/:id', controller.delete);

export default router;
