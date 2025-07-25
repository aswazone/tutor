import { NotificationRepository } from "@/repositories/implements/notification.repostitory";
import { NotificationService } from "@/services/implements/notification.service";


export const notificationService = new NotificationService(new NotificationRepository());
