import { orderController } from "@/dependencies/order.di";
import { authenticateToken } from "@/middlewares/auth.middleware";
import { Router } from "express";

const orderRouter = Router();
orderRouter.get('/',authenticateToken,orderController.getAllOrders)
orderRouter.post('/create',authenticateToken,orderController.createOrder)
orderRouter.post('/capture/:orderItemId', authenticateToken,orderController.capturePayment)

export default orderRouter;