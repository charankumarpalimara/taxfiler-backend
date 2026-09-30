import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { UserModel } from '../../models/user.model.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const user = await UserModel.findById(userId);

    if (!user) {
      ApiResponse.error(res, 'User not found', 404);
      return;
    }

    ApiResponse.success(res, user, 'Profile fetched successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to fetch profile', 500);
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { name, firstName, lastName, mobile, phone, address, referralId } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      ApiResponse.error(res, 'User not found', 404);
      return;
    }

    if (name) {
      user.fullName = name;
    } else if (firstName || lastName) {
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.fullName = `${user.firstName} ${user.lastName}`.trim();
    }

    if (mobile || phone) {
      user.mobile = mobile || phone || user.mobile;
      user.phone = phone || mobile || user.phone;
    }

    if (address !== undefined) {
      user.address = address;
    }

    if (referralId && !user.referralId) {
      user.referralId = referralId;
    }

    if (req.file) {
      user.image = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      user.image = req.body.image;
    }

    user.updatedAt = new Date().toISOString();
    await user.save();

    ApiResponse.success(res, user, 'Profile updated successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to update profile', 500);
  }
};
