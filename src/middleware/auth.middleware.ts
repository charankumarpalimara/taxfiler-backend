import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../utils/apiResponse.js';

const JWT_SECRET = process.env.JWT_SECRET || 'taxfiler_super_secret_jwt_key_2026';

export interface UserAuthPayload {
  id?: string;
  adminId?: string;
  email: string;
  role?: string;
  fullName?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: UserAuthPayload;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    ApiResponse.error(res, 'Access denied. No authentication token provided.', 401);
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserAuthPayload;
    req.user = decoded;
    next();
  } catch (error) {
    ApiResponse.error(res, 'Invalid or expired authentication token.', 403);
    return;
  }
};

export const verifytoken = authenticateToken;
