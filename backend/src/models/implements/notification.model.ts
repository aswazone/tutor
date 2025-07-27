import { Notification } from "@/schema/notification.schema";
import { INotificationModel } from "../interface/notification.model.interface";
import { Model } from "mongoose";

export const NotificationModel: Model<INotificationModel> = Notification;