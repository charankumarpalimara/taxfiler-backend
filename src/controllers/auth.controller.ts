import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class AuthController {
  public login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const result = await AuthService.loginAdmin(email, password);
    ApiResponse.success(res, result, 'Admin login successful');
  });

  public userLogin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const result = await AuthService.loginUser(email, password);
    ApiResponse.success(res, result, 'Client portal login successful');
  });

  public getMe = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    ApiResponse.success(res, { user: req.user }, 'Authenticated user profile retrieved');
  });
}
