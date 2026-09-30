import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../models/user.model.js';
import { SubmissionModel } from '../../models/submission.model.js';
import { ReferralModel } from '../../models/referral.model.js';
import { ApiResponse } from '../../utils/apiResponse.js';

const JWT_SECRET = process.env.JWT_SECRET || 'taxfiler_super_secret_jwt_key_2026';

export const generateReferralCode = (): string => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `IRS-${year}-${randomNum}`;
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, fullName, email, password, mobile, phone, referralBy } = req.body;

    if (!email || !password) {
      ApiResponse.error(res, 'Email and password are required', 400);
      return;
    }

    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      ApiResponse.error(res, 'User with this email already exists', 400);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const referralId = generateReferralCode();
    const computedName = fullName || `${firstName || ''} ${lastName || ''}`.trim() || 'Tax Filer User';

    const newUser = await UserModel.create({
      firstName: firstName || '',
      lastName: lastName || '',
      fullName: computedName,
      email: email.toLowerCase(),
      password: hashedPassword,
      mobile: mobile || phone || '',
      phone: phone || mobile || '',
      referralId,
      referralBy: referralBy || '',
      role: 'user',
      portalStatus: 'Active',
      accountType: 'Individual Tax Filer',
    });

    if (referralBy) {
      const inviter = await UserModel.findOne({ referralId: referralBy });
      if (inviter) {
        await ReferralModel.create({
          user: inviter._id,
          referredName: computedName,
          referredEmail: email.toLowerCase(),
          status: 'active',
          referralStatus: 'completed',
          rewardAmount: 50,
          rewardStatus: 'pending',
          referralCodeUsed: referralBy,
        });
      }
    }

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role, fullName: newUser.fullName },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    ApiResponse.success(
      res,
      {
        token,
        user: newUser,
      },
      'User registered successfully',
      201
    );
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Registration failed', 500);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      ApiResponse.error(res, 'Email and password are required', 400);
      return;
    }

    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      ApiResponse.error(res, 'Invalid credentials', 401);
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      ApiResponse.error(res, 'Invalid credentials', 401);
      return;
    }

    user.lastLogin = new Date().toISOString();
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, fullName: user.fullName },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    ApiResponse.success(
      res,
      {
        token,
        user,
      },
      'Login successful'
    );
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Login failed', 500);
  }
};

export const consultationcreate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, clientName, email, phone, services, notes, preferredLanguage } = req.body;

    const nameToUse = clientName || `${firstName || ''} ${lastName || ''}`.trim() || 'Consultation Lead';

    const submission = await SubmissionModel.create({
      id: `SUB-${Date.now()}`,
      type: 'consultation',
      firstName: firstName || '',
      lastName: lastName || '',
      clientName: nameToUse,
      email: email || '',
      phone: phone || '',
      preferredLanguage: preferredLanguage || 'English',
      services: Array.isArray(services) ? services : services ? [services] : ['General Tax Consultation'],
      notes: notes || '',
      status: 'New',
      createdAt: new Date().toISOString(),
    });

    ApiResponse.success(res, submission, 'Consultation request submitted successfully', 201);
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to submit consultation request', 500);
  }
};
