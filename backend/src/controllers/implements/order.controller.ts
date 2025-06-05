import { AuthenticatedRequest } from "@/types/auth.type";
import { Response } from "express";
import { IOrderController } from "../interfaces/order.controller.interface";
import { NextFunction } from "express";
import { IOrderService } from "@/services/interface/order.service.interface";

export class OrderController implements IOrderController {
    constructor (private readonly _orderService:IOrderService) {}

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
}