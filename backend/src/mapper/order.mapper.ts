import { IOrderModel } from "@/models/interface/order.model.interface"

export interface IOrderForUsersDTO {
    userId: string,
    userName: string,
    userEmail: string,
    orderStatus:string,
    paymentStatus: string,
    paymentMethod: string,
    orderDate: Date,
    paymentId: string,
    payerId: string,
    tutorId: string,
    tutorName: string,
    courseImage: string,
    courseTitle: string,
    courseId: string,
    coursePricing: string
}

export const toOrderDTO = (order: IOrderModel): IOrderForUsersDTO => {
    return {
        userId: order.userId as string,
        userName: order.userName as string,
        userEmail: order.userEmail as string,
        orderStatus: order.orderStatus as string,
        paymentStatus: order.paymentStatus as string,
        paymentMethod: order.paymentMethod as string,
        orderDate: order.orderDate as Date,
        paymentId: order.paymentId as string,
        payerId: order.payerId as string,
        tutorId: order.tutorId as string,
        tutorName: order.tutorName as string,
        courseImage: order.courseImage as string,
        courseTitle: order.courseTitle as string,
        courseId: order.courseId as string,
        coursePricing: order.coursePricing as string
    }
}

export const toOrderDTOs = (orders: IOrderModel[]): IOrderForUsersDTO[] => {
    return orders.map(toOrderDTO);
}