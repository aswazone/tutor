import { IOrderModel } from "@/models/interface/order.model.interface";
import { model, Schema } from "mongoose";

const OrderSchema = new Schema({
    userId: String,
    userName: String,
    userEmail: String,
    orderStatus:String,
    paymentMethod: String,
    orderDate: Date,
    paymentId: String,
    payerId: String,
    tutorId: String,
    tutorName: String,
    courseImage: String,
    courseTitle: String,
    courseId: String,
    coursePricing: String
})

export const Order = model<IOrderModel>('Order', OrderSchema);