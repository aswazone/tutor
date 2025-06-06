export interface ICreateOrderDTO{
    userId: string,
    userName: string,
    userEmail: string,
    orderStatus:string,
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