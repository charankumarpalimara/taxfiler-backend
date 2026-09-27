import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';
import { ValidationError } from '../errors/index.js';

export const validateRequest = (schema: ZodType) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issueMessages = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
        next(new ValidationError(issueMessages.join(', '), error.issues));
      } else {
        next(error);
      }
    }
  };
};
