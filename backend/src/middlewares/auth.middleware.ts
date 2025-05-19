import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { HttpError } from '../utils/http-error.utils';
import { JWT_ACCESS_SECRET_KEY } from '@/config/env.config';
import { AuthenticatedRequest } from '@/types/auth.type';
import { HttpStatus } from '@/constants/status.constant';
import { verifyAccessToken } from '@/utils';
import { HttpResponse } from '@/constants/response.constant';

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, 'Authentication token is required');
    }

    if (!JWT_ACCESS_SECRET_KEY) {
      throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Server configuration error');
    }

    try {
      const decoded = verifyAccessToken(token);
      if (!decoded) {
        throw new HttpError(HttpStatus.UNAUTHORIZED, HttpResponse.TOKEN_EXPIRED);
      }

      if (typeof decoded === 'string') {
        throw new HttpError(HttpStatus.UNAUTHORIZED, 'Invalid token');
      }

      const { id, role, userName, userEmail } = decoded as JwtPayload;
      req.user = { id, role, userName, userEmail };

      
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new HttpError(HttpStatus.UNAUTHORIZED, HttpResponse.TOKEN_EXPIRED);
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};