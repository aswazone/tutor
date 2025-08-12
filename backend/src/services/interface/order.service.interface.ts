import { IOrderDataDTO } from "@/types/course.type";
import { IOrderModel } from "@/models/interface/order.model.interface";
import { OnApproveData } from "@/types/order.type";
import { IOrderForUsersDTO } from "@/mapper/order.mapper";

export interface IOrderService {
    findAllOrders(page: number, limit: number,userId?: string): Promise<{data: IOrderForUsersDTO[], total: number}>
    createOrder(userId: string, orderData: IOrderDataDTO): Promise<{paypalId: string, orderId: string}>;
    capturePayment(orderItemId: string, data:OnApproveData): Promise<IOrderModel | null>;
}