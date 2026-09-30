import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { ReferralModel } from '../../models/referral.model.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export const createReferral = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { referredName, referredEmail, referralCode } = req.body;

    if (!referredEmail) {
      ApiResponse.error(res, 'Referred email is required', 400);
      return;
    }

    const referral = await ReferralModel.create({
      user: userId,
      referredName: referredName || 'Invited User',
      referredEmail: referredEmail.toLowerCase(),
      status: 'active',
      referralStatus: 'pending',
      rewardAmount: 50,
      rewardStatus: 'pending',
      referralCodeUsed: referralCode || '',
    });

    ApiResponse.success(res, referral, 'Referral created successfully', 201);
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to create referral', 500);
  }
};

export const listReferrals = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const referrals = await ReferralModel.find({ user: userId }).sort({ createdAt: -1 });
    ApiResponse.success(res, referrals, 'Referrals list fetched');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to fetch referrals', 500);
  }
};
