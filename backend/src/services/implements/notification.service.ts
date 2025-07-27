import { INotificationModel } from "@/models/interface/notification.model.interface";
import { INotificationRepository } from "@/repositories/interface/notification.repository.interface";
import { INotificationService } from "../interface/notification.service.interface";
import { INotificationDTO, toNotificationDTOs } from "@/mapper/notification.mapper";

export class NotificationService implements INotificationService {
    constructor(
        private readonly _notificationRepository: INotificationRepository
    ) {}

    getUnreadCount = async (userId: string): Promise<number> => {
        return this._notificationRepository.getUnreadCount(userId);
    }

    markAllRead = async (userId: string): Promise<void> => {
        console.log(userId);
        const result = await this._notificationRepository.markAllRead(userId);
        console.log(result);
    }

    deleteNotification = async (notificationId: string): Promise<void> => {
        console.log(notificationId);
        return this._notificationRepository.deleteNotification(notificationId);
    }

    markAsRead = async (notificationId: string): Promise<void> => {
        console.log(notificationId);
        await this._notificationRepository.markAsRead(notificationId);

    }

    getUserNotifications = (userId: string): Promise<INotificationDTO[]> => this._notificationRepository.getUserNotifications(userId).then(notifications => toNotificationDTOs(notifications));

    createNotification = (data: Partial<INotificationModel>): Promise<INotificationModel> => this._notificationRepository.createNotification(data);


}