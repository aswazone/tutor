import { IOrderModel } from "@/models/interface/order.model.interface";
import { IBaseRepository } from "./base.repository.interface";
import { FindOrdersForUser, ICreateOrderDTO } from "@/types/order.type";

export interface IOrderRepository extends IBaseRepository<IOrderModel> {
    findAllOrders(page: number, limit: number, userId?: string): Promise<FindOrdersForUser>
    createOrder(data: Partial<ICreateOrderDTO>): Promise<IOrderModel | null>;
    findOrderById(id: string): Promise<IOrderModel | null>;
    updateOrder(orderItemId: string, data: Partial<ICreateOrderDTO>): Promise<IOrderModel | null>;
}