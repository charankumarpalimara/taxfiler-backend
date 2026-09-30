import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken } from '../middleware/auth.middleware.js';
import * as userController from '../controllers/user/user.controller.js';
import * as profileController from '../controllers/user/profile.controller.js';
import * as taxpayerController from '../controllers/user/taxpayer.controller.js';
import * as documentController from '../controllers/user/document.controller.js';
import * as scheduleController from '../controllers/user/schedule.controller.js';
import * as referralController from '../controllers/user/referral.controller.js';

import os from 'os';

const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const uploadDir = isVercel
  ? path.join(os.tmpdir(), 'uploads')
  : path.join(process.cwd(), 'uploads');

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.warn('Warning: Could not create upload directory:', err);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
const router = Router();

// Public Routes
router.post('/auth/register', userController.register);
router.post('/auth/login', userController.login);
router.post('/consultation/create', userController.consultationcreate);

// Protected Profile Routes
router.get('/profile', authenticateToken as any, profileController.getProfile as any);
router.put('/profile/update', authenticateToken as any, upload.single('image'), profileController.updateProfile as any);

// Taxpayer & Account Information Routes
router.post('/taxpayer/create', authenticateToken as any, taxpayerController.saveProfile as any);
router.get('/taxpayer/list', authenticateToken as any, taxpayerController.listTaxpayerProfile as any);

router.post('/spouselist/create', authenticateToken as any, taxpayerController.spousesaveProfile as any);
router.get('/spouselist/list', authenticateToken as any, taxpayerController.spouselist as any);

router.post('/address/create', authenticateToken as any, taxpayerController.saveAddress as any);
router.get('/address/list', authenticateToken as any, taxpayerController.addressList as any);

router.post('/contact/create', authenticateToken as any, taxpayerController.saveContact as any);
router.get('/contact/list', authenticateToken as any, taxpayerController.getContact as any);

router.post('/identity/create', authenticateToken as any, upload.single('licenseDocument'), taxpayerController.saveIdentity as any);
router.get('/identity/list', authenticateToken as any, taxpayerController.getIdentity as any);

router.post('/bank/create', authenticateToken as any, taxpayerController.saveBankDetails as any);
router.get('/bank/list', authenticateToken as any, taxpayerController.getBankDetails as any);

router.post('/dependent/create', authenticateToken as any, taxpayerController.createDependent as any);
router.get('/dependent/list', authenticateToken as any, taxpayerController.getDependents as any);
router.put('/dependent/update/:id', authenticateToken as any, taxpayerController.updateDependent as any);
router.delete('/dependent/delete/:id', authenticateToken as any, taxpayerController.deleteDependent as any);

// Document Management Routes
router.post('/document/upload', authenticateToken as any, upload.single('file'), documentController.uploadDocument as any);
router.get('/document/list', authenticateToken as any, documentController.listDocuments as any);
router.delete('/document/delete/:id', authenticateToken as any, documentController.deleteDocument as any);

// Consultation Scheduling Routes
router.get('/schedule/available', authenticateToken as any, scheduleController.getAvailableSchedules as any);
router.get('/schedule/my', authenticateToken as any, scheduleController.getMyAppointment as any);
router.post('/schedule/book', authenticateToken as any, scheduleController.bookSchedule as any);
router.post('/schedule/request', authenticateToken as any, scheduleController.requestSchedule as any);

// Referral Program Routes
router.post('/referral/create', authenticateToken as any, referralController.createReferral as any);
router.get('/referral/list', authenticateToken as any, referralController.listReferrals as any);

export default router;
