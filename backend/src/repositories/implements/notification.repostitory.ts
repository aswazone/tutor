import { INotificationModel } from "@/models/interface/notification.model.interface";
import { BaseRepository } from "../base.repository";
import { INotificationRepository } from "../interface/notification.repository.interface";
import { NotificationModel } from "@/models/implements/notification.model";

export class NotificationRepository extends BaseRepository<INotificationModel> implements INotificationRepository {
    constructor() {
        super(NotificationModel);
    }

    async createNotification(data: Partial<INotificationModel>): Promise<INotificationModel> {
        return await this.model.create(data);
    }

    async getUserNotifications(userId: string): Promise<INotificationModel[]> {
        return await this.model.find({ 
            userId, 
            isDeleted: false 
        })
        .sort({ createdAt: -1 })
    }

    async markAsRead(notificationId: string): Promise<INotificationModel | null> {
        return await this.model.findByIdAndUpdate(
          notificationId,
          { isRead: true },
          { new: true }
        );
    }

    async markAllRead(userId: string): Promise<void> {
        await this.model.updateMany(
          { userId, isRead: false },
          { isRead: true }
        );
    }

    async deleteNotification(notificationId: string): Promise<void> {
        await this.model.findByIdAndUpdate(
          notificationId,
          { isDeleted: true }
        );
    }

    async getUnreadCount(userId: string): Promise<number> {
        return await this.model.countDocuments({
          userId,
          isRead: false,
          isDeleted: false
        });
    }
}

