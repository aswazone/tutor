import { IOrderDataDTO } from "@/types/course.type";
import { IOrderModel } from "@/models/interface/order.model.interface";
import { OnApproveData } from "@/types/order.type";

export interface IOrderService {
    createOrder(userId: string, orderData: IOrderDataDTO): Promise<{paypalId: string, orderId: string}>;
    capturePayment(orderItemId: string, data:OnApproveData): Promise<IOrderModel | null>;
}