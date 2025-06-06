import { ICourse } from "@/types/course.type";
import { OnApproveData } from "../implements/order.service";
import { IOrderModel } from "@/models/interface/order.model.interface";

export interface IOrderService {
    createOrder(userId: string, orderData: ICourse): Promise<{paypalId: string, orderId: string}>;
    capturePayment(orderItemId: string, data:OnApproveData): Promise<IOrderModel | null>;
}