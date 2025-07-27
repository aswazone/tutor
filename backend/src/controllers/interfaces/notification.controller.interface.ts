import { AuthenticatedRequest } from "@/types/auth.type";
import { NextFunction , Response } from "express";

export interface INotificationController {
    getAllNotifications: (req: AuthenticatedRequest, res: Response,next:NextFunction) => Promise<void>;
    deleteNotification: (req: AuthenticatedRequest, res: Response,next:NextFunction) => Promise<void>;
    markAsRead: (req: AuthenticatedRequest, res: Response,next:NextFunction) => Promise<void>;
    markAllAsRead: (req: AuthenticatedRequest, res: Response,next:NextFunction) => Promise<void>;
}