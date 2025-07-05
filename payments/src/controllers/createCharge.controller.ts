import { Request, Response } from "express";
import { Order } from "../models/order.model";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from "@joe-tickets/common";
import { stripe } from "../stripe";
class CreateChargeController {
  static createCharge = async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for a cancelled order");
    }

    const charge = await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100,
      source: token,
    });

    res.status(201).json({ success: true, charge });
  };
}

export { CreateChargeController };
