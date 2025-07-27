import { notificationService } from "@/dependencies/notification.di";
import { INotificationModel } from "@/models/interface/notification.model.interface";
import { ioInstance } from "@/socket/socketHandler";

export const sendNotificationToUsers = async (userIds: string[], notificationData: Partial<INotificationModel>) => {
    try {
        for(const userId of userIds){
            const notification = await notificationService.createNotification({...notificationData, userId});
    
            if(ioInstance){
                console.log('ioInstance-calling');
                ioInstance.to(userId).emit('newNotification', notification);
            }
        }
    } catch (error) {
        console.log(error);
        console.log('error in sendNotificationToUsers');
    }
};

export const sendNotificationToUser = async (userId: string, notificationData: Partial<INotificationModel>) => {
    try {
        const notification = await notificationService.createNotification({...notificationData, userId});
    
        if(ioInstance){
            console.log('ioInstance-calling');
            ioInstance.to(userId).emit('newNotification', notification);
        }
    } catch (error) {
        console.log(error);
        console.log('error in sendNotificationToUser');
    }
};