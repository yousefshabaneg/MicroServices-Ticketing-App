import { Request, Response } from "express";
import { Order } from "../models/order.model";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from "@joe-tickets/common";
import { stripe } from "../stripe";
import { Payment } from "../models/payment.model";
import { natsWrapper } from "../NatsWrapper";
import { PaymentCreatedPublisher } from "../events/publishers/PaymentCreatedPublisher";
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

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });

    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).json({ success: true, payment });
  };
}

export { CreateChargeController };
