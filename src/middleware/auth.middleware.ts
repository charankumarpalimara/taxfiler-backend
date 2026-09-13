import { Request, Response, NextFunction } from 'express';
import { AuthService, AdminAuthPayload } from '../services/auth.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export interface AuthenticatedRequest extends Request {
  user?: AdminAuthPayload;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    ApiResponse.error(res, 'Access denied. No authentication token provided.', 401);
    return;
  }

  try {
    const decoded = AuthService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    ApiResponse.error(res, 'Invalid or expired authentication token.', 403);
    return;
  }
};
