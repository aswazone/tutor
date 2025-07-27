import { notificationController } from "@/dependencies/notification.di";
import { authenticateToken } from "@/middlewares/auth.middleware";
import {Router} from "express";

const notificationRouter = Router();

notificationRouter.get("/",authenticateToken,notificationController.getAllNotifications);
notificationRouter.get("/unread-count",authenticateToken,notificationController.getUnreadCount);
notificationRouter.patch("/read-all",authenticateToken,notificationController.markAllAsRead);
notificationRouter.patch("/read/:notificationId",authenticateToken,notificationController.markAsRead);
notificationRouter.delete("/:notificationId",authenticateToken,notificationController.deleteNotification);


export default notificationRouter