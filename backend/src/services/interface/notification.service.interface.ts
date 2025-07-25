import { INotificationModel } from "@/models/interface/notification.model.interface";

export interface INotificationService {
    getUnreadCount(userId: string): Promise<number>;
    markAllRead(userId: string): Promise<void>;
    deleteNotification(userId: string, notificationId: string): Promise<void>;
    markAsRead(userId: string, notificationId: string): Promise<INotificationModel | null>;
    getUserNotifications(userId: string): Promise<INotificationModel[]>;
}