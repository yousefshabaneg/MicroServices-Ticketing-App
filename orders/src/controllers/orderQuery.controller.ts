import { Request, Response } from "express";
import { Order } from "../models/order.model";
import { NotAuthorizedError, NotFoundError } from "@joe-tickets/common";

class OrderQueryController {
  static getOrderById = async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.status(200).json(order);
  };

  static getOrders = async (req: Request, res: Response) => {
    const orders = await Order.find({
      userId: req.currentUser!.id,
    }).populate("ticket");

    res.status(200).json(orders);
  };
}

export { OrderQueryController };
