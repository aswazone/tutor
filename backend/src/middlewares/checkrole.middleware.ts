import { AuthenticatedRequest } from "@/types/auth.type";
import { NextFunction, Response } from "express";

export const checkRole = (role: string) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        const user = req?.user;

        if (!user) {
            console.log('User is not authenticated');
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        if (user.role !== role) {
            console.log(`User role: ${user.role} is 🚩not equal to ${role}`);
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        console.log(`User role: ${user.role} is equal to ${role}`);
        next();
    };
};