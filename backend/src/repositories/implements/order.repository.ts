import { IOrderModel } from "@/models/interface/order.model.interface";
import { BaseRepository } from "../base.repository";
import { IOrderRepository } from "../interface/order.repository.interface";
import { OrderModel } from "@/models/implements/order.model";
import { ICreateOrderDTO } from "@/types/order.type";

export class OrderRepository extends BaseRepository<IOrderModel> implements IOrderRepository {
    constructor() {
        super(OrderModel);
    }

    async findAllOrders(page=1, limit=4): Promise<IOrderModel[]> {
        const result = await this.model.find().skip((page - 1) * limit).limit(limit).sort({ orderDate: -1 });
        return result;
    }

    async createOrder(data: Partial<ICreateOrderDTO>): Promise<IOrderModel | null> {
        return await super.create(data);
    }

    async findOrderById(id: string): Promise<IOrderModel | null> {
        return await super.findById(id);
    }

    async updateOrder(orderItemId: string, data: Partial<ICreateOrderDTO>): Promise<IOrderModel | null> {
        return await super.findByIdAndUpdate(orderItemId, data);
    }
}