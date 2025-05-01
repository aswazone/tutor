import { HttpError } from '@/utils/http-error.utils';
import { NextFunction, Request, Response } from 'express';

type ErrorType = HttpError &{
  message: string;
  code?: number; 
  statusCode?: number;
  errors?: Record<string, unknown>;
};


const errorMiddleware = (
  err: ErrorType,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    let error: ErrorType = { ...err };
    error.message = err.message;

    if (err instanceof HttpError) {
      // Mongoose bad ObjectId
      if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = new HttpError(404, message);
      }

      // Mongoose duplicate key
      if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new HttpError(400, message);
      }

      // Mongoose validation error
      if (err.name === 'ValidationError' && err.errors) {
        const message = Object.values(err.errors).map(
          (val) => (val as { message: string }).message
        );
        error = new HttpError(400, message.join(', '));
      }
    }

    res.status(
      typeof error.statusCode === 'number' ? error.statusCode : error.statusCode || 500
    ).json({
      success: false,
      error: error.message || 'Server Error',
    });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;

