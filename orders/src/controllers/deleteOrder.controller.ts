import { Request, Response } from "express";
import { Order } from "../models/order.model";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from "@joe-tickets/common";
import { OrderCancelledPublisher } from "../events/OrderCancelledPublsiher";
import { natsWrapper } from "../NatsWrapper";

class DeleteOrderController {
  static deleteOrder = async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Complete) {
      throw new BadRequestError("Cannot delete a complete order");
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send();
  };
}

export { DeleteOrderController };
