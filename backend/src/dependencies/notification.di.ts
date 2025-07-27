import { NotificationController } from "@/controllers/implements/notification.controller";
import { NotificationRepository } from "@/repositories/implements/notification.repostitory";
import { NotificationService } from "@/services/implements/notification.service";


export const notificationController = new NotificationController(new NotificationService(new NotificationRepository()));
export const notificationService = new NotificationService(new NotificationRepository());