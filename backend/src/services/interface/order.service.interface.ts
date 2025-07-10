import { IOrderDataDTO } from "@/types/course.type";
import { IOrderModel } from "@/models/interface/order.model.interface";
import { OnApproveData } from "@/types/order.type";

export interface IOrderService {
    findAllOrders(page: number, limit: number,userId?: string): Promise<IOrderModel[]>
    createOrder(userId: string, orderData: IOrderDataDTO): Promise<{paypalId: string, orderId: string}>;
    capturePayment(orderItemId: string, data:OnApproveData): Promise<IOrderModel | null>;
}