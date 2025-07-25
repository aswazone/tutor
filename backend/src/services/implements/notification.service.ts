import { INotificationModel } from "@/models/interface/notification.model.interface";
import { INotificationRepository } from "@/repositories/interface/notification.repository.interface";
import { INotificationService } from "../interface/notification.service.interface";

export class NotificationService implements INotificationService {
    constructor(
        private readonly _notificationRepository: INotificationRepository
    ) {}

    async getUnreadCount(userId: string): Promise<number> {
        return this._notificationRepository.getUnreadCount(userId);
    }

    async markAllRead(userId: string): Promise<void> {
        return this._notificationRepository.markAllRead(userId);
    }

    async deleteNotification(notificationId: string): Promise<void> {
        return this._notificationRepository.deleteNotification(notificationId);
    }

    async markAsRead(userId: string, notificationId: string): Promise<INotificationModel | null> {
        return this._notificationRepository.markAsRead(userId, notificationId);
    }

    async getUserNotifications(userId: string): Promise<INotificationModel[]> {
        return this._notificationRepository.getUserNotifications(userId);
    }

}