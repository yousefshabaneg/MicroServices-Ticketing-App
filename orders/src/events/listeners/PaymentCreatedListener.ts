import {
  Subjects,
  BaseListener,
  PaymentCreatedEvent,
  OrderStatus,
} from "@joe-tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./QueueGroupName";
import { Order } from "../../models/order.model";
import { OrderCompletePublisher } from "../OrderCompletePublisher";
import { natsWrapper } from "../../NatsWrapper";

export class PaymentCreatedListener extends BaseListener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(
    data: PaymentCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const { orderId } = data;

    const order = await Order.findById(orderId).populate("ticket");
    if (!order) {
      throw new Error("Order not found");
    }

    order.status = OrderStatus.Complete;
    await order.save();

    await new OrderCompletePublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });
    msg.ack();
  }
}
