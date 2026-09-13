import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class AuthController {
  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      ApiResponse.success(res, result, 'Admin login successful');
    } catch (error: any) {
      if (error.message && (error.message.includes('required') || error.message.includes('Invalid'))) {
        ApiResponse.error(res, error.message, 401);
        return;
      }
      next(error);
    }
  };

  public getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      ApiResponse.success(res, { user: req.user }, 'Authenticated user profile retrieved');
    } catch (error) {
      next(error);
    }
  };
}
