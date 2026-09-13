import { Response } from 'express';
import { ApiResponse as IApiResponse } from '../types/index.js';

export class ApiResponse {
  public static success<T>(
    res: Response,
    data?: T,
    messageOrCount?: string | number,
    statusCodeOrMessage: number | string = 200,
    statusCode: number = 200
  ): Response {
    let message: string | undefined;
    let count: number | undefined;
    let finalStatusCode = 200;

    if (typeof messageOrCount === 'string') {
      message = messageOrCount;
      if (typeof statusCodeOrMessage === 'number') {
        finalStatusCode = statusCodeOrMessage;
      }
    } else if (typeof messageOrCount === 'number') {
      count = messageOrCount;
      if (typeof statusCodeOrMessage === 'string') {
        message = statusCodeOrMessage;
        finalStatusCode = statusCode;
      } else if (typeof statusCodeOrMessage === 'number') {
        finalStatusCode = statusCodeOrMessage;
      }
    } else {
      if (typeof statusCodeOrMessage === 'number') {
        finalStatusCode = statusCodeOrMessage;
      }
    }

    const payload: IApiResponse<T> = {
      success: true,
      ...(message && { message }),
      ...(count !== undefined && { count }),
      ...(data !== undefined && { data }),
    };

    return res.status(finalStatusCode).json(payload);
  }

  public static error(res: Response, error: string, statusCode: number = 500): Response {
    const payload: IApiResponse<null> = {
      success: false,
      error,
    };
    return res.status(statusCode).json(payload);
  }
}

export const ApiResponseHelper = ApiResponse;

