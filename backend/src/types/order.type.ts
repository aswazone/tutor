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

export interface IOrderDTO{
    id: string;
}
 export type approvedPayment ={
    status: string
}

export type OnApproveData = {
    orderID: string;
    payerID?: string | null;
    paymentID?: string | null;
};