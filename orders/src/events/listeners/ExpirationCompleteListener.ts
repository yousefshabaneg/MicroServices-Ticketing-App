import {
  Subjects,
  BaseListener,
  ExpirationCompleteEvent,
  OrderStatus,
} from "@joe-tickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket.model";
import { queueGroupName } from "./QueueGroupName";
import { Order } from "../../models/order.model";
import { OrderCancelledPublisher } from "../OrderCancelledPublsiher";
import { natsWrapper } from "../../NatsWrapper";

export class ExpirationCompleteListener extends BaseListener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(
    data: ExpirationCompleteEvent["data"],
    msg: Message
  ): Promise<void> {
    const { orderId } = data;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
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
    msg.ack();
  }
}
