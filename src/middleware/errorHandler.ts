import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { AppError } from '../errors/AppError.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  Logger.error(`[ErrorHandler] Error during ${req.method} ${req.originalUrl}:`, err);

  if (err instanceof AppError) {
    ApiResponse.error(res, err.message, err.statusCode);
    return;
  }

  // Handle Mongoose Duplicate Key Error (Code 11000)
  if (err?.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'Field';
    ApiResponse.error(res, `${field} already exists.`, HTTP_STATUS.CONFLICT);
    return;
  }

  // Handle Mongoose Cast Error (Invalid ObjectId)
  if (err?.name === 'CastError') {
    ApiResponse.error(res, `Invalid resource identifier format: ${err.path}`, HTTP_STATUS.BAD_REQUEST);
    return;
  }

  // Generic internal server error fallback
  const message = err?.message || 'Internal Server Error';
  const statusCode = err?.statusCode || err?.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;

  ApiResponse.error(res, message, statusCode);
};
