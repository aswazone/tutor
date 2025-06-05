import { ICreateOrderDTO } from "@/types/order.type";

export interface IOrderService {
    createOrder(userId: string, orderData: ICreateOrderDTO): Promise<void>;
}