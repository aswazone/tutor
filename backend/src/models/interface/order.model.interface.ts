import { Document } from "mongoose";

export interface IOrderModel extends Document {
    userId: string;
    userName: string;
    userEmail: string;
    orderStatus: string;
    paymentStatus: string;
    paymentMethod: string;
    orderDate: Date;
    paymentId: string;
    payerId: string;
    tutorId: string;
    tutorName: string;
    courseImage: string;
    courseTitle: string;
    courseId: string;
    coursePricing: string
}