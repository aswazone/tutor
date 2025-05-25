import { Request } from 'express';
import { UserRole } from './user.type';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: UserRole;
        userName: string;
        userEmail: string;
    };
}

export interface Tutor {
  id: string
  name: string
  email: string
  isActive: boolean
  rating: number
  coursesCount: number
}