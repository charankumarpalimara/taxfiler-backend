import { Router } from 'express';
import { AdminController } from '../controllers/admin/admin.controller.js';

const router = Router();

// User / Client Management Routes
router.get('/users', AdminController.getUsers);
router.get('/users/:userId/details', AdminController.getUserDetails);
router.patch('/users/:userId', AdminController.updateUser);
router.put('/users/:userId', AdminController.updateUser);

// Document Management & Review Routes
router.get('/documents', AdminController.getAllDocuments);
router.patch('/documents/:id/status', AdminController.updateDocumentStatus);
router.delete('/documents/:id', AdminController.deleteDocument);

export default router;
