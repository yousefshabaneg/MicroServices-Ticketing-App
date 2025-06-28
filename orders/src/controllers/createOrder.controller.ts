import { Request, Response } from "express";
import { Order } from "../models/order.model";
import {
  OrderStatus,
  NotFoundError,
  BadRequestError,
} from "@joe-tickets/common";
import { Ticket } from "../models/ticket.model";
import { OrderCreatedPublisher } from "../events/OrderCreatedPublisher";
import { natsWrapper } from "../NatsWrapper";

const EXPIRATION_WINDOW_SECONDS = 15 * 60;
class CreateOrderController {
  static createOrder = async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({
      ticket,
      status: OrderStatus.Created,
      expiresAt: expiration,
      userId: req.currentUser!.id,
    });
    await order.save();

    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      userId: order.userId,
      version: order.version,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });
    res.status(201).json(order);
  };
}

export { CreateOrderController };
