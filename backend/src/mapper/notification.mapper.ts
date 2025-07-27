import { INotificationModel } from "@/models/interface/notification.model.interface";

export interface INotificationDTO {
    _id: string;
    userId: string;
    title: string;
    message: string;
    relatedId?: string;
    type:
    | 'REVENUE_EARNED'
    | 'COURSE_PURCHASED'
    | 'COURSE_APPROVED'
    | 'COURSE_DECLINED'
    | 'COURSE_ENABLED'
    | 'COURSE_DISABLED'
    | 'COURSE_CREATION'
    | 'COURSE_BLOCKED'
    | 'NEW_MESSAGE';
    isRead: boolean;
}

export const toNotificationDTO = (notification: INotificationModel): INotificationDTO => {
    return {
        _id:(notification._id as string).toString(),
        userId: notification.userId,
        title: notification.title,
        message: notification.message,
        relatedId: (notification.relatedId as string).toString(),
        type: notification.type,
        isRead: notification.isRead
    }
}

export const toNotificationDTOs = (notifications: INotificationModel[]): INotificationDTO[] => {
    return notifications.map(toNotificationDTO);
}
