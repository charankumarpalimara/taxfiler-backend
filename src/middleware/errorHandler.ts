import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger.js';
import { ApiResponseHelper } from '../utils/apiResponse.js';

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction): void => {
  Logger.error(`Unhandled request error on ${req.method} ${req.originalUrl}:`, err);
  const errorMessage = err?.message || 'Internal Server Error';
  const statusCode = err?.statusCode || err?.status || 500;
  
  ApiResponseHelper.error(res, errorMessage, statusCode);
};
