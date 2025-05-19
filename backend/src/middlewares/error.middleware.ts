import { HttpError } from '@/utils/http-error.utils';
import { NextFunction, Request, Response } from 'express';

const errorMiddleware = (
  err: HttpError & { code?: number; errors?: Record<string, unknown> },
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {

    console.log('!!!');
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Server Error';

    // Handle specific error cases
    if (err.name === 'CastError') {
      statusCode = 404;
      message = 'Resource not found';
    } else if (err.code === 11000) {
      statusCode = 400;
      message = 'Duplicate field value entered';
    } else if (err.name === 'ValidationError' && err.errors) {
      message = Object.values(err.errors)
        .map((val) => (val as { message: string }).message)
        .join(', ');
      statusCode = 400;
    }

    // Send the error response
    res.status(statusCode).json({
      success: false,
      error: message,
    });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;