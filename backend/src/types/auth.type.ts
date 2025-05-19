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
