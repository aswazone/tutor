// import { ICreateOrderDTO } from "@/types/order.type";
// import { IOrderService } from "../interface/order.service.interface";
// import { createPaypalOrder } from "@/utils/paypal.utils";

// export class OrderService implements IOrderService {
//     constructor(private readonly _orderRepository:IOrderRepository){}

//     createOrder = async (userId: string, orderData: ICreateOrderDTO)=> {
//         const order = await createPaypalOrder(orderData);

//         if(!order) throw new Error('Failed to create order');

//         const createdOrder = await this._orderRepository.create(orderData);
//         return createdOrder;
//         console.log(order,'paypal-ordered response');
//     }
// }