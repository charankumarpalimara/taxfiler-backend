import { AppError } from './AppError.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad Request', details?: any) {
    super(message, HTTP_STATUS.BAD_REQUEST, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized Access', details?: any) {
    super(message, HTTP_STATUS.UNAUTHORIZED, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access Forbidden', details?: any) {
    super(message, HTTP_STATUS.FORBIDDEN, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource Not Found', details?: any) {
    super(message, HTTP_STATUS.NOT_FOUND, details);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation Failed', details?: any) {
    super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY, details);
  }
}

export * from './AppError.js';
