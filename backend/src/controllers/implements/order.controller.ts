import { AuthenticatedRequest } from "@/types/auth.type";
import { Response } from "express";
import { IOrderController } from "../interfaces/order.controller.interface";
import { NextFunction } from "express";
import { IOrderService } from "@/services/interface/order.service.interface";

export class OrderController implements IOrderController {
    constructor (private readonly _orderService:IOrderService) {}

    getAllOrders = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 4;
            const orders = await this._orderService.findAllOrders(page,limit,req.user?.id);
            res.status(200).json(orders);
        } catch (error) {
            next(error);
        }
    };

    createOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> =>{
        try {

            if (!req.user?.id) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const order = await this._orderService.createOrder(req.user.id, req.body);
            res.status(201).json(order);
        } catch (error) {
            next(error);
        }
    };

    capturePayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> =>{
        try {
            const {orderItemId} = req.params;
            if(!orderItemId) {
                res.status(400).json({ message: 'Order item id is required' });
                return;
            }
            const result = await this._orderService.capturePayment(orderItemId,req.body);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };
}