import { Model } from "mongoose";
import { IOrderModel } from "../interface/order.model.interface";
import { Order } from "@/schema/order.schema";

export const OrderModel:Model<IOrderModel> = Order;