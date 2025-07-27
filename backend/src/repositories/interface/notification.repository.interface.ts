import { INotificationModel } from "@/models/interface/notification.model.interface";

export interface INotificationRepository {
    createNotification: (notification: Partial<INotificationModel>) => Promise<INotificationModel>
    getUserNotifications: (userId: string) => Promise<INotificationModel[]>
    markAsRead: (notificationId: string) => Promise<INotificationModel | null>
    markAllRead: (userId: string) => Promise<void>
    deleteNotification: (notificationId: string) => Promise<void>
    getUnreadCount: (userId: string) => Promise<number> 
}