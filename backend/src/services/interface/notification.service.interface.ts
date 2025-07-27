import { INotificationDTO } from "@/mapper/notification.mapper";
import { INotificationModel } from "@/models/interface/notification.model.interface";

export interface INotificationService {
    getUnreadCount(userId: string): Promise<number>;
    markAllRead(userId: string): Promise<void>;
    deleteNotification(notificationId: string): Promise<void>;
    markAsRead(notificationId: string): Promise<void>;
    getUserNotifications(userId: string): Promise<INotificationDTO[]>;
    createNotification(data: Partial<INotificationModel>): Promise<INotificationModel>;
}