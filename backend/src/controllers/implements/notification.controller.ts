import { INotificationService } from "@/services/interface/notification.service.interface";
import { AuthenticatedRequest } from "@/types/auth.type";
import { NextFunction, Response } from "express";
import { INotificationController } from "../interfaces/notification.controller.interface";
export class NotificationController implements INotificationController {

    constructor(
        private readonly _notificationService:INotificationService
    ){}

    getAllNotifications = async (req:AuthenticatedRequest,res:Response,next:NextFunction) => {
        try {
            const notifications = await this._notificationService.getUserNotifications(req.user?.id as string);
            res.json(notifications);
        } catch (error) {
            next(error);
        }
    }

    deleteNotification= async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { notificationId } = req.params;
            await this._notificationService.deleteNotification(notificationId);
            res.status(200).json({ message: 'Notification deleted successfully' });
        } catch (error) {
            next(error);
        }
    }

    markAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { notificationId } = req.params;
            await this._notificationService.markAsRead(notificationId);
            res.status(200).json({ message: 'Notification updated successfully' });
        } catch (error) {
            next(error);
        }
    }

    markAllAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            await this._notificationService.markAllRead(req.user?.id as string);
            res.status(200).json({ message: 'Notifications updated successfully' });
        } catch (error) {
            next(error);
        }
    }

    getUnreadCount = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const count = await this._notificationService.getUnreadCount(req.user?.id as string);
            res.status(200).json({ count });
        } catch (error) {
            next(error);
        }
    }
    
}